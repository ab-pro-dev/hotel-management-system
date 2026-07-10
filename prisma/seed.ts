import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  const adminPasswordHash = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@hotel.com" },
    update: {},
    create: {
      name: "Grand Raya Admin",
      email: "admin@hotel.com",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });
  console.log(`Created admin user: ${admin.email}`);

  const roomTypes = await Promise.all([
    prisma.roomType.upsert({
      where: { id: "standard-room" },
      update: {},
      create: {
        id: "standard-room",
        title: "Standard Room",
        description:
          "A comfortable room with modern amenities, featuring a queen-size bed, work desk, and en-suite bathroom. Perfect for solo travelers or couples.",
        basePrice: 129.0,
        capacity: 2,
      },
    }),
    prisma.roomType.upsert({
      where: { id: "deluxe-room" },
      update: {},
      create: {
        id: "deluxe-room",
        title: "Deluxe Room",
        description:
          "An elegantly appointed room with premium furnishings, king-size bed, sitting area, and panoramic views. Includes complimentary minibar and bathrobes.",
        basePrice: 219.0,
        capacity: 2,
      },
    }),
    prisma.roomType.upsert({
      where: { id: "suite" },
      update: {},
      create: {
        id: "suite",
        title: "Executive Suite",
        description:
          "A spacious suite with separate living area, king-size bed, luxury bathroom with soaking tub, and stunning city views. Ideal for extended stays or special occasions.",
        basePrice: 389.0,
        capacity: 4,
      },
    }),
  ]);
  console.log(`Created ${roomTypes.length} room types`);

  const rooms = [
    { roomNumber: "101", roomTypeId: "standard-room" },
    { roomNumber: "102", roomTypeId: "standard-room" },
    { roomNumber: "103", roomTypeId: "standard-room" },
    { roomNumber: "201", roomTypeId: "deluxe-room" },
    { roomNumber: "202", roomTypeId: "deluxe-room" },
    { roomNumber: "203", roomTypeId: "deluxe-room" },
    { roomNumber: "301", roomTypeId: "suite" },
    { roomNumber: "302", roomTypeId: "suite" },
  ];

  for (const room of rooms) {
    await prisma.room.upsert({
      where: { roomNumber: room.roomNumber },
      update: {},
      create: {
        roomNumber: room.roomNumber,
        roomTypeId: room.roomTypeId,
        status: "AVAILABLE",
      },
    });
  }
  console.log(`Created ${rooms.length} rooms`);

  console.log("Seeding complete!");
  console.log("Admin login: admin@hotel.com / admin123");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
