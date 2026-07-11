"use server";

import { z } from "zod";
import { ServiceRequestType, ServiceRequestStatus, RequestPriority } from "@prisma/client";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher-server";
import { createNotification } from "@/lib/notifications";

const idSchema = z.string().min(1, "ID is required");

const createServiceRequestSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  type: z.nativeEnum(ServiceRequestType, { error: "Invalid request type" }),
  message: z.string().min(1, "Message is required").max(1000, "Message is too long"),
  priority: z.nativeEnum(RequestPriority).default("MEDIUM"),
});

const updateStatusSchema = z.object({
  requestId: z.string().min(1, "Request ID is required"),
  status: z.nativeEnum(ServiceRequestStatus, { error: "Invalid status" }),
});

const assignSchema = z.object({
  requestId: z.string().min(1, "Request ID is required"),
  assignedToUserId: z.string().nullable(),
});

const CHANNEL_MAP: Record<ServiceRequestType, string> = {
  HOUSEKEEPING: "housekeeping-requests",
  FRONT_DESK: "front-desk-requests",
  MAINTENANCE: "maintenance-requests",
};

export async function createServiceRequest(
  bookingId: string,
  type: ServiceRequestType,
  message: string,
  priority: RequestPriority = "MEDIUM"
) {
  const data = createServiceRequestSchema.parse({ bookingId, type, message, priority });

  const booking = await prisma.booking.findUnique({ where: { id: data.bookingId } });
  if (!booking) throw new Error("Booking not found");
  if (booking.status !== "CHECKED_IN") {
    throw new Error("Service requests can only be created for checked-in guests");
  }

  try {
    const request = await prisma.serviceRequest.create({
      data: {
        bookingId: data.bookingId,
        type: data.type,
        message: data.message,
        status: "OPEN",
        priority: data.priority,
      },
    });

    await pusherServer.trigger(CHANNEL_MAP[data.type], "service-request-created", {
      id: request.id,
      bookingId: request.bookingId,
      type: request.type,
      message: request.message,
      status: request.status,
      createdAt: request.createdAt.toISOString(),
    });

    return request;
  } catch (error) {
    console.error(`[createServiceRequest] Failed to create service request for booking ${data.bookingId}:`, error);
    throw new Error("Failed to submit service request. Please try again.");
  }
}

export async function updateServiceRequestStatus(
  requestId: string,
  status: ServiceRequestStatus
) {
  const data = updateStatusSchema.parse({ requestId, status });

  const session = await auth();
  if (!session?.user || !["RECEPTIONIST", "HOUSEKEEPER", "ADMIN"].includes(session.user.role)) {
    throw new Error("Unauthorized: staff role required");
  }

  const request = await prisma.serviceRequest.findUnique({ where: { id: data.requestId } });
  if (!request) throw new Error("Service request not found");

  try {
    const updated = await prisma.serviceRequest.update({
      where: { id: data.requestId },
      data: { status: data.status },
    });

    await pusherServer.trigger(CHANNEL_MAP[updated.type], "service-request-updated", {
      id: updated.id,
      status: updated.status,
    });

    const booking = await prisma.booking.findUnique({
      where: { id: updated.bookingId },
      select: { guestId: true },
    });

    if (booking) {
      await createNotification(
        booking.guestId,
        `Your ${updated.type.toLowerCase().replace("_", " ")} request has been ${data.status.toLowerCase()}.`
      );
    }

    return updated;
  } catch (error) {
    console.error(`[updateServiceRequestStatus] Failed to update request ${data.requestId}:`, error);
    throw new Error("Failed to update service request. Please try again.");
  }
}

export async function assignServiceRequest(
  requestId: string,
  assignedToUserId: string | null
) {
  const data = assignSchema.parse({ requestId, assignedToUserId });

  const session = await auth();
  if (!session?.user || !["RECEPTIONIST", "ADMIN"].includes(session.user.role)) {
    throw new Error("Unauthorized: RECEPTIONIST or ADMIN role required");
  }

  const request = await prisma.serviceRequest.findUnique({ where: { id: data.requestId } });
  if (!request) throw new Error("Service request not found");

  try {
    const updated = await prisma.serviceRequest.update({
      where: { id: data.requestId },
      data: { assignedToUserId: data.assignedToUserId },
    });

    await pusherServer.trigger(CHANNEL_MAP[updated.type], "service-request-updated", {
      id: updated.id,
      assignedToUserId: updated.assignedToUserId,
    });

    return updated;
  } catch (error) {
    console.error(`[assignServiceRequest] Failed to assign request ${data.requestId}:`, error);
    throw new Error("Failed to assign service request. Please try again.");
  }
}

export async function listStaff() {
  const session = await auth();
  if (!session?.user || !["RECEPTIONIST", "ADMIN"].includes(session.user.role)) {
    throw new Error("Unauthorized: RECEPTIONIST or ADMIN role required");
  }

  try {
    return await prisma.user.findMany({
      where: { role: { in: ["RECEPTIONIST", "HOUSEKEEPER", "ADMIN"] } },
      select: { id: true, name: true, role: true },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error(`[listStaff] Failed to list staff:`, error);
    throw new Error("Failed to load staff list. Please try again.");
  }
}
