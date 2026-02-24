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

  // ۵. مدرس: ویرایش یک اسلات (تغییر ساعت یا لینک)
  fastify.put(
    "/update/:id",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const { id } = request.params;
      const { startTime, endTime, meetingLink } = request.body;

      try {
        // چک کنیم که این اسلات مال خود مدرس باشد
        const slot = await prisma.evaluationSlot.findUnique({
          where: { id: Number(id) },
        });
        if (!slot || slot.teacherId !== request.user.id) {
          return reply.status(403).send({ message: "دسترسی غیرمجاز." });
        }

        const updatedSlot = await prisma.evaluationSlot.update({
          where: { id: Number(id) },
          data: {
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            meetingLink: meetingLink,
          },
        });
        return reply.send({
          status: "success",
          message: "تایم با موفقیت ویرایش شد.",
          slot: updatedSlot,
        });
      } catch (error) {
        return reply.status(500).send({ message: "خطا در ویرایش." });
      }
    },
  );

  // ۶. مدرس: حذف یک اسلات
  fastify.delete(
    "/delete/:id",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const { id } = request.params;
      try {
        // چک کنیم که اسلات مال خود مدرس باشد
        const slot = await prisma.evaluationSlot.findUnique({
          where: { id: Number(id) },
        });
        if (!slot || slot.teacherId !== request.user.id) {
          return reply.status(403).send({ message: "دسترسی غیرمجاز." });
        }

        await prisma.evaluationSlot.delete({ where: { id: Number(id) } });
        return reply.send({ status: "success", message: "تایم حذف شد." });
      } catch (error) {
        return reply
          .status(500)
          .send({ message: "خطا در حذف (شاید رزرو شده باشد)." });
      }
    },
  );

  // ۷. مدرس: ثبت نتیجه آزمون (نمره دهی)
  // ۷. مدرس: ثبت نتیجه آزمون
  fastify.post(
    "/submit-result",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const { slotId, score, feedback, assignedLevel } = request.body;

      try {
        // اول اسلات را از دیتابیس می‌گیریم تا زمانش را چک کنیم
        const slot = await prisma.evaluationSlot.findUnique({
          where: { id: Number(slotId) },
        });

        if (!slot) {
          return reply.status(404).send({ message: "کلاسی یافت نشد." });
        }

        // --- چک کردن زمان (منطق جدید) ---
        const now = new Date();
        const classTime = new Date(slot.startTime);

        if (now < classTime) {
          return reply
            .status(400)
            .send({
              message:
                "هنوز زمان کلاس فرا نرسیده است! نمی‌توانید نمره ثبت کنید. ⏳",
            });
        }
        // --------------------------------

        // ادامه مراحل ثبت نمره (کد قبلی)...
        const updatedSlot = await prisma.evaluationSlot.update({
          where: { id: Number(slotId) },
          data: {
            isCompleted: true,
            score: Number(score),
            feedback: feedback,
          },
          include: { student: true },
        });

        if (updatedSlot.studentId && assignedLevel) {
          await prisma.user.update({
            where: { id: updatedSlot.studentId },
            data: { frenchLevel: assignedLevel },
          });
        }

        return reply.send({
          status: "success",
          message: "نتیجه آزمون با موفقیت ثبت شد! 📝",
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ message: "خطا در ثبت نتیجه." });
      }
    },
  );
}
