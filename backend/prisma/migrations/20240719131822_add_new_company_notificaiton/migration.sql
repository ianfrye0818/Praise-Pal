-- AlterTable
ALTER TABLE "UserNotifications" ADD COLUMN     "companyCode" TEXT;

-- AddForeignKey
ALTER TABLE "UserNotifications" ADD CONSTRAINT "UserNotifications_companyCode_fkey" FOREIGN KEY ("companyCode") REFERENCES "Company"("companyCode") ON DELETE SET NULL ON UPDATE CASCADE;
