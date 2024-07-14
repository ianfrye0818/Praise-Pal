/*
  Warnings:

  - The primary key for the `Company` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `Kudos` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `User_Like` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `companyCode` to the `Kudos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyCode` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Kudos" DROP CONSTRAINT "Kudos_companyId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_companyId_fkey";

-- DropForeignKey
ALTER TABLE "User_Like" DROP CONSTRAINT "User_Like_kudosId_fkey";

-- DropForeignKey
ALTER TABLE "User_Like" DROP CONSTRAINT "User_Like_userId_fkey";

-- DropIndex
DROP INDEX "Company_companyCode_key";

-- AlterTable
ALTER TABLE "Company" DROP CONSTRAINT "Company_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Company_pkey" PRIMARY KEY ("companyCode");

-- AlterTable
ALTER TABLE "Kudos" DROP COLUMN "companyId",
ADD COLUMN     "companyCode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "companyId",
ADD COLUMN     "companyCode" TEXT NOT NULL;

-- DropTable
DROP TABLE "User_Like";

-- CreateTable
CREATE TABLE "Kudo_Like" (
    "userId" TEXT NOT NULL,
    "kudosId" TEXT NOT NULL,
    "likedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Kudo_Like_pkey" PRIMARY KEY ("userId","kudosId")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyCode_fkey" FOREIGN KEY ("companyCode") REFERENCES "Company"("companyCode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kudos" ADD CONSTRAINT "Kudos_companyCode_fkey" FOREIGN KEY ("companyCode") REFERENCES "Company"("companyCode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kudo_Like" ADD CONSTRAINT "Kudo_Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kudo_Like" ADD CONSTRAINT "Kudo_Like_kudosId_fkey" FOREIGN KEY ("kudosId") REFERENCES "Kudos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
