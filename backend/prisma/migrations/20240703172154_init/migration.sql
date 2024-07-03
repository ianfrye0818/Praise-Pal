/*
  Warnings:

  - You are about to drop the column `kudoId` on the `UserNotifications` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserNotifications" DROP COLUMN "kudoId",
ADD COLUMN     "kudosId" TEXT;
