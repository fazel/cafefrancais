import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "../../uploads"); // مسیر پوشه آپلود

export default async function userRoutes(fastify, options) {
  // ۱. ثبت‌نام
  fastify.post("/register", async (request, reply) => {
    const { firstName, lastName, phoneNumber } = request.body;
    try {
      const existingUser = await prisma.user.findUnique({
        where: { phoneNumber },
      });
      if (existingUser) {
        return reply
          .status(400)
          .send({ message: "این شماره قبلاً ثبت شده است. 🛑" });
      }
      const newUser = await prisma.user.create({
        data: { firstName, lastName, phoneNumber, role: "STUDENT" },
      });
      return reply.send({
        status: "success",
        message: "ثبت‌نام موفقیت‌آمیز بود! 🇫🇷",
        user: {
          id: newUser.id,
          firstName: newUser.firstName,
          role: newUser.role,
        },
      });
    } catch (error) {
      return reply.status(500).send({ message: "خطا در دیتابیس." });
    }
  });

  // ۲. ورود زبان‌آموز
  fastify.post("/login", async (request, reply) => {
    const { phoneNumber } = request.body;
    try {
      const user = await prisma.user.findUnique({ where: { phoneNumber } });
      if (!user) return reply.status(404).send({ message: "کاربری یافت نشد." });
      if (user.role !== "STUDENT")
        return reply.status(403).send({ message: "از بخش مدرسین وارد شوید." });

      const token = fastify.jwt.sign({
        id: user.id,
        role: user.role,
        phone: user.phoneNumber,
      });
      return reply.send({
        status: "success",
        token,
        user: { firstName: user.firstName, role: user.role },
      });
    } catch (error) {
      return reply.status(500).send({ message: "خطا در سرور." });
    }
  });

  // ۳. ورود مدرس
  fastify.post("/teacher-login", async (request, reply) => {
    const { phoneNumber } = request.body;
    try {
      const user = await prisma.user.findUnique({ where: { phoneNumber } });
      if (!user || user.role === "STUDENT")
        return reply.status(403).send({ message: "دسترسی غیرمجاز." });

      const token = fastify.jwt.sign({
        id: user.id,
        role: user.role,
        phone: user.phoneNumber,
      });
      return reply.send({
        status: "success",
        token,
        user: { firstName: user.firstName, role: user.role },
      });
    } catch (error) {
      return reply.status(500).send({ message: "خطای سرور." });
    }
  });

  // ۴. دریافت اطلاعات پروفایل (فیکس شده)
  // دریافت پروفایل کاربر فعلی (همراه با کلاس‌های رزرو شده‌اش)
  fastify.get(
    "/me",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: request.user.id },
          include: {
            studentSlots: {
              orderBy: { startTime: "desc" }, // 👈 اصلاح شد: مرتب‌سازی بر اساس زمان شروع کلاس
            },
          },
        });

        if (!user) {
          return reply.status(404).send({ message: "کاربری یافت نشد." });
        }

        // برای امنیت، اگر فیلد پسورد داری آن را به فرانت‌اِند نمی‌فرستیم
        // const { password, ...safeUser } = user;

        return reply.send({ user: user }); // اگر پسورد را جدا کردی، safeUser را بفرست
      } catch (error) {
        fastify.log.error("خطا در روت /me:", error);
        return reply
          .status(500)
          .send({ message: "خطای سرور در دریافت اطلاعات" });
      }
    },
  );
  // ۵. روت آپلود فیش (منتقل شده به اینجا برای نظم بیشتر)
  fastify.post(
    "/upload-receipt",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const data = await request.file();
      if (!data) return reply.status(400).send({ message: "فایلی ارسال نشده" });

      const fileName = `${Date.now()}-${data.filename}`;
      const filePath = path.join(uploadDir, fileName);
      const out = fs.createWriteStream(filePath);
      await data.file.pipe(out);

      await prisma.ticket.create({
        data: {
          type: "PAYMENT_RECEIPT",
          filePath: fileName,
          userId: request.user.id,
        },
      });
      return { status: "success", message: "فیش ثبت شد" };
    },
  );
}
