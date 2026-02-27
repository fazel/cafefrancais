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
            class="flex items-center space-x-3 space-x-reverse py-3 px-4 bg-blue-50 text-blue-700 rounded-xl font-bold"
          >
            <span>🏠</span>
            <span>میز کار (داشبورد)</span>
          </router-link>
          <router-link
            to="/reserve"
            class="flex items-center space-x-3 space-x-reverse py-3 px-4 text-gray-600 hover:bg-gray-50 rounded-xl transition-all mt-2 font-bold"
          >
            <span>📅</span>
            <span>رزرو تعیین سطح</span>
            <span
              v-if="bookedSlot && !bookedSlot.isCompleted"
              class="bg-green-100 text-green-600 text-[10px] px-2 py-0.5 rounded-full mr-auto"
              >فعال</span
            >
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
      <header
        class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4"
      >
        <div>
          <h2 class="text-3xl font-extrabold text-gray-800">
            Bonjour, {{ userName }}! 👋
          </h2>
          <p class="text-gray-500 mt-1 font-medium">
            به پنل یادگیری خود خوش آمدید.
          </p>
        </div>
        <div
          class="bg-white p-2 rounded-full shadow-sm border px-4 flex items-center gap-2"
        >
          <span
            :class="
              bookedSlot
                ? bookedSlot.isCompleted
                  ? 'bg-purple-500'
                  : 'bg-green-500'
                : 'bg-yellow-500'
            "
            class="w-3 h-3 rounded-full animate-pulse"
          ></span>
          <span class="text-sm font-bold text-gray-700">
            {{
              !bookedSlot
                ? "در انتظار تعیین سطح"
                : bookedSlot.isCompleted
                  ? "سطح تایید شده 🎓"
                  : "کلاس رزرو شده ✅"
            }}
          </span>
        </div>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div
          class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div
            class="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 text-2xl"
          >
            📖
          </div>
          <p class="text-gray-400 text-sm font-bold">کلاس‌های فعال</p>
          <p class="text-3xl font-black text-gray-800 mt-1">
            {{ bookedSlot && !bookedSlot.isCompleted ? "۱" : "۰" }}
          </p>
        </div>
        <div
          class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div
            class="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-4 text-2xl"
          >
            🎯
          </div>
          <p class="text-gray-400 text-sm font-bold">سطح فعلی</p>
          <p class="text-3xl font-black text-gray-800 mt-1">{{ userLevel }}</p>
        </div>
        <div
          class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div
            class="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mb-4 text-2xl"
          >
            💎
          </div>
          <p class="text-gray-400 text-sm font-bold">امتیاز (Bon point)</p>
          <p class="text-3xl font-black text-gray-800 mt-1">۵۰</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section
          class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden flex flex-col"
        >
          <div
            :class="
              !bookedSlot
                ? 'bg-yellow-400'
                : bookedSlot.isCompleted
                  ? 'bg-purple-500'
                  : 'bg-green-500'
            "
            class="absolute top-0 right-0 w-2 h-full transition-colors"
          ></div>

          <h3
            class="text-xl font-black text-gray-800 mb-6 flex items-center gap-2"
          >
            <span class="text-2xl">{{
              !bookedSlot ? "🔍" : bookedSlot.isCompleted ? "🏆" : "🎓"
            }}</span>
            مسیر تعیین سطح
          </h3>

          <div v-if="!bookedSlot" class="flex-1 flex flex-col justify-center">
            <div
              class="bg-yellow-50 border border-yellow-100 rounded-2xl p-6 mb-6"
            >
              <p
                class="text-sm text-yellow-900 leading-relaxed font-bold text-center"
              >
                برای شروع یادگیری و انتخاب کلاس، ابتدا باید در یک جلسه کوتاه
                (تعیین سطح) شرکت کنید.
              </p>
            </div>
            <router-link
              to="/reserve"
              class="w-full block bg-blue-600 text-white font-bold py-4 rounded-xl text-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              رزرو تایم تعیین سطح (رایگان)
            </router-link>
          </div>

          <div
            v-else-if="!bookedSlot.isCompleted"
            class="flex-1 flex flex-col justify-center"
          >
            <div
              class="bg-green-50 border border-green-100 rounded-2xl p-6 mb-6"
            >
              <div class="flex justify-between items-start mb-4">
                <span
                  class="bg-white text-green-700 text-xs font-black px-3 py-1 rounded-lg border border-green-100"
                  >جلسه آنلاین</span
                >
                <span class="text-xs text-green-600 font-bold animate-pulse"
                  >🔴 در انتظار شروع...</span
                >
              </div>
              <h4 class="text-lg font-black text-gray-800 mb-2">
                مصاحبه با استاد
              </h4>
              <p class="text-sm text-gray-600 font-bold mb-1">
                📅
                {{
                  new Date(bookedSlot.startTime).toLocaleDateString("fa-IR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })
                }}
              </p>
              <p class="text-sm text-gray-600 font-bold mb-4">
                ⏰ ساعت
                {{
                  new Date(bookedSlot.startTime).toLocaleTimeString("fa-IR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                }}
              </p>

              <a
                :href="bookedSlot.meetingLink || '#'"
                target="_blank"
                :class="
                  !bookedSlot.meetingLink
                    ? 'opacity-50 cursor-not-allowed bg-gray-400'
                    : 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200'
                "
                class="w-full flex items-center justify-center gap-2 text-white font-bold py-3 rounded-xl transition"
              >
                <span>🎥</span>
                <span>{{
                  bookedSlot.meetingLink
                    ? "ورود به جلسه آزمون"
                    : "لینک هنوز ثبت نشده"
                }}</span>
              </a>
            </div>
          </div>

          <div v-else class="flex-1 flex flex-col justify-center">
            <div
              class="bg-purple-50 border border-purple-100 rounded-2xl p-6 text-center mb-4"
            >
              <p
                class="text-xs text-purple-600 font-bold mb-2 uppercase tracking-widest"
              >
                سطح تایید شده شما
              </p>
              <p class="text-6xl font-black text-purple-800 mb-4">
                {{ userLevel }}
              </p>
              <div
                class="inline-block bg-white px-4 py-2 rounded-full text-sm font-bold text-gray-600 border border-purple-100 shadow-sm"
              >
                نمره آزمون:
                <span class="text-purple-700"
                  >{{ bookedSlot.score || "---" }} / ۱۰۰</span
                >
              </div>
            </div>
            <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p class="text-xs text-gray-400 font-bold mb-1">نظر استاد:</p>
              <p class="text-sm text-gray-700 leading-relaxed italic">
                "{{ bookedSlot.feedback || "توضیحات خاصی ثبت نشده است." }}"
              </p>
            </div>
          </div>
        </section>

        <section
          class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col relative"
        >
          <h3
            class="text-xl font-black text-gray-800 mb-6 flex items-center gap-2"
          >
            <span class="text-2xl">💳</span> امور مالی و ثبت‌نام
          </h3>

          <div
            v-if="userLevel === 'نامشخص'"
            class="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50"
          >
            <span class="text-4xl mb-3 opacity-50">🔒</span>
            <p class="text-sm text-gray-500 font-bold leading-relaxed">
              بخش مالی پس از تعیین سطح شما فعال خواهد شد. ابتدا تایم مصاحبه خود
              را رزرو کنید.
            </p>
          </div>

          <div v-else class="flex-1 flex flex-col">
            <div
              class="bg-blue-50 text-blue-800 text-sm font-bold p-4 rounded-xl mb-6 border border-blue-100"
            >
              اکنون می‌توانید شهریه سطح
              <span
                class="font-black text-blue-900 border-b-2 border-blue-400"
                >{{ userLevel }}</span
              >
              را واریز کرده و فیش آن را اینجا آپلود کنید.
            </div>

            <form @submit.prevent="uploadReceipt" class="flex-1 flex flex-col">
              <div
                class="border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition cursor-pointer relative mb-4 flex-1"
              >
                <input
                  type="file"
                  @change="onFileSelected"
                  accept="image/*"
                  class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required
                />
                <span class="text-3xl mb-2">📸</span>
                <p v-if="!selectedFile" class="text-sm text-gray-500 font-bold">
                  برای انتخاب تصویر فیش کلیک کنید
                </p>
                <p v-else class="text-sm text-green-600 font-black">
                  {{ selectedFile.name }} (انتخاب شد)
                </p>
              </div>

              <button
                type="submit"
                :disabled="isUploading || !selectedFile"
                class="w-full bg-slate-800 text-white font-bold py-4 rounded-xl hover:bg-slate-900 transition-all shadow-lg disabled:bg-gray-300 disabled:shadow-none flex items-center justify-center gap-2"
              >
                <span
                  v-if="isUploading"
                  class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                ></span>
                <span>{{
                  isUploading ? "در حال ارسال..." : "ارسال فیش واریزی"
                }}</span>
              </button>

              <p
                v-if="uploadMessage"
                :class="
                  isUploadError
                    ? 'text-red-600 bg-red-50'
                    : 'text-green-600 bg-green-50'
                "
                class="mt-4 p-3 rounded-xl text-center text-sm font-bold"
              >
                {{ uploadMessage }}
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();

// متغیرهای وضعیت
const userName = ref("کاربر عزیز");
const userLevel = ref("نامشخص");
const bookedSlot = ref(null); // نگهداری اطلاعات کامل اسلات رزرو شده
const selectedFile = ref(null);
const isUploading = ref(false);
const uploadMessage = ref("");
const isUploadError = ref(false);

const fetchUserProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:3000/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const user = response.data.user;
    userName.value = user.firstName || "کاربر عزیز";
    userLevel.value = user.frenchLevel || "نامشخص";

    // گرفتن آخرین اسلات (کلاس) زبان‌آموز
    if (user.studentSlots && user.studentSlots.length > 0) {
      // فرض می‌کنیم جدیدترین اسلات در اندیس 0 است (اگر در بک‌اِند مرتب شده باشد)
      bookedSlot.value = user.studentSlots[0];
    }
  } catch (error) {
    if (error.response?.status === 401) {
      handleLogout();
    }
    console.error("خطا در بارگذاری پروفایل", error);
  }
};

const onFileSelected = (event) => {
  selectedFile.value = event.target.files[0];
  uploadMessage.value = "";
  isUploadError.value = false;
};

const uploadReceipt = async () => {
  if (!selectedFile.value) return;
  isUploading.value = true;
  isUploadError.value = false;

  const formData = new FormData();
  formData.append("receipt", selectedFile.value);
  const token = localStorage.getItem("token");

  try {
    await axios.post(
      "http://localhost:3000/api/payments/upload-receipt",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    uploadMessage.value =
      "فیش با موفقیت ارسال شد و در انتظار تایید ادمین است. ✅";
    selectedFile.value = null; // پاک کردن فرم
  } catch (error) {
    isUploadError.value = true;
    uploadMessage.value = "خطا در آپلود فیش. لطفاً دوباره تلاش کنید.";
  } finally {
    isUploading.value = false;
  }
};

const handleLogout = () => {
  localStorage.clear();
  router.push("/");
};

onMounted(() => {
  fetchUserProfile();
});
</script>
