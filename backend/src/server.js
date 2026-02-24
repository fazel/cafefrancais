import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import fastifyJwt from "@fastify/jwt";
import fastifyStatic from "@fastify/static";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";
import userRoutes from "./routes/userRoutes.js";
import slotRoutes from "./routes/slotRoutes.js";

dotenv.config();

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const fastify = Fastify({ logger: true });

// ثبت پلاگین‌ها
fastify.register(multipart);
fastify.register(fastifyJwt, { secret: "super-secret-cafe-key-2026" });
fastify.register(fastifyStatic, {
  root: uploadDir,
  prefix: "/uploads/",
});

// گارد امنیتی (Authentication)
fastify.decorate("authenticate", async function (request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ message: "لطفاً ابتدا وارد شوید. 🛑" });
  }
});

// ثبت روت‌های ماژولار
fastify.register(userRoutes, { prefix: "/api/users" });
fastify.register(slotRoutes, { prefix: "/api/slots" });

// ثبت پلاگین‌ها
// تغییر تنظیمات CORS برای اجازه دادن به متدهای DELETE و PUT
fastify.register(cors, {
  origin: true, // اجازه به همه دامنه‌ها (یا آدرس فرانت‌اِند شما)
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // <--- این خط حیاتی است!
  allowedHeaders: ["Content-Type", "Authorization"], // هدرهای مجاز
});

// --- روت‌های مستقیم ادمین ---

// ۱. لیست فیش‌های واریزی برای ادمین
fastify.get(
  "/api/admin/receipts",
  { onRequest: [fastify.authenticate] },
  async (request, reply) => {
    try {
      const tickets = await prisma.ticket.findMany({
        where: { type: "PAYMENT_RECEIPT", status: "PENDING" },
        include: { user: true },
        orderBy: { createdAt: "desc" },
      });
      const receipts = tickets.map((t) => ({
        id: t.id,
        studentName: `${t.user.firstName || ""} ${t.user.lastName || ""}`,
        filename: t.filePath,
        uploadDate: new Date(t.createdAt).toLocaleDateString("fa-IR"),
        status: t.status,
      }));
      return reply.send({ receipts });
    } catch (err) {
      return reply.status(500).send({ message: "خطا در دریافت فیش‌ها" });
    }
  },
);

// ۲. لیست تمام زبان‌آموزان برای ادمین
fastify.get(
  "/api/admin/students",
  { onRequest: [fastify.authenticate] },
  async (request, reply) => {
    try {
      const studentsData = await prisma.user.findMany({
        where: { role: "STUDENT" },
        include: { studentSlots: true },
        orderBy: { createdAt: "desc" },
      });
      const students = studentsData.map((s) => ({
        id: s.id,
        firstName: s.firstName || "کاربر",
        lastName: s.lastName || "بدون نام",
        phone: s.phoneNumber,
        regDate: new Date(s.createdAt).toLocaleDateString("fa-IR"),
        status:
          s.studentSlots && s.studentSlots.length > 0
            ? "رزرو شده"
            : "در انتظار تعیین سطح",
        level: s.frenchLevel,
      }));
      return reply.send({ students });
    } catch (err) {
      return reply.status(500).send({ message: "خطا در دریافت لیست" });
    }
  },
);

// ۳. تایید یا رد فیش
fastify.post(
  "/api/admin/update-ticket-status",
  { onRequest: [fastify.authenticate] },
  async (request, reply) => {
    const { ticketId, newStatus } = request.body;
    try {
      await prisma.ticket.update({
        where: { id: ticketId },
        data: { status: newStatus },
      });
      return reply.send({ status: "success", message: "تغییر وضعیت انجام شد" });
    } catch (err) {
      return reply.status(500).send({ message: "خطا در آپدیت تیکت" });
    }
  },
);

// ۴. آپدیت سطح آموزشی
fastify.post(
  "/api/admin/update-student-level",
  { onRequest: [fastify.authenticate] },
  async (request, reply) => {
    const { studentId, newLevel } = request.body;
    try {
      await prisma.user.update({
        where: { id: studentId },
        data: { frenchLevel: newLevel },
      });
      return reply.send({ status: "success", message: "سطح آپدیت شد" });
    } catch (err) {
      return reply.status(500).send({ message: "خطا در آپدیت سطح" });
    }
  },
);

// اجرای سرور
const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT || 3000, host: "0.0.0.0" });
    console.log(`🚀 Server is running!`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
