-- AlterTable
ALTER TABLE "UserNotifications" ADD COLUMN     "commentId" TEXT;

-- AddForeignKey
ALTER TABLE "UserNotifications" ADD CONSTRAINT "UserNotifications_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNotifications" ADD CONSTRAINT "UserNotifications_kudosId_fkey" FOREIGN KEY ("kudosId") REFERENCES "Kudos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
