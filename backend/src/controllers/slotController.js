// مسیر: src/controllers/slotController.js
import prisma from "../utils/prisma.js";

// ۱. دریافت تمام تایم‌های خالی
export const getAvailableSlots = async (request, reply) => {
  try {
    const slots = await prisma.evaluationSlot.findMany({
      where: { isBooked: false },
      include: {
        teacher: { select: { firstName: true, lastName: true } }, // فقط اسم استاد رو برمی‌گردونه
      },
    });

    return reply.send({ success: true, slots });
  } catch (error) {
    request.log.error(error);
    return reply
      .code(500)
      .send({ success: false, message: "خطا در دریافت تایم‌ها" });
  }
};

// ۲. رزرو کردن یک تایم توسط دانش‌آموز
export const bookSlot = async (request, reply) => {
  try {
    const { slotId, studentId } = request.body;

    // آپدیت کردن وضعیت تایم در دیتابیس
    const updatedSlot = await prisma.evaluationSlot.update({
      where: { id: slotId },
      data: {
        isBooked: true,
        studentId: studentId, // متصل کردن تایم به آیدیِ علی رضایی
      },
    });

    return reply.send({
      success: true,
      message: "تایم ارزشیابی با موفقیت رزرو شد! ☎️",
      slot: updatedSlot,
    });
  } catch (error) {
    request.log.error(error);
    return reply
      .code(500)
      .send({
        success: false,
        message: "خطا در رزرو تایم (شاید قبلاً رزرو شده)",
      });
  }
};
