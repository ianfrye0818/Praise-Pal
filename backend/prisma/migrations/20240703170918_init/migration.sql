/*
  Warnings:

  - The `referenceId` column on the `UserNotifications` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "UserNotifications" DROP COLUMN "referenceId",
ADD COLUMN     "referenceId" TEXT[];
