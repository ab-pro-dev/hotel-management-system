-- CreateTable
CREATE TABLE "Waitlist" (
    "id" TEXT NOT NULL,
    "guestEmail" TEXT NOT NULL,
    "roomTypeId" TEXT NOT NULL,
    "requestedCheckIn" TIMESTAMP(3) NOT NULL,
    "requestedCheckOut" TIMESTAMP(3) NOT NULL,
    "notified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Waitlist_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Waitlist" ADD CONSTRAINT "Waitlist_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "RoomType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
