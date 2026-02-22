// مسیر: backend/src/server.js
import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import fastifyJwt from "@fastify/jwt";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import userRoutes from "./routes/userRoutes.js";
import slotRoutes from "./routes/slotRoutes.js";
import { PrismaClient } from "@prisma/client"; // این خط جایگزین شد

dotenv.config();

const prisma = new PrismaClient(); // این خط اضافه شد تا دیتابیس اینجا کار کند

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const fastify = Fastify({ logger: true });

fastify.register(cors, { origin: true });
fastify.register(multipart);

// ۱. ثبت سیستم توکن با یک کلید رمزنگاری محرمانه
fastify.register(fastifyJwt, { secret: "super-secret-cafe-key-2026" });

// ۲. ساخت یک نگهبان (Middleware) برای قفل کردن مسیرها
fastify.decorate("authenticate", async function (request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply
      .status(401)
      .send({ message: "شما دسترسی ندارید! لطفاً ابتدا وارد شوید. 🛑" });
  }
});

// ثبت روت‌های مربوط به کاربر و رزرو
fastify.register(userRoutes, { prefix: "/api/users" });
fastify.register(slotRoutes, { prefix: "/api/slots" });

// ۳. مسیر ادمین (حالا قفل شده است: onRequest: [fastify.authenticate])
fastify.get(
  "/api/admin/receipts",
  { onRequest: [fastify.authenticate] },
  async (request, reply) => {
    try {
      // پیدا کردن تمام تیکت‌هایی که از نوع فیش واریزی هستند و در انتظار تاییدند
      const tickets = await prisma.ticket.findMany({
        where: {
          type: "PAYMENT_RECEIPT",
          status: "PENDING",
        },
        include: { user: true }, // اطلاعات فرستنده را هم می‌گیریم
        orderBy: { createdAt: "desc" },
      });

      // فرمت کردن برای فرانت‌اِند
      const receipts = tickets.map((ticket) => ({
        id: ticket.id,
        studentName: `${ticket.user.firstName || "کاربر"} ${ticket.user.lastName || ""}`,
        filename: ticket.filePath,
        uploadDate: new Date(ticket.createdAt).toLocaleDateString("fa-IR"),
        status: ticket.status,
      }));

      await new Promise((resolve) => setTimeout(resolve, 500));
      return reply.send({ receipts });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ message: "خطا در دریافت فیش‌ها" });
    }
  },
);

// ۴. مسیر دریافت لیست واقعی زبان‌آموزان از دیتابیس (فقط برای ادمین)
fastify.get(
  "/api/admin/students",
  { onRequest: [fastify.authenticate] },
  async (request, reply) => {
    try {
      // ۱. جستجوی تمام کاربران با نقش 'STUDENT' در دیتابیس
      const studentsData = await prisma.user.findMany({
        where: { role: "STUDENT" },
        orderBy: { createdAt: "desc" }, // جدیدترین‌ها اول نمایش داده شوند
        include: {
          studentSlots: true, // اطلاعات رزروهای آن‌ها را هم می‌گیریم تا وضعیتشان را بسنجیم
        },
      });

      // ۲. مرتب‌سازی و تغییر فرمت داده‌ها برای نمایش در جدول فرانت‌اِند
      const students = studentsData.map((student) => {
        // تبدیل تاریخ میلادیِ دیتابیس به تاریخ زیبای شمسی
        const regDate = new Date(student.createdAt).toLocaleDateString("fa-IR");

        // محاسبه هوشمندِ وضعیت زبان‌آموز
        let currentStatus = "در انتظار تعیین سطح";
        if (student.studentSlots && student.studentSlots.length > 0) {
          currentStatus = "تعیین سطح رزرو شده 📅";
        }

        return {
          id: student.id,
          firstName: student.firstName || "کاربر",
          lastName: student.lastName || "بدون نام",
          phone: student.phoneNumber,
          regDate: regDate,
          status: currentStatus,
        };
      });

      // شبیه‌سازی یک مکثِ نیم ثانیه‌ای برای دیدن انیمیشن لودینگ (اختیاری)
      await new Promise((resolve) => setTimeout(resolve, 500));

      return reply.send({ students });
    } catch (error) {
      fastify.log.error(error);
      return reply
        .status(500)
        .send({ message: "خطا در دریافت لیست زبان‌آموزان." });
    }
  },
);

// ۵. مسیر آپلود فیش
fastify.post(
  "/api/payments/upload-receipt",
  { onRequest: [fastify.authenticate] }, // این روت را قفل کردیم تا بفهمیم چه کسی فیش داده
  async (request, reply) => {
    const data = await request.file();
    if (!data) return reply.status(400).send({ message: "فایلی ارسال نشده" });

    const fileName = `${Date.now()}-${data.filename}`;
    const filePath = path.join(uploadDir, fileName);

    // ۱. ذخیره عکس در پوشه uploads
    await new Promise((resolve, reject) => {
      const out = fs.createWriteStream(filePath);
      data.file.pipe(out);
      out.on("finish", resolve);
      out.on("error", reject);
    });

    // ۲. ثبت اطلاعات فیش در دیتابیس به عنوان Ticket
    const studentId = request.user.id; // آیدی کاربر از توکن خوانده می‌شود
    await prisma.ticket.create({
      data: {
        type: "PAYMENT_RECEIPT",
        filePath: fileName,
        message: "فیش واریزی شهریه ترم",
        userId: studentId,
      },
    });

    return { status: "success", message: "فیش در سیستم ثبت شد.", fileName };
  },
);

fastify.get("/api/health", async (request, reply) => {
  return { status: "success", message: "Bienvenue! 🇫🇷" };
});

const start = async () => {
  try {
    const port = process.env.PORT || 3000;
    await fastify.listen({ port: port, host: "0.0.0.0" });
    console.log(`🚀 Server is running on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
