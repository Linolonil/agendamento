/*
  Warnings:

  - You are about to drop the column `time` on the `Schedule` table. All the data in the column will be lost.
  - Added the required column `startTime` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "schedule_time_idx";

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "time",
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "schedule_time_idx" ON "Schedule"("startTime", "endTime");
