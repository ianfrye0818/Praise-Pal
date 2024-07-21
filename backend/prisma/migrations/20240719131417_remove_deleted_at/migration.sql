/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Kudos` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `UserNotifications` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `UserSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "Kudos" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "UserNotifications" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "UserSettings" DROP COLUMN "deletedAt";
