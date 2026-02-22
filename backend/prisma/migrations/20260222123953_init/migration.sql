-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'TEACHER', 'ADMIN');

-- CreateEnum
CREATE TYPE "FrenchLevel" AS ENUM ('A1', 'A2', 'B1', 'B2', 'C1', 'C2');

-- CreateEnum
CREATE TYPE "ClassType" AS ENUM ('ONLINE', 'IN_PERSON');

-- CreateEnum
CREATE TYPE "ClassStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('PENDING_PAYMENT', 'ACTIVE', 'DROPPED');

-- CreateEnum
CREATE TYPE "TicketType" AS ENUM ('PAYMENT_RECEIPT', 'SUPPORT', 'HOMEWORK');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "frenchLevel" "FrenchLevel",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvaluationSlot" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "studentId" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "isBooked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "EvaluationSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Class" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "level" "FrenchLevel" NOT NULL,
    "type" "ClassType" NOT NULL,
    "capacity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "status" "ClassStatus" NOT NULL DEFAULT 'OPEN',
    "teacherId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enrollment" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "status" "EnrollmentStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "type" "TicketType" NOT NULL,
    "filePath" TEXT,
    "message" TEXT,
    "adminReply" TEXT,
    "status" "TicketStatus" NOT NULL DEFAULT 'PENDING',
    "userId" TEXT NOT NULL,
    "relatedEnrollmentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- AddForeignKey
ALTER TABLE "EvaluationSlot" ADD CONSTRAINT "EvaluationSlot_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationSlot" ADD CONSTRAINT "EvaluationSlot_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_relatedEnrollmentId_fkey" FOREIGN KEY ("relatedEnrollmentId") REFERENCES "Enrollment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
