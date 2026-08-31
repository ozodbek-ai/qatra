-- AlterTable
ALTER TABLE "Reel" ADD COLUMN     "categoryId" TEXT;

-- CreateTable
CREATE TABLE "ReelCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReelCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReelCategory_name_key" ON "ReelCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ReelCategory_slug_key" ON "ReelCategory"("slug");

-- CreateIndex
CREATE INDEX "ReelCategory_slug_idx" ON "ReelCategory"("slug");

-- CreateIndex
CREATE INDEX "Reel_categoryId_idx" ON "Reel"("categoryId");

-- AddForeignKey
ALTER TABLE "Reel" ADD CONSTRAINT "Reel_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ReelCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
