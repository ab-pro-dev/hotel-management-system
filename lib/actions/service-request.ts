"use server";

import { ServiceRequestType, ServiceRequestStatus } from "@prisma/client";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher-server";

const CHANNEL_MAP: Record<ServiceRequestType, string> = {
  HOUSEKEEPING: "housekeeping-requests",
  FRONT_DESK: "front-desk-requests",
  MAINTENANCE: "maintenance-requests",
};

export async function createServiceRequest(
  bookingId: string,
  type: ServiceRequestType,
  message: string
) {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw new Error("Booking not found");
  if (booking.status !== "CHECKED_IN") {
    throw new Error("Service requests can only be created for checked-in guests");
  }

  const request = await prisma.serviceRequest.create({
    data: {
      bookingId,
      type,
      message,
      status: "OPEN",
    },
  });

  await pusherServer.trigger(CHANNEL_MAP[type], "service-request-created", {
    id: request.id,
    bookingId: request.bookingId,
    type: request.type,
    message: request.message,
    status: request.status,
    createdAt: request.createdAt.toISOString(),
  });

  return request;
}

export async function updateServiceRequestStatus(
  requestId: string,
  status: ServiceRequestStatus
) {
  const session = await auth();
  if (!session?.user || !["RECEPTIONIST", "HOUSEKEEPER", "ADMIN"].includes(session.user.role)) {
    throw new Error("Unauthorized: staff role required");
  }

  const request = await prisma.serviceRequest.findUnique({ where: { id: requestId } });
  if (!request) throw new Error("Service request not found");

  const updated = await prisma.serviceRequest.update({
    where: { id: requestId },
    data: { status },
  });

  await pusherServer.trigger(CHANNEL_MAP[updated.type], "service-request-updated", {
    id: updated.id,
    status: updated.status,
  });

  return updated;
}
