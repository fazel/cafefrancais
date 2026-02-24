-- AlterTable
ALTER TABLE "EvaluationSlot" ADD COLUMN     "feedback" TEXT,
ADD COLUMN     "isCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "score" INTEGER;
