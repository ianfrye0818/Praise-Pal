-- AlterTable
ALTER TABLE "UserNotifications" ADD COLUMN     "coachingCommentId" TEXT,
ADD COLUMN     "coachingQuestionId" TEXT;

-- CreateTable
CREATE TABLE "CoachingQuestion" (
    "id" TEXT NOT NULL,
    "companyCode" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoachingQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoachingComment" (
    "id" TEXT NOT NULL,
    "coachingQuestionId" TEXT NOT NULL,
    "parentId" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoachingComment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CoachingQuestion" ADD CONSTRAINT "CoachingQuestion_companyCode_fkey" FOREIGN KEY ("companyCode") REFERENCES "Company"("companyCode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoachingQuestion" ADD CONSTRAINT "CoachingQuestion_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoachingComment" ADD CONSTRAINT "CoachingComment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "CoachingComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoachingComment" ADD CONSTRAINT "CoachingComment_coachingQuestionId_fkey" FOREIGN KEY ("coachingQuestionId") REFERENCES "CoachingQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoachingComment" ADD CONSTRAINT "CoachingComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNotifications" ADD CONSTRAINT "UserNotifications_coachingQuestionId_fkey" FOREIGN KEY ("coachingQuestionId") REFERENCES "CoachingQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNotifications" ADD CONSTRAINT "UserNotifications_coachingCommentId_fkey" FOREIGN KEY ("coachingCommentId") REFERENCES "CoachingComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
