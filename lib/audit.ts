import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type AuditInput = {
  userId: string;
  action: string;
  targetTable: string;
  targetId: string;
  metadata?: Record<string, unknown>;
};

export async function logAudit(input: AuditInput) {
  return prisma.auditLog.create({
    data: {
      userId: input.userId,
      action: input.action,
      targetTable: input.targetTable,
      targetId: input.targetId,
      metadata: input.metadata ? (input.metadata as Prisma.InputJsonValue) : undefined,
    },
  });
}
