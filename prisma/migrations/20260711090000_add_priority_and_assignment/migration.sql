-- CreateEnum
CREATE TYPE "RequestPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- AlterTable
ALTER TABLE "ServiceRequest" ADD COLUMN "priority" "RequestPriority" NOT NULL DEFAULT 'MEDIUM';
ALTER TABLE "ServiceRequest" ADD COLUMN "assignedToUserId" TEXT;

-- AddForeignKey
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_assignedToUserId_fkey" FOREIGN KEY ("assignedToUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
