import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config(); // خواندن فایل .env

const prisma = new PrismaClient();

async function main() {
  // خواندن شماره موبایل ادمین از فایل .env
  const adminPhone = process.env.ADMIN_PHONE;

  if (!adminPhone) {
    console.error(
      "❌ ارور: شماره موبایل ادمین (ADMIN_PHONE) در فایل .env تنظیم نشده است.",
    );
    process.exit(1);
  }

  // بررسی و ساخت ادمین در دیتابیس (upsert: اگر نبود بساز، اگر بود آپدیت کن)
  const admin = await prisma.user.upsert({
    where: { phoneNumber: adminPhone },
    update: {
      role: "ADMIN", // مطمئن می‌شویم که نقشش حتماً ادمین است
    },
    create: {
      firstName: "مدیر",
      lastName: "کل",
      phoneNumber: adminPhone,
      role: "ADMIN",
    },
  });

  console.log(
    `✅ ادمین اصلی سیستم با شماره ${admin.phoneNumber} با موفقیت ساخته/بروزرسانی شد! 👑`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
