// مسیر: backend/src/routes/slotRoutes.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function slotRoutes(fastify, options) {
  // ۱. دریافت لیست تایم‌های خالی (رزرو نشده)
  fastify.get("/available", async (request, reply) => {
    try {
      const slots = await prisma.evaluationSlot.findMany({
        where: { isBooked: false },
        include: { teacher: true }, // اطلاعات استاد را هم می‌گیرد
        orderBy: { startTime: "asc" },
      });
      return reply.send({ slots });
    } catch (error) {
      fastify.log.error(error);
      return reply
        .status(500)
        .send({ message: "خطا در دریافت تایم‌ها از دیتابیس." });
    }
  });

  // ۲. رزرو یک تایم (این مسیر با توکن قفل شده است)
  fastify.post(
    "/book",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const { slotId } = request.body;
      const studentId = request.user.id;

      try {
        // بررسی تایم در دیتابیس
        const slot = await prisma.evaluationSlot.findUnique({
          where: { id: slotId },
        });

        if (!slot) {
          return reply
            .status(404)
            .send({ message: "این تایم در سیستم وجود ندارد." });
        }

        if (slot.isBooked) {
          return reply
            .status(400)
            .send({ message: "متاسفانه این تایم لحظاتی پیش رزرو شد. 🛑" });
        }

        // ثبت رزرو در دیتابیس (بدون دستکاری جدول کاربر)
        await prisma.evaluationSlot.update({
          where: { id: slotId },
          data: {
            isBooked: true,
            studentId: studentId,
          },
        });

        return reply.send({
          status: "success",
          message: "تایم با موفقیت رزرو شد! 📅",
        });
      } catch (error) {
        fastify.log.error(error);
        return reply
          .status(500)
          .send({ message: "خطا در ثبت رزرو در دیتابیس." });
      }
    },
  );

  // ۳. روت کمکی: تولید تایم‌های تستی
  fastify.get("/generate-test", async (request, reply) => {
    try {
      let teacher = await prisma.user.findFirst({ where: { role: "TEACHER" } });
      if (!teacher) {
        teacher = await prisma.user.create({
          data: {
            firstName: "ژان",
            lastName: "والژان",
            phoneNumber: "09000000000",
            role: "TEACHER",
          },
        });
      }

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfter = new Date();
      dayAfter.setDate(dayAfter.getDate() + 2);

      await prisma.evaluationSlot.createMany({
        data: [
          {
            teacherId: teacher.id,
            startTime: new Date(tomorrow.setHours(10, 0, 0)),
            endTime: new Date(tomorrow.setHours(11, 0, 0)),
          },
          {
            teacherId: teacher.id,
            startTime: new Date(tomorrow.setHours(16, 0, 0)),
            endTime: new Date(tomorrow.setHours(17, 0, 0)),
          },
          {
            teacherId: teacher.id,
            startTime: new Date(dayAfter.setHours(18, 0, 0)),
            endTime: new Date(dayAfter.setHours(19, 0, 0)),
          },
        ],
      });
      return reply.send({
        message: "تایم‌های تستی با موفقیت در دیتابیس ساخته شدند! 🎉",
      });
    } catch (err) {
      return reply.status(500).send(err);
    }
  });
}
