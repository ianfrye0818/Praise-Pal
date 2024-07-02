/*
  Warnings:

  - Added the required column `message` to the `UserNotifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserNotifications" ADD COLUMN     "message" TEXT NOT NULL;
