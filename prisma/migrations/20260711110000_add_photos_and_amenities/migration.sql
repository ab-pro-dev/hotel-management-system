-- AlterTable
ALTER TABLE "RoomType" ADD COLUMN "photoUrls" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "RoomType" ADD COLUMN "amenities" TEXT[] DEFAULT ARRAY[]::TEXT[];
