// مسیر: src/controllers/userController.js
import prisma from '../utils/prisma.js';

export const registerUser = async (request, reply) => {
  try {
    // گرفتن اطلاعات از بادیِ درخواست (Body)
    const { phoneNumber, firstName, lastName } = request.body;

    // ۱. بررسی اینکه آیا کاربری با این شماره از قبل وجود دارد؟
    let existingUser = await prisma.user.findUnique({
      where: { phoneNumber }
    });

    if (existingUser) {
      // کد 400 یعنی خطای سمت کاربر (درخواست نامعتبر)
      return reply.code(400).send({ 
        success: false, 
        message: 'این شماره موبایل قبلاً در سیستم ثبت شده است.' 
      });
    }

    // ۲. ساخت کاربر جدید در دیتابیس
    const newUser = await prisma.user.create({
      data: {
        phoneNumber,
        firstName,
        lastName
        // نقش کاربر به صورت پیش‌فرض روی STUDENT تنظیم می‌شود (طبق schema)
      }
    });

    // ۳. ارسال پاسخ موفقیت‌آمیز
    return reply.code(201).send({
      success: true,
      message: 'ثبت‌نام در کافه فرانسوی با موفقیت انجام شد! 🇫🇷',
      user: newUser
    });

  } catch (error) {
    // ثبت خطا در ترمینال برای دیباگ خودمان
    request.log.error(error); 
    return reply.code(500).send({ 
      success: false, 
      message: 'خطای داخلی سرور رخ داده است.' 
    });
  }
};