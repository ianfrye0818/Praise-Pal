-- CreateEnum
CREATE TYPE "CompanyStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING');

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "status" "CompanyStatus" NOT NULL DEFAULT 'PENDING';
