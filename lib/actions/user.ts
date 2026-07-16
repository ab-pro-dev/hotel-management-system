"use server";

import { z } from "zod";
import { Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { logAudit } from "@/lib/audit";

const staffRoles = ["RECEPTIONIST", "HOUSEKEEPER", "ADMIN"] as const;

const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.enum(staffRoles, { message: "Role is required" }),
});

const updateUserRoleSchema = z.object({
  role: z.enum(staffRoles, { message: "Role is required" }),
});

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    throw new Error("Unauthorized: ADMIN role required");
  }
  return session.user;
}

function generateTempPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export async function createStaffUser(data: z.infer<typeof createUserSchema>) {
  const admin = await requireAdmin();
  const parsed = createUserSchema.parse(data);

  const existing = await prisma.user.findUnique({ where: { email: parsed.email } });
  if (existing) {
    throw new Error("A user with this email already exists.");
  }

  const tempPassword = generateTempPassword();
  const passwordHash = await bcrypt.hash(tempPassword, 10);

  try {
    const user = await prisma.user.create({
      data: {
        name: parsed.name,
        email: parsed.email,
        role: parsed.role as Role,
        passwordHash,
      },
    });

    await logAudit({
      userId: admin.id,
      action: "CREATE",
      targetTable: "User",
      targetId: user.id,
      metadata: { name: user.name, email: user.email, role: user.role },
    });

    return { user, tempPassword };
  } catch (error) {
    console.error(`[createStaffUser] Failed to create staff user:`, error);
    throw new Error("Failed to create staff user. Please try again.");
  }
}

export async function listStaffUsers() {
  await requireAdmin();

  try {
    return await prisma.user.findMany({
      where: { role: { in: [...staffRoles] as Role[] } },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error(`[listStaffUsers] Failed to list staff users:`, error);
    throw new Error("Failed to load staff users. Please try again.");
  }
}

export async function updateUserRole(id: string, data: z.infer<typeof updateUserRoleSchema>) {
  const admin = await requireAdmin();
  const parsed = updateUserRoleSchema.parse(data);

  try {
    const user = await prisma.user.update({
      where: { id },
      data: { role: parsed.role as Role },
    });

    await logAudit({
      userId: admin.id,
      action: "UPDATE",
      targetTable: "User",
      targetId: user.id,
      metadata: { name: user.name, email: user.email, role: user.role },
    });

    return user;
  } catch (error) {
    console.error(`[updateUserRole] Failed to update user ${id}:`, error);
    throw new Error("Failed to update user role. Please try again.");
  }
}

export async function deactivateUser(id: string) {
  const admin = await requireAdmin();

  if (admin.id === id) {
    throw new Error("You cannot deactivate your own account.");
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    await logAudit({
      userId: admin.id,
      action: "DEACTIVATE",
      targetTable: "User",
      targetId: user.id,
      metadata: { name: user.name, email: user.email, role: user.role },
    });

    return user;
  } catch (error) {
    console.error(`[deactivateUser] Failed to deactivate user ${id}:`, error);
    throw new Error("Failed to deactivate user. Please try again.");
  }
}

export async function reactivateUser(id: string) {
  const admin = await requireAdmin();

  try {
    const user = await prisma.user.update({
      where: { id },
      data: { isActive: true },
    });

    await logAudit({
      userId: admin.id,
      action: "REACTIVATE",
      targetTable: "User",
      targetId: user.id,
      metadata: { name: user.name, email: user.email, role: user.role },
    });

    return user;
  } catch (error) {
    console.error(`[reactivateUser] Failed to reactivate user ${id}:`, error);
    throw new Error("Failed to reactivate user. Please try again.");
  }
}
