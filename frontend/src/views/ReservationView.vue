<template>
  <div class="min-h-screen bg-gray-50 flex font-sans" dir="rtl">
    <aside
      class="w-72 bg-white shadow-xl hidden md:block border-l border-gray-100 relative z-10"
    >
      <div class="p-8">
        <h1 class="text-2xl font-black text-blue-600 tracking-tight">
          کافه فرانسوی 🇫🇷
        </h1>
        <p class="text-xs text-gray-400 mt-1 uppercase tracking-widest">
          Apprentissage du français
        </p>
      </div>

      <nav
        class="mt-4 px-4 space-y-2 flex flex-col h-[calc(100vh-280px)] justify-between"
      >
        <div>
          <router-link
            to="/dashboard"
            class="flex items-center space-x-3 space-x-reverse py-3 px-4 text-gray-600 hover:bg-gray-50 rounded-xl transition-all font-bold"
          >
            <span>🏠</span>
            <span>میز کار (داشبورد)</span>
          </router-link>
          <router-link
            to="/reserve"
            class="flex items-center space-x-3 space-x-reverse py-3 px-4 bg-blue-50 text-blue-700 rounded-xl font-bold mt-2"
          >
            <span>📅</span>
            <span>رزرو تعیین سطح</span>
          </router-link>
        </div>

        <button
          @click="handleLogout"
          class="flex items-center space-x-3 space-x-reverse py-3 px-4 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all font-bold mt-auto border border-transparent hover:border-red-100"
        >
          <span>🚪</span>
          <span>خروج از حساب</span>
        </button>
      </nav>

      <div class="absolute bottom-8 w-72 px-8">
        <div
          class="bg-gradient-to-br from-blue-600 to-indigo-700 p-4 rounded-2xl text-white shadow-lg"
        >
          <p class="text-xs opacity-80 mb-1">پیشرفت آموزشی</p>
          <div class="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              :style="{ width: userLevel !== 'نامشخص' ? '60%' : '10%' }"
              class="h-full bg-white rounded-full transition-all duration-1000"
            ></div>
          </div>
          <p class="text-[10px] mt-2 text-left italic font-bold">
            Niveau: {{ userLevel }}
          </p>
        </div>
      </div>
    </aside>

    <main class="flex-1 p-4 md:p-10 overflow-y-auto">
      <header class="flex justify-between items-center mb-10">
        <div>
          <h2 class="text-3xl font-extrabold text-gray-800">
            رزرو جلسه تعیین سطح
          </h2>
          <p class="text-gray-500 mt-1 font-medium">
            یکی از زمان‌های خالی زیر را انتخاب کنید تا سطح شما توسط مدرس سنجیده
            شود.
          </p>
        </div>
        <router-link
          to="/dashboard"
          class="md:hidden bg-white px-4 py-2 rounded-xl shadow-sm border text-sm font-bold text-gray-600 flex items-center gap-2"
        >
          بازگشت 🔙
        </router-link>
      </header>

      <div
        v-if="isLoading"
        class="py-20 text-center flex flex-col items-center justify-center"
      >
        <div
          class="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"
        ></div>
        <p class="text-gray-500 font-bold">
          در حال جستجوی تایم‌های خالی اساتید...
        </p>
      </div>

      <div
        v-else-if="availableSlots.length === 0"
        class="bg-white p-12 rounded-3xl text-center border border-gray-100 shadow-sm max-w-2xl mx-auto mt-10"
      >
        <div class="text-6xl mb-4">😔</div>
        <h3 class="text-xl font-black text-gray-800 mb-3">
          فعلاً هیچ تایم خالی وجود ندارد!
        </h3>
        <p class="text-gray-500 leading-relaxed mb-6 font-medium">
          متاسفانه تمام وقت‌های تعیین سطح پر شده‌اند یا مدرس هنوز تایم جدیدی
          برای روزهای آینده باز نکرده است. لطفاً کمی بعد دوباره سر بزنید.
        </p>
        <button
          @click="fetchSlots"
          class="px-8 py-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 font-bold transition shadow-sm border border-blue-100"
        >
          🔄 بررسی مجدد ظرفیت‌ها
        </button>
      </div>

      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <div
          v-for="slot in availableSlots"
          :key="slot.id"
          class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between"
        >
          <div
            class="absolute top-0 right-0 w-2 h-full bg-blue-400 group-hover:bg-blue-600 transition-colors duration-300"
          ></div>

          <div>
            <div class="flex justify-between items-start mb-6">
              <span
                class="bg-blue-50 text-blue-700 text-xs font-black px-3 py-1.5 rounded-lg border border-blue-100"
              >
                آنلاین 📹
              </span>
              <span
                class="text-gray-400 text-xs font-mono font-bold bg-gray-50 px-2 py-1 rounded border border-gray-100"
              >
                {{ getDuration(slot.startTime, slot.endTime) }} دقیقه
              </span>
            </div>

            <div class="text-center py-2">
              <p
                class="text-sm font-bold text-gray-500 mb-2 border-b border-gray-100 pb-2"
              >
                {{
                  new Date(slot.startTime).toLocaleDateString("fa-IR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })
                }}
              </p>
              <p
                class="text-4xl font-black text-gray-800 font-mono my-3"
                dir="ltr"
              >
                {{
                  new Date(slot.startTime).toLocaleTimeString("fa-IR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                }}
              </p>
              <p
                class="text-xs text-gray-400 font-bold mt-2 flex items-center justify-center gap-1"
              >
                👨‍🏫 مدرس:
                <span class="text-gray-600"
                  >{{ slot.teacher?.firstName }}
                  {{ slot.teacher?.lastName }}</span
                >
              </p>
            </div>
          </div>

          <button
            @click="bookSlot(slot.id)"
            :disabled="isBooking"
            class="w-full mt-6 py-4 rounded-xl font-bold transition-all flex justify-center items-center gap-2"
            :class="
              isBooking
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
            "
          >
            <span
              v-if="isBooking && selectedSlotId === slot.id"
              class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
            ></span>
            <span>{{
              isBooking && selectedSlotId === slot.id
                ? "در حال ثبت..."
                : "رزرو این تایم قطعی"
            }}</span>
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const availableSlots = ref([]);
const isLoading = ref(true);
const isBooking = ref(false);
const selectedSlotId = ref(null);
const userLevel = ref("نامشخص"); // برای سایدبار

// محاسبه مدت زمان کلاس
const getDuration = (start, end) => {
  const s = new Date(start);
  const e = new Date(end);
  return (e - s) / 60000;
};

// دریافت اطلاعات کاربر برای سایدبار (تا پیشرفت آموزشی درست کار کند)
const fetchUserProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:3000/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    userLevel.value = response.data.user.frenchLevel || "نامشخص";
  } catch (error) {
    if (error.response?.status === 401) handleLogout();
  }
};

const fetchSlots = async () => {
  try {
    isLoading.value = true;
    const token = localStorage.getItem("token");
    const response = await axios.get(
      "http://localhost:3000/api/slots/available",
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    availableSlots.value = response.data.slots;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const bookSlot = async (slotId) => {
  if (!confirm("آیا از رزرو این زمان مطمئن هستید؟")) return;

  try {
    selectedSlotId.value = slotId;
    isBooking.value = true;
    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:3000/api/slots/book",
      { slotId },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    alert("تبریک! جلسه تعیین سطح شما با موفقیت رزرو شد. 🎉");
    router.push("/dashboard");
  } catch (error) {
    alert(error.response?.data?.message || "خطا در رزرو.");
  } finally {
    isBooking.value = false;
    selectedSlotId.value = null;
  }
};

const handleLogout = () => {
  localStorage.clear();
  router.push("/");
};

onMounted(() => {
  fetchUserProfile(); // گرفتن سطح برای سایدبار
  fetchSlots(); // گرفتن تایم‌های خالی
});
</script>
