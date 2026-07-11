"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { markAllRead as markAllReadDb } from "@/lib/notifications";

export async function getNotifications() {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    return await prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  } catch (error) {
    console.error(`[getNotifications] Failed to load notifications for user ${session.user.id}:`, error);
    throw new Error("Failed to load notifications. Please try again.");
  }
}

export async function getUnreadCount() {
  const session = await auth();
  if (!session?.user?.id) return 0;

  try {
    return await prisma.notification.count({
      where: { userId: session.user.id, read: false },
    });
  } catch (error) {
    console.error(`[getUnreadCount] Failed to count unread notifications for user ${session.user.id}:`, error);
    throw new Error("Failed to check notifications. Please try again.");
  }
}

export async function markAllNotificationsRead() {
  const session = await auth();
  if (!session?.user?.id) return;

  try {
    return await markAllReadDb(session.user.id);
  } catch (error) {
    console.error(`[markAllNotificationsRead] Failed to mark notifications read for user ${session.user.id}:`, error);
    throw new Error("Failed to mark notifications as read. Please try again.");
  }
}
