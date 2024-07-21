/*
  Warnings:

  - Made the column `phone` on table `Company` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "phone" SET NOT NULL;
