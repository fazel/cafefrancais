import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default async function adminRoutes(fastify, options) {
  // هوک: چک کردن اینکه آیا کاربر ADMIN است یا نه؟
  fastify.addHook("preHandler", async (request, reply) => {
    await fastify.authenticate(request, reply);
    if (request.user.role !== "ADMIN") {
      return reply
        .status(403)
        .send({ message: "دسترسی غیرمجاز. فقط مدیر کل دسترسی دارد." });
    }
  });

  // ۱. لیست تمام کاربران (دانش‌آموزان و اساتید)
  fastify.get("/users", async (request, reply) => {
    try {
      const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
      });
      return reply.send({ users });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ message: "خطا در دریافت لیست کاربران" });
    }
  });

  // ۲. اضافه کردن استاد جدید
  fastify.post("/add-teacher", async (request, reply) => {
    const { firstName, lastName, phoneNumber, password } = request.body;

    try {
      const existingUser = await prisma.user.findUnique({
        where: { phoneNumber },
      });
      if (existingUser) {
        return reply
          .status(400)
          .send({ message: "این شماره موبایل قبلاً در سیستم ثبت شده است." });
      }

      // اگر خواستی بعداً پسورد بگذاری این خطوط را از کامنت در بیاور:
      // const hashedPassword = await bcrypt.hash(password || '123456', 10);

      const newTeacher = await prisma.user.create({
        data: {
          firstName,
          lastName,
          phoneNumber,
          // password: hashedPassword,
          role: "TEACHER",
        },
      });

      return reply.send({
        message: "استاد جدید با موفقیت اضافه شد! 👨‍🏫",
        teacher: newTeacher,
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ message: "خطا در ساخت حساب استاد" });
    }
  });

  // ۳. تغییر سطح زبان‌آموز
  fastify.post("/update-student-level", async (request, reply) => {
    const { studentId, newLevel } = request.body;
    try {
      await prisma.user.update({
        where: { id: studentId },
        data: { frenchLevel: newLevel },
      });
      return reply.send({ status: "success" });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ message: "خطا در بروزرسانی سطح" });
    }
  });

  // ۴. دریافت لیست فیش‌ها
  fastify.get("/receipts", async (request, reply) => {
    try {
      const receipts = await prisma.ticket.findMany({
        where: { type: "PAYMENT_RECEIPT" },
        include: { user: true },
        orderBy: { createdAt: "desc" },
      });
      const formattedReceipts = receipts
        .map((r) => ({
          id: r.id,
          studentName: `${r.user.firstName || ""} ${r.user.lastName || ""}`,
          uploadDate: new Date(r.createdAt).toLocaleDateString("fa-IR"),
          filename: r.filePath?.split("/").pop() || "",
          status: r.status,
        }))
        .filter((r) => r.status === "PENDING");

      return reply.send({ receipts: formattedReceipts });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ message: "خطا در دریافت فیش‌ها" });
    }
  });

  // ۵. آپدیت وضعیت فیش
  fastify.post("/update-ticket-status", async (request, reply) => {
    const { ticketId, newStatus } = request.body;
    try {
      await prisma.ticket.update({
        where: { id: ticketId },
        data: { status: newStatus },
      });
      return reply.send({ status: "success" });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ message: "خطا در بروزرسانی فیش" });
    }
  });
}
