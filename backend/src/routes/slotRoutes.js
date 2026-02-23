// مسیر: backend/src/routes/slotRoutes.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function slotRoutes(fastify, options) {
  // ۱. مدرس: ایجاد ظرفیت جدید
  fastify.post(
    "/create",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const { startTime, endTime, meetingLink } = request.body;
      if (request.user.role === "STUDENT") {
        return reply.status(403).send({ message: "دسترسی غیرمجاز." });
      }

      try {
        const newSlot = await prisma.evaluationSlot.create({
          data: {
            teacherId: request.user.id,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            meetingLink: meetingLink, // <--- ذخیره لینک در دیتابیس
            isBooked: false,
          },
        });
        return reply.send({
          status: "success",
          message: "ظرفیت ایجاد شد.",
          slot: newSlot,
        });
      } catch (error) {
        return reply.status(500).send({ message: "خطا در ثبت تایم." });
      }
    },
  );

  // ۲. مدرس: مشاهده تمام تایم‌های خودش (رزرو شده و آزاد)
  fastify.get(
    "/teacher-slots",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      if (request.user.role === "STUDENT") {
        return reply.status(403).send({ message: "دسترسی غیرمجاز." });
      }

      try {
        const slots = await prisma.evaluationSlot.findMany({
          where: { teacherId: request.user.id },
          include: { student: true }, // اطلاعات زبان‌آموزی که این تایم را گرفته هم می‌خوانیم
          orderBy: { startTime: "asc" }, // مرتب‌سازی از نزدیک‌ترین زمان
        });
        return reply.send({ slots });
      } catch (error) {
        return reply.status(500).send({ message: "خطا در دریافت برنامه‌ها." });
      }
    },
  );

  // ۳. زبان‌آموز: مشاهده تایم‌های آزاد برای رزرو
  fastify.get(
    "/available",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const slots = await prisma.evaluationSlot.findMany({
          where: {
            isBooked: false,
            startTime: { gt: new Date() }, // فقط تایم‌هایی که در آینده هستند
          },
          include: { teacher: true },
          orderBy: { startTime: "asc" },
        });
        return reply.send({ slots });
      } catch (error) {
        return reply.status(500).send({ message: "خطا در دریافت تایم‌ها." });
      }
    },
  );

  // ۴. زبان‌آموز: رزرو کردن یک تایم
  fastify.post(
    "/book",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const { slotId } = request.body;
      try {
        const updatedSlot = await prisma.evaluationSlot.update({
          where: { id: slotId },
          data: { isBooked: true, studentId: request.user.id },
        });
        return reply.send({
          status: "success",
          message: "تایم با موفقیت رزرو شد!",
        });
      } catch (error) {
        return reply.status(500).send({ message: "خطا در رزرو تایم." });
      }
    },
  );
}
