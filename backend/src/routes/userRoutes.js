// مسیر: backend/src/routes/userRoutes.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function userRoutes(fastify, options) {
  // روت ثبت‌نام زبان‌آموز جدید
  fastify.post("/register", async (request, reply) => {
    const { firstName, lastName, phoneNumber } = request.body;

    try {
      // ۱. بررسی اینکه آیا این شماره موبایل قبلاً در کافه فرانسوی ثبت شده؟
      const existingUser = await prisma.user.findUnique({
        where: { phoneNumber },
      });

      if (existingUser) {
        return reply
          .status(400)
          .send({ message: "این شماره موبایل قبلاً در سیستم ثبت شده است. 🛑" });
      }

      // ۲. ساخت کاربر جدید در دیتابیس PostgreSQL
      // نقش (Role) به صورت خودکار روی STUDENT تنظیم می‌شود (طبق اسکیما)
      const newUser = await prisma.user.create({
        data: {
          firstName,
          lastName,
          phoneNumber,
        },
      });

      return reply.send({
        status: "success",
        message: "ثبت‌نام با موفقیت انجام شد! 🇫🇷",
        user: {
          id: newUser.id,
          firstName: newUser.firstName,
          role: newUser.role,
        },
      });
    } catch (error) {
      fastify.log.error(error);
      return reply
        .status(500)
        .send({ message: "خطا در ذخیره اطلاعات در دیتابیس." });
    }
  });

  fastify.post("/login", async (request, reply) => {
    const { phoneNumber } = request.body;

    try {
      // ۱. بررسی اینکه آیا کاربر در دیتابیس وجود دارد؟
      const user = await prisma.user.findUnique({
        where: { phoneNumber },
      });

      if (!user) {
        return reply
          .status(404)
          .send({
            message:
              "کاربری با این شماره یافت نشد. لطفاً ابتدا ثبت‌نام کنید. 🛑",
          });
      }

      // ۲. تولید کلید دیجیتال (توکن JWT)
      // اطلاعات مهم مثل آیدی و نقش (Role) را داخل توکن مهر و موم می‌کنیم
      const token = fastify.jwt.sign({
        id: user.id,
        role: user.role,
        phone: user.phoneNumber,
      });

      // ۳. ارسال توکن و اطلاعات اولیه به فرانت‌اِند
      return reply.send({
        status: "success",
        message: "ورود موفقیت‌آمیز بود! 🚀",
        token: token,
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ message: "خطا در ارتباط با دیتابیس." });
    }
  });
}
