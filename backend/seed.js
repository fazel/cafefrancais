// مسیر: backend/seed.js
import prisma from "./src/utils/prisma.js";

async function main() {
  console.log("در حال ساخت داده‌های اولیه... ⏳");

  // ۱. ساخت یک استاد فرانسوی‌زبان
  const teacher = await prisma.user.create({
    data: {
      phoneNumber: "09333333333",
      firstName: "ژان",
      lastName: "والژان",
      role: "TEACHER", // نقش استاد
      frenchLevel: "C2",
    },
  });
  console.log(
    `✅ استاد ساخته شد: ${teacher.firstName} ${teacher.lastName} (ID: ${teacher.id})`,
  );

  // ۲. ساخت یک تایم خالی برای فردا ساعت ۱۰ صبح
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  const endTime = new Date(tomorrow);
  endTime.setMinutes(30); // تایم ۳۰ دقیقه‌ای

  const slot = await prisma.evaluationSlot.create({
    data: {
      teacherId: teacher.id,
      startTime: tomorrow,
      endTime: endTime,
      isBooked: false,
    },
  });
  console.log(`✅ تایم خالی رزرو ساخته شد (ID: ${slot.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
