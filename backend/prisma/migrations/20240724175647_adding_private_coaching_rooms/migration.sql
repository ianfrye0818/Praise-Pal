-- AlterTable
ALTER TABLE "UserNotifications" ADD COLUMN     "privateCoachingRoomId" TEXT;

-- CreateTable
CREATE TABLE "PrivateCoachingRoom" (
    "id" TEXT NOT NULL,
    "coachingQuestionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "responderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrivateCoachingRoom_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PrivateCoachingRoom" ADD CONSTRAINT "PrivateCoachingRoom_coachingQuestionId_fkey" FOREIGN KEY ("coachingQuestionId") REFERENCES "CoachingQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivateCoachingRoom" ADD CONSTRAINT "PrivateCoachingRoom_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivateCoachingRoom" ADD CONSTRAINT "PrivateCoachingRoom_responderId_fkey" FOREIGN KEY ("responderId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNotifications" ADD CONSTRAINT "UserNotifications_privateCoachingRoomId_fkey" FOREIGN KEY ("privateCoachingRoomId") REFERENCES "PrivateCoachingRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
