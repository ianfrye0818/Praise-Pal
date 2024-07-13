-- AlterTable
ALTER TABLE "UserNotifications" ADD COLUMN     "newUserId" TEXT;

-- AddForeignKey
ALTER TABLE "UserNotifications" ADD CONSTRAINT "UserNotifications_newUserId_fkey" FOREIGN KEY ("newUserId") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
