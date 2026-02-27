<template>
  <div class="min-h-screen bg-slate-50 flex font-sans" dir="rtl">
    <aside
      class="w-72 bg-slate-900 text-white shadow-xl hidden md:flex flex-col fixed h-full z-50"
    >
      <div class="p-8 border-b border-slate-800">
        <h1 class="text-2xl font-black text-blue-400 tracking-tight">
          پنل مدیریت کل 👑
        </h1>
        <p class="text-xs text-slate-400 mt-1 uppercase tracking-widest">
          Administration
        </p>
      </div>

      <nav class="mt-6 px-4 flex-1 space-y-2">
        <button
          @click="activeTab = 'receipts'"
          :class="[
            'w-full flex items-center space-x-3 space-x-reverse py-3 px-4 rounded-xl transition-all font-bold',
            activeTab === 'receipts'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200',
          ]"
        >
          <span class="text-xl">💳</span>
          <span>بررسی فیش‌های مالی</span>
        </button>

        <button
          @click="activeTab = 'students'"
          :class="[
            'w-full flex items-center space-x-3 space-x-reverse py-3 px-4 rounded-xl transition-all font-bold',
            activeTab === 'students'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200',
          ]"
        >
          <span class="text-xl">👥</span>
          <span>لیست زبان‌آموزان</span>
        </button>

        <button
          @click="activeTab = 'teachers'"
          :class="[
            'w-full flex items-center space-x-3 space-x-reverse py-3 px-4 rounded-xl transition-all font-bold',
            activeTab === 'teachers'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200',
          ]"
        >
          <span class="text-xl">👨‍🏫</span>
          <span>مدیریت اساتید</span>
        </button>
      </nav>

      <div class="p-4 border-t border-slate-800">
        <button
          @click="handleLogout"
          class="w-full flex items-center justify-center space-x-2 space-x-reverse py-3 px-4 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all font-bold"
        >
          <span>🚪</span>
          <span>خروج از پنل</span>
        </button>
      </div>
    </aside>

    <main class="flex-1 p-6 md:p-10 mr-0 md:mr-72 overflow-y-auto">
      <header class="flex justify-between items-center mb-10">
        <h2 class="text-3xl font-extrabold text-slate-800">
          {{ pageTitle }}
        </h2>
        <div
          class="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 text-sm font-bold text-slate-600 flex items-center gap-2"
        >
          <span>📅</span> امروز: {{ new Date().toLocaleDateString("fa-IR") }}
        </div>
      </header>

      <section v-if="activeTab === 'receipts'">
        <div
          v-if="isLoadingReceipts"
          class="flex flex-col items-center justify-center py-20"
        >
          <div
            class="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"
          ></div>
          <p class="text-slate-500 font-bold">در حال دریافت فیش‌ها...</p>
        </div>

        <div
          v-else-if="receipts.length === 0"
          class="bg-white rounded-3xl shadow-sm border border-slate-100 p-16 text-center"
        >
          <div class="text-7xl mb-4">✨</div>
          <h3 class="text-xl font-black text-slate-700 mb-2">
            همه چیز مرتب است!
          </h3>
          <p class="text-slate-500">
            در حال حاضر هیچ فیش جدیدی برای بررسی وجود ندارد.
          </p>
        </div>

        <div
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="receipt in receipts"
            :key="receipt.id"
            class="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 hover:shadow-lg transition-all relative overflow-hidden group"
          >
            <div class="absolute top-0 right-0 w-2 h-full bg-yellow-400"></div>
            <div class="flex justify-between items-start mb-6">
              <div>
                <p class="font-black text-lg text-slate-800">
                  {{ receipt.studentName }}
                </p>
                <p class="text-xs text-slate-500 font-bold mt-1">
                  {{ receipt.uploadDate }}
                </p>
              </div>
              <span
                class="bg-yellow-100 text-yellow-700 text-xs font-black px-3 py-1 rounded-full"
                >در انتظار بررسی</span
              >
            </div>

            <div
              class="bg-slate-100 h-40 rounded-2xl mb-6 flex items-center justify-center border-2 border-slate-200 overflow-hidden relative group"
            >
              <img
                :src="'http://localhost:3000/uploads/' + receipt.filename"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                alt="فیش واریزی"
              />
              <a
                :href="'http://localhost:3000/uploads/' + receipt.filename"
                target="_blank"
                class="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span class="text-4xl">🔍</span>
                <span class="text-white font-bold text-sm mt-2"
                  >مشاهده کامل تصویر</span
                >
              </a>
            </div>

            <div class="flex space-x-3 space-x-reverse">
              <button
                @click="approveReceipt(receipt.id)"
                class="flex-1 bg-green-500 text-white py-3 rounded-xl hover:bg-green-600 transition shadow-sm font-black text-sm"
              >
                تایید
              </button>
              <button
                @click="rejectReceipt(receipt.id)"
                class="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl hover:bg-red-50 hover:text-red-500 transition font-black text-sm"
              >
                رد کردن
              </button>
            </div>
          </div>
        </div>
      </section>

      <section v-if="activeTab === 'students'">
        <div
          class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
        >
          <div
            class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50"
          >
            <h3 class="font-black text-lg text-slate-800">
              لیست کل زبان‌آموزان
            </h3>
          </div>

          <div v-if="isLoadingStudents" class="py-20 text-center">
            <div
              class="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"
            ></div>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full text-right">
              <thead>
                <tr
                  class="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100 bg-slate-50/30"
                >
                  <th class="px-6 py-4 font-black">نام و نام خانوادگی</th>
                  <th class="px-6 py-4 font-black">شماره موبایل</th>
                  <th class="px-6 py-4 font-black">تاریخ عضویت</th>
                  <th class="px-6 py-4 font-black">سطح فعلی</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr
                  v-for="student in students"
                  :key="student.id"
                  class="hover:bg-slate-50/50 transition-colors"
                >
                  <td class="px-6 py-5">
                    <div class="flex items-center gap-3">
                      <div
                        class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black"
                      >
                        {{ student.firstName?.charAt(0) || "👤" }}
                      </div>
                      <span class="font-bold text-slate-800"
                        >{{ student.firstName }} {{ student.lastName }}</span
                      >
                    </div>
                  </td>
                  <td
                    class="px-6 py-5 text-sm font-mono text-slate-600"
                    dir="ltr"
                  >
                    {{ student.phoneNumber }}
                  </td>
                  <td class="px-6 py-5 text-sm text-slate-500 font-bold">
                    {{
                      new Date(student.createdAt).toLocaleDateString("fa-IR")
                    }}
                  </td>
                  <td class="px-6 py-5">
                    <select
                      @change="changeLevel(student.id, $event.target.value)"
                      class="bg-white border border-slate-200 text-slate-700 text-xs font-black rounded-lg px-2 py-1 outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option
                        value=""
                        disabled
                        :selected="!student.frenchLevel"
                      >
                        نامشخص
                      </option>
                      <option
                        v-for="level in ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']"
                        :key="level"
                        :value="level"
                        :selected="student.frenchLevel === level"
                      >
                        {{ level }}
                      </option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section v-if="activeTab === 'teachers'">
        <div
          class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8"
        >
          <h3
            class="text-xl font-black text-gray-800 mb-4 flex items-center gap-2"
          >
            <span class="text-2xl">➕</span> افزودن استاد جدید به سیستم
          </h3>

          <form
            @submit.prevent="submitTeacher"
            class="flex flex-col md:flex-row gap-4 items-end bg-blue-50/50 p-6 rounded-2xl border border-blue-100"
          >
            <div class="flex-1 w-full">
              <label class="block text-sm font-bold text-gray-700 mb-2"
                >نام</label
              >
              <input
                v-model="teacherForm.firstName"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-blue-500 font-mono text-sm"
              />
            </div>
            <div class="flex-1 w-full">
              <label class="block text-sm font-bold text-gray-700 mb-2"
                >نام خانوادگی</label
              >
              <input
                v-model="teacherForm.lastName"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-blue-500 font-mono text-sm"
              />
            </div>
            <div class="flex-1 w-full">
              <label class="block text-sm font-bold text-gray-700 mb-2"
                >شماره موبایل (جهت لاگین)</label
              >
              <input
                v-model="teacherForm.phoneNumber"
                type="tel"
                placeholder="09123456789"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-blue-500 font-mono text-sm text-left"
                dir="ltr"
              />
            </div>

            <div class="w-full md:w-auto">
              <button
                type="submit"
                :disabled="isSubmittingTeacher"
                class="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition shadow-md disabled:bg-gray-400"
              >
                {{ isSubmittingTeacher ? "در حال ثبت..." : "ثبت استاد" }}
              </button>
            </div>
          </form>
        </div>

        <div
          class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
        >
          <div class="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 class="font-black text-lg text-slate-800">
              لیست کادر آموزشی فعال
            </h3>
          </div>

          <div class="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="teacher in teachers"
              :key="teacher.id"
              class="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl hover:shadow-md transition bg-white"
            >
              <div
                class="w-14 h-14 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl font-black"
              >
                👨‍🏫
              </div>
              <div>
                <p class="font-black text-gray-800">
                  {{ teacher.firstName }} {{ teacher.lastName }}
                </p>
                <p class="text-sm text-gray-500 font-mono mt-1" dir="ltr">
                  {{ teacher.phoneNumber }}
                </p>
              </div>
            </div>

            <div
              v-if="teachers.length === 0"
              class="col-span-full text-center py-8 text-gray-400 font-bold bg-gray-50 rounded-2xl border border-dashed border-gray-200"
            >
              هنوز استادی در سیستم ثبت نشده است.
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();

// --- مدیریت تب‌ها و هدر ---
const activeTab = ref("receipts");
const pageTitle = computed(() => {
  if (activeTab.value === "receipts") return "مدیریت پرداخت‌ها";
  if (activeTab.value === "students") return "لیست زبان‌آموزان";
  if (activeTab.value === "teachers") return "مدیریت اساتید";
  return "پنل مدیریت";
});

// --- متغیرهای دیتای جداول ---
const receipts = ref([]);
const students = ref([]);
const teachers = ref([]);

const isLoadingReceipts = ref(false);
const isLoadingStudents = ref(false);

// --- فرم افزودن استاد ---
const teacherForm = ref({ firstName: "", lastName: "", phoneNumber: "" });
const isSubmittingTeacher = ref(false);

// ==========================================
// توابع دریافت اطلاعات (GET)
// ==========================================

const fetchReceipts = async () => {
  try {
    isLoadingReceipts.value = true;
    const token = localStorage.getItem("token");
    const response = await axios.get(
      "http://localhost:3000/api/admin/receipts",
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    receipts.value = response.data.receipts;
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403)
      router.push("/");
  } finally {
    isLoadingReceipts.value = false;
  }
};

// دریافت تمام کاربران و تفکیک استاد و دانش‌آموز در فرانت‌اِند
const fetchAllUsers = async () => {
  try {
    isLoadingStudents.value = true;
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:3000/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const allUsers = response.data.users;
    // فیلتر کردن لیست برای نمایش در تب‌های مجزا
    students.value = allUsers.filter((u) => u.role === "STUDENT");
    teachers.value = allUsers.filter((u) => u.role === "TEACHER");
  } catch (error) {
    console.error("خطا در دریافت لیست کاربران", error);
  } finally {
    isLoadingStudents.value = false;
  }
};

// واچر برای لود کردن دیتا هنگام تغییر تب (جلوگیری از ریکوئست تکراری)
watch(activeTab, (newTab) => {
  if (
    (newTab === "students" || newTab === "teachers") &&
    students.value.length === 0
  ) {
    fetchAllUsers();
  }
  if (newTab === "receipts" && receipts.value.length === 0) {
    fetchReceipts();
  }
});

// ==========================================
// عملیات روی فیش‌ها
// ==========================================

const approveReceipt = async (id) => {
  try {
    const token = localStorage.getItem("token");
    await axios.post(
      "http://localhost:3000/api/admin/update-ticket-status",
      { ticketId: id, newStatus: "APPROVED" },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    receipts.value = receipts.value.filter((r) => r.id !== id);
    alert("فیش تایید شد. ✅");
  } catch (error) {
    alert("خطا در تایید فیش.");
  }
};

const rejectReceipt = async (id) => {
  if (!confirm("آیا از رد کردن این فیش مطمئن هستید؟")) return;
  try {
    const token = localStorage.getItem("token");
    await axios.post(
      "http://localhost:3000/api/admin/update-ticket-status",
      { ticketId: id, newStatus: "REJECTED" },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    receipts.value = receipts.value.filter((r) => r.id !== id);
    alert("فیش رد شد. ❌");
  } catch (error) {
    alert("خطا در رد کردن فیش.");
  }
};

// ==========================================
// عملیات روی کاربران
// ==========================================

const changeLevel = async (studentId, newLevel) => {
  try {
    const token = localStorage.getItem("token");
    await axios.post(
      "http://localhost:3000/api/admin/update-student-level",
      { studentId, newLevel },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    alert(`سطح جدید (${newLevel}) با موفقیت ثبت شد. ✅`);
  } catch (error) {
    alert("خطا در ثبت سطح آموزشی.");
  }
};

const submitTeacher = async () => {
  try {
    isSubmittingTeacher.value = true;
    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:3000/api/admin/add-teacher",
      teacherForm.value,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    alert("استاد جدید با موفقیت به سیستم اضافه شد! 🎉");

    // ریست فرم و آپدیت لیست اساتید
    teacherForm.value = { firstName: "", lastName: "", phoneNumber: "" };
    fetchAllUsers();
  } catch (error) {
    alert(error.response?.data?.message || "خطا در ثبت استاد.");
  } finally {
    isSubmittingTeacher.value = false;
  }
};

// ==========================================
// خروج
// ==========================================
const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  router.push("/");
};

// اجرای اولیه هنگام باز شدن صفحه ادمین
onMounted(() => {
  fetchReceipts();
  // در پس‌زمینه کاربران را هم لود می‌کنیم تا وقتی تب عوض شد منتظر نماند
  fetchAllUsers();
});
</script>
