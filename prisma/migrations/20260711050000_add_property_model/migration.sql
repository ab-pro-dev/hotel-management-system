-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- InsertSeedProperty
INSERT INTO "Property" ("id", "name", "address", "createdAt")
VALUES ('default-property', 'Grand Raya Hotel', '123 Grand Avenue, City Center', CURRENT_TIMESTAMP);

-- AddColumn
ALTER TABLE "RoomType" ADD COLUMN "propertyId" TEXT;

-- UpdateExistingRows
UPDATE "RoomType" SET "propertyId" = 'default-property';

-- SetNotNull
ALTER TABLE "RoomType" ALTER COLUMN "propertyId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "RoomType" ADD CONSTRAINT "RoomType_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
