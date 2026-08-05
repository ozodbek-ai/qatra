-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "duration" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "studentsCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Course_title_idx" ON "Course"("title");
