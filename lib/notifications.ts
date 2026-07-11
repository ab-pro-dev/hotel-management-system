import prisma from "@/lib/prisma";

export async function createNotification(userId: string, message: string) {
  return prisma.notification.create({
    data: { userId, message },
  });
}

export async function getUnreadCount(userId: string) {
  return prisma.notification.count({
    where: { userId, read: false },
  });
}

export async function markAllRead(userId: string) {
  return prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
}
