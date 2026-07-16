"use server";

import { z } from "zod";
import { Role } from "@prisma/client";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { logAudit } from "@/lib/audit";

const propertySchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
});

const propertyUpdateSchema = propertySchema.partial();

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    throw new Error("Unauthorized: ADMIN role required");
  }
  return session.user;
}

export async function createProperty(data: z.infer<typeof propertySchema>) {
  const user = await requireAdmin();
  const parsed = propertySchema.parse(data);

  try {
    const property = await prisma.property.create({ data: parsed });
    await logAudit({ userId: user.id, action: "CREATE", targetTable: "Property", targetId: property.id, metadata: { name: property.name } });
    return property;
  } catch (error) {
    console.error(`[createProperty] Failed to create property:`, error);
    throw new Error("Failed to create property. Please try again.");
  }
}

export async function updateProperty(id: string, data: z.infer<typeof propertyUpdateSchema>) {
  const user = await requireAdmin();
  const parsed = propertyUpdateSchema.parse(data);

  try {
    const property = await prisma.property.update({ where: { id }, data: parsed });
    await logAudit({ userId: user.id, action: "UPDATE", targetTable: "Property", targetId: property.id, metadata: parsed });
    return property;
  } catch (error) {
    console.error(`[updateProperty] Failed to update property ${id}:`, error);
    throw new Error("Failed to update property. Please try again.");
  }
}

const deletePropertySchema = z.string().min(1, "Property ID is required");

export async function deleteProperty(id: string) {
  const user = await requireAdmin();
  const validId = deletePropertySchema.parse(id);

  const property = await prisma.property.findUnique({
    where: { id: validId },
    include: { _count: { select: { roomTypes: true } } },
  });

  if (property && property._count.roomTypes > 0) {
    throw new Error("Cannot delete property with associated room types. Remove room types first.");
  }

  try {
    const deleted = await prisma.property.delete({ where: { id: validId } });
    await logAudit({ userId: user.id, action: "DELETE", targetTable: "Property", targetId: deleted.id, metadata: { name: deleted.name } });
    return deleted;
  } catch (error) {
    console.error(`[deleteProperty] Failed to delete property ${validId}:`, error);
    throw new Error("Failed to delete property. Please try again.");
  }
}
