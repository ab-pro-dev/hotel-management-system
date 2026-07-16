"use server";

import { z } from "zod";
import { Role } from "@prisma/client";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { logAudit } from "@/lib/audit";

const waitlistSchema = z.object({
  guestEmail: z.string().email("Valid email is required"),
  roomTypeId: z.string().min(1, "Room type is required"),
  requestedCheckIn: z.string().min(1, "Check-in date is required"),
  requestedCheckOut: z.string().min(1, "Check-out date is required"),
});

const waitlistUpdateSchema = waitlistSchema.partial();

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    throw new Error("Unauthorized: ADMIN role required");
  }
  return session.user;
}

export async function createWaitlistEntry(data: z.infer<typeof waitlistSchema>) {
  const user = await requireAdmin();
  const parsed = waitlistSchema.parse(data);

  try {
    const entry = await prisma.waitlist.create({
      data: {
        guestEmail: parsed.guestEmail,
        roomTypeId: parsed.roomTypeId,
        requestedCheckIn: new Date(parsed.requestedCheckIn),
        requestedCheckOut: new Date(parsed.requestedCheckOut),
      },
    });
    await logAudit({ userId: user.id, action: "CREATE", targetTable: "Waitlist", targetId: entry.id, metadata: { guestEmail: entry.guestEmail } });
    return entry;
  } catch (error) {
    console.error(`[createWaitlistEntry] Failed to create waitlist entry:`, error);
    throw new Error("Failed to create waitlist entry. Please try again.");
  }
}

export async function updateWaitlistEntry(id: string, data: z.infer<typeof waitlistUpdateSchema>) {
  const user = await requireAdmin();
  const parsed = waitlistUpdateSchema.parse(data);

  try {
    const entry = await prisma.waitlist.update({
      where: { id },
      data: {
        ...parsed,
        requestedCheckIn: parsed.requestedCheckIn ? new Date(parsed.requestedCheckIn) : undefined,
        requestedCheckOut: parsed.requestedCheckOut ? new Date(parsed.requestedCheckOut) : undefined,
      },
    });
    await logAudit({ userId: user.id, action: "UPDATE", targetTable: "Waitlist", targetId: entry.id, metadata: { guestEmail: entry.guestEmail } });
    return entry;
  } catch (error) {
    console.error(`[updateWaitlistEntry] Failed to update waitlist entry ${id}:`, error);
    throw new Error("Failed to update waitlist entry. Please try again.");
  }
}

const deleteWaitlistSchema = z.string().min(1, "Waitlist entry ID is required");

export async function deleteWaitlistEntry(id: string) {
  const user = await requireAdmin();
  const validId = deleteWaitlistSchema.parse(id);

  try {
    const entry = await prisma.waitlist.delete({ where: { id: validId } });
    await logAudit({ userId: user.id, action: "DELETE", targetTable: "Waitlist", targetId: entry.id, metadata: { guestEmail: entry.guestEmail } });
    return entry;
  } catch (error) {
    console.error(`[deleteWaitlistEntry] Failed to delete waitlist entry ${validId}:`, error);
    throw new Error("Failed to delete waitlist entry. Please try again.");
  }
}
