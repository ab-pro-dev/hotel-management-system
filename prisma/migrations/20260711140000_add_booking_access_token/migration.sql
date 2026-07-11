-- AlterTable
ALTER TABLE "Booking" ADD COLUMN "bookingAccessToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Booking_bookingAccessToken_key" ON "Booking"("bookingAccessToken");
