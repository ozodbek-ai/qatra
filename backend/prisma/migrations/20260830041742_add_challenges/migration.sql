-- AlterTable
ALTER TABLE "Challenge" ADD COLUMN     "challengerCompletedAt" TIMESTAMP(3),
ADD COLUMN     "opponentCompletedAt" TIMESTAMP(3),
ADD COLUMN     "winnerId" TEXT;

-- CreateIndex
CREATE INDEX "Challenge_status_idx" ON "Challenge"("status");
