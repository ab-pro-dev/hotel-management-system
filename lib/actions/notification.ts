"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { markAllRead as markAllReadDb } from "@/lib/notifications";

export async function getNotifications() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}

export async function getUnreadCount() {
  const session = await auth();
  if (!session?.user?.id) return 0;

  return prisma.notification.count({
    where: { userId: session.user.id, read: false },
  });
}

export async function markAllNotificationsRead() {
  const session = await auth();
  if (!session?.user?.id) return;

  return markAllReadDb(session.user.id);
}
