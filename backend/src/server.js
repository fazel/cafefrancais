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
import adminRoutes from "./routes/adminRoutes.js";

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

// تغییر تنظیمات CORS
fastify.register(cors, {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

// گارد امنیتی (Authentication)
fastify.decorate("authenticate", async function (request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ message: "لطفاً ابتدا وارد شوید. 🛑" });
  }
});

// ثبت روت‌های ماژولار (همه درخواست‌ها از اینجا به فایل‌های مربوطه هدایت می‌شوند)
fastify.register(userRoutes, { prefix: "/api/users" });
fastify.register(slotRoutes, { prefix: "/api/slots" });
fastify.register(adminRoutes, { prefix: "/api/admin" });

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
