/*
  Warnings:

  - Added the required column `bestTimeToContact` to the `CompanyContact` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BestTimeToContact" AS ENUM ('MORNING', 'AFTERNOON', 'EVENING', 'ANYTIME');

-- AlterTable
ALTER TABLE "CompanyContact" ADD COLUMN     "bestTimeToContact" "BestTimeToContact" NOT NULL;
