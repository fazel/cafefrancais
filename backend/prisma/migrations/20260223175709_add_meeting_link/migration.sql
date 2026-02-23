/*
  Warnings:

  - The primary key for the `EvaluationSlot` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `EvaluationSlot` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "EvaluationSlot" DROP CONSTRAINT "EvaluationSlot_pkey",
ADD COLUMN     "meetingLink" TEXT,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "EvaluationSlot_pkey" PRIMARY KEY ("id");
