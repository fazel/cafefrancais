<template>
    <div class="min-h-screen bg-slate-50 flex font-sans" dir="rtl">
        <aside class="w-72 bg-slate-900 text-white shadow-xl hidden md:flex flex-col fixed h-full z-50">
            <div class="p-8 border-b border-slate-800">
                <h1 class="text-2xl font-black text-blue-400 tracking-tight">پنل مدرس 👨‍🏫</h1>
                <p class="text-xs text-slate-400 mt-1 uppercase tracking-widest">Espace Professeur</p>
            </div>

            <nav class="mt-6 px-4 flex-1 space-y-2">
                <button @click="activeTab = 'receipts'"
                    :class="['w-full flex items-center space-x-3 space-x-reverse py-3 px-4 rounded-xl transition-all font-bold',
                        activeTab === 'receipts' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200']">
                    <span class="text-xl">💳</span>
                    <span>بررسی فیش‌ها</span>
                </button>

                <button @click="activeTab = 'students'"
                    :class="['w-full flex items-center space-x-3 space-x-reverse py-3 px-4 rounded-xl transition-all font-bold',
                        activeTab === 'students' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200']">
                    <span class="text-xl">👥</span>
                    <span>لیست زبان‌آموزان</span>
                </button>

                <button @click="activeTab = 'slots'"
                    :class="['w-full flex items-center space-x-3 space-x-reverse py-3 px-4 rounded-xl transition-all font-bold',
                        activeTab === 'slots' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200']">
                    <span class="text-xl">📅</span>
                    <span>مدیریت تقویم آموزشی</span>
                </button>
            </nav>

            <div class="p-4 border-t border-slate-800">
                <button @click="handleLogout"
                    class="w-full flex items-center justify-center space-x-2 space-x-reverse py-3 px-4 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all font-bold">
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
                    class="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 text-sm font-bold text-slate-600 flex items-center gap-2">
                    <span>📅</span> امروز: {{ new Date().toLocaleDateString('fa-IR') }}
                </div>
            </header>

            <section v-if="activeTab === 'receipts'">
                <div v-if="isLoadingReceipts" class="flex flex-col items-center justify-center py-20">
                    <div class="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4">
                    </div>
                    <p class="text-slate-500 font-bold">در حال دریافت فیش‌ها...</p>
                </div>

                <div v-else-if="receipts.length === 0"
                    class="bg-white rounded-3xl shadow-sm border border-slate-100 p-16 text-center">
                    <div class="text-7xl mb-4">✨</div>
                    <h3 class="text-xl font-black text-slate-700 mb-2">همه چیز مرتب است!</h3>
                    <p class="text-slate-500">در حال حاضر هیچ فیش جدیدی برای بررسی وجود ندارد.</p>
                </div>

                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="receipt in receipts" :key="receipt.id"
                        class="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 hover:shadow-lg transition-all relative overflow-hidden group">
                        <div class="absolute top-0 right-0 w-2 h-full bg-yellow-400"></div>
                        <div class="flex justify-between items-start mb-6">
                            <div>
                                <p class="font-black text-lg text-slate-800">{{ receipt.studentName }}</p>
                                <p class="text-xs text-slate-500 font-bold mt-1">{{ receipt.uploadDate }}</p>
                            </div>
                            <span class="bg-yellow-100 text-yellow-700 text-xs font-black px-3 py-1 rounded-full">در
                                انتظار بررسی</span>
                        </div>

                        <div
                            class="bg-slate-100 h-40 rounded-2xl mb-6 flex items-center justify-center border-2 border-slate-200 overflow-hidden relative group">
                            <img :src="'http://localhost:3000/uploads/' + receipt.filename"
                                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                alt="فیش واریزی" />
                            <a :href="'http://localhost:3000/uploads/' + receipt.filename" target="_blank"
                                class="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span class="text-4xl">🔍</span>
                                <span class="text-white font-bold text-sm mt-2">مشاهده کامل تصویر</span>
                            </a>
                        </div>

                        <div class="flex space-x-3 space-x-reverse">
                            <button @click="approveReceipt(receipt.id)"
                                class="flex-1 bg-green-500 text-white py-3 rounded-xl hover:bg-green-600 transition shadow-sm font-black text-sm">تایید</button>
                            <button @click="rejectReceipt(receipt.id)"
                                class="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl hover:bg-red-50 hover:text-red-500 transition font-black text-sm">رد
                                کردن</button>
                        </div>
                    </div>
                </div>
            </section>

            <section v-if="activeTab === 'students'">
                <div class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h3 class="font-black text-lg text-slate-800">لیست ثبت‌نامی‌ها</h3>
                    </div>

                    <div v-if="isLoadingStudents" class="py-20 text-center">
                        <div
                            class="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4">
                        </div>
                    </div>

                    <div v-else class="overflow-x-auto">
                        <table class="w-full text-right">
                            <thead>
                                <tr
                                    class="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100 bg-slate-50/30">
                                    <th class="px-6 py-4 font-black">نام و نام خانوادگی</th>
                                    <th class="px-6 py-4 font-black">شماره موبایل</th>
                                    <th class="px-6 py-4 font-black">تاریخ عضویت</th>
                                    <th class="px-6 py-4 font-black">تعیین سطح</th>
                                    <th class="px-6 py-4 font-black text-center">وضعیت رزرو</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                <tr v-for="student in students" :key="student.id"
                                    class="hover:bg-slate-50/50 transition-colors">
                                    <td class="px-6 py-5">
                                        <div class="flex items-center gap-3">
                                            <div
                                                class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black">
                                                {{ student.firstName.charAt(0) }}
                                            </div>
                                            <span class="font-bold text-slate-800">{{ student.firstName }} {{
                                                student.lastName }}</span>
                                        </div>
                                    </td>
                                    <td class="px-6 py-5 text-sm font-mono text-slate-600">{{ student.phone }}</td>
                                    <td class="px-6 py-5 text-sm text-slate-500 font-bold">{{ student.regDate }}</td>
                                    <td class="px-6 py-5">
                                        <select @change="changeLevel(student.id, $event.target.value)"
                                            class="bg-white border border-slate-200 text-slate-700 text-xs font-black rounded-lg px-2 py-1 outline-none focus:border-blue-500 cursor-pointer">
                                            <option value="" disabled :selected="!student.level">انتخاب کنید</option>
                                            <option v-for="level in ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']" :key="level"
                                                :value="level" :selected="student.level === level">
                                                {{ level }}
                                            </option>
                                        </select>
                                    </td>
                                    <td class="px-6 py-5 text-center">
                                        <span
                                            :class="student.status === 'رزرو شده' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
                                            class="px-3 py-1 rounded-full text-xs font-black">
                                            {{ student.status }}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <section v-if="activeTab === 'slots'">
                <div class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8 transition-all"
                    :class="isEditingMode ? 'border-yellow-400 ring-4 ring-yellow-50' : ''">
                    <h3 class="text-xl font-black text-gray-800 mb-4 flex items-center gap-2">
                        <span class="text-2xl">{{ isEditingMode ? '✏️' : '🗓️' }}</span>
                        {{ isEditingMode ? 'ویرایش ظرفیت انتخاب شده' : 'باز کردن ظرفیت تعیین سطح جدید' }}
                    </h3>

                    <form @submit.prevent="submitSlot"
                        class="flex flex-col md:flex-row gap-4 items-end bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                        <div class="flex-1 w-full">
                            <label class="block text-sm font-bold text-gray-700 mb-2">زمان شروع</label>
                            <input v-model="slotForm.startTime" type="datetime-local" required
                                class="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-blue-500 font-mono text-sm"
                                dir="ltr" />
                        </div>
                        <div class="flex-1 w-full">
                            <label class="block text-sm font-bold text-gray-700 mb-2">زمان پایان</label>
                            <input v-model="slotForm.endTime" type="datetime-local" required
                                class="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-blue-500 font-mono text-sm"
                                dir="ltr" />
                        </div>
                        <div class="flex-1 w-full">
                            <label class="block text-sm font-bold text-gray-700 mb-2">لینک کلاس</label>
                            <input v-model="slotForm.meetingLink" type="url" placeholder="https://..."
                                class="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-blue-500 font-mono text-sm text-left"
                                dir="ltr" />
                        </div>

                        <div class="flex gap-2 w-full md:w-auto">
                            <button v-if="isEditingMode" type="button" @click="cancelEdit"
                                class="bg-gray-200 text-gray-600 font-bold py-3 px-4 rounded-xl hover:bg-gray-300 transition">انصراف</button>
                            <button type="submit" :disabled="isSubmitting"
                                :class="isEditingMode ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700'"
                                class="flex-1 text-white font-bold py-3 px-8 rounded-xl transition shadow-md disabled:bg-gray-400">
                                {{ isSubmitting ? '...' : (isEditingMode ? 'ذخیره تغییرات' : '+ ایجاد ظرفیت') }}
                            </button>
                        </div>
                    </form>
                </div>

                <div class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h3 class="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
                        <span class="text-2xl">👨‍🏫</span> برنامه جلسات تعیین سطح شما
                    </h3>

                    <div v-if="mySlots.length === 0"
                        class="text-center py-8 text-gray-400 font-bold bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        هنوز هیچ تایمی تعریف نکرده‌اید.
                    </div>

                    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div v-for="slot in mySlots" :key="slot.id"
                            :class="slot.isBooked ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'"
                            class="p-5 rounded-2xl border flex flex-col justify-between hover:shadow-md transition-shadow">
                            <div>
                                <div class="flex justify-between items-center mb-4">
                                    <span class="text-xs font-black px-3 py-1.5 rounded-lg"
                                        :class="slot.isBooked ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-600'">
                                        {{ slot.isBooked ? 'رزرو شده 🔴' : 'آزاد 🟢' }}
                                    </span>
                                    <span
                                        class="text-sm text-gray-600 font-mono font-bold border border-gray-200 bg-white px-2 py-1 rounded"
                                        dir="ltr">
                                        {{ new Date(slot.startTime).toLocaleTimeString('fa-IR', {
                                            hour: '2-digit',
                                        minute:'2-digit'}) }}
                                    </span>
                                </div>
                                <p class="text-sm font-bold text-gray-800 mb-1 border-b border-gray-200/50 pb-2">
                                    📅 {{ new Date(slot.startTime).toLocaleDateString('fa-IR', {
                                        weekday: 'long', year:
                                            'numeric', month: 'long', day: 'numeric' }) }}
                                </p>

                                <div v-if="slot.isBooked" class="mt-3">
                                    <p class="text-xs text-gray-500 mb-1">زبان‌آموز:</p>
                                    <p class="font-black text-gray-800 text-lg flex items-center gap-2">
                                        <span>👤</span> {{ slot.student?.firstName || 'بدون نام' }} {{
                                        slot.student?.lastName || '' }}
                                    </p>
                                    <p class="text-xs text-gray-500 mt-1 font-mono" dir="ltr">{{
                                        slot.student?.phoneNumber }}</p>
                                </div>
                                <p v-else class="text-sm text-gray-400 mt-4 italic text-center">
                                    منتظر رزرو زبان‌آموز...
                                </p>

                                <div class="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-2">
                                    <button @click="editSlot(slot)"
                                        class="text-blue-500 bg-blue-50 p-2 rounded-lg hover:bg-blue-100 transition"
                                        title="ویرایش">
                                        ✏️
                                    </button>
                                    <button @click="deleteSlot(slot.id)"
                                        class="text-red-500 bg-red-50 p-2 rounded-lg hover:bg-red-100 transition"
                                        title="حذف">
                                        🗑️
                                    </button>
                                </div>

                                <div v-if="slot.isBooked && !slot.isCompleted" class="mt-2">
                                    <button v-if="isClassStarted(slot.startTime)" @click="openGradingModal(slot)"
                                        class="w-full bg-purple-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-purple-700 transition shadow-md flex justify-center items-center gap-2">
                                        <span>📝</span> ثبت نتیجه آزمون
                                    </button>
                                    <button v-else disabled
                                        class="w-full bg-gray-100 text-gray-400 py-2 rounded-lg font-bold text-sm border border-gray-200 cursor-not-allowed flex justify-center items-center gap-2">
                                        <span>⏳</span> هنوز شروع نشده
                                    </button>
                                </div>

                                <div v-if="slot.isCompleted"
                                    class="w-full mt-2 bg-green-100 text-green-700 py-2 rounded-lg font-bold text-xs text-center border border-green-200">
                                    نمره ثبت شد: {{ slot.score }} ✅
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </div>

    <div v-if="showGradingModal"
        class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 border border-gray-200">
            <h3 class="text-xl font-black text-gray-800 mb-4">ثبت نتیجه تعیین سطح</h3>
            <p class="text-sm text-gray-500 mb-6">برای دانش‌آموز: <span class="font-bold text-blue-600">{{
                    selectedStudentName }}</span></p>

            <form @submit.prevent="submitGrade">
                <div class="space-y-4">
                    <div>
                        <label class="block text-xs font-bold text-gray-700 mb-1">سطح تعیین شده</label>
                        <select v-model="gradeForm.assignedLevel"
                            class="w-full p-3 rounded-xl border bg-gray-50 font-mono text-sm" required>
                            <option value="A1">A1 - مقدماتی</option>
                            <option value="A2">A2 - متوسطه پایین</option>
                            <option value="B1">B1 - متوسطه</option>
                            <option value="B2">B2 - متوسطه بالا</option>
                            <option value="C1">C1 - پیشرفته</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-700 mb-1">نمره (از ۱۰۰)</label>
                        <input v-model="gradeForm.score" type="number" min="0" max="100"
                            class="w-full p-3 rounded-xl border bg-gray-50 font-mono text-sm" required />
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-700 mb-1">توضیحات و فیدبک</label>
                        <textarea v-model="gradeForm.feedback" rows="3"
                            class="w-full p-3 rounded-xl border bg-gray-50 text-sm"
                            placeholder="نقاط قوت و ضعف..."></textarea>
                    </div>
                </div>

                <div class="flex gap-3 mt-6">
                    <button type="button" @click="showGradingModal = false"
                        class="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200">انصراف</button>
                    <button type="submit"
                        class="flex-1 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 shadow-lg shadow-purple-200">ثبت
                        نهایی</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

// --- مدیریت تب‌ها و هدر ---
const activeTab = ref('receipts');
const pageTitle = computed(() => {
    if (activeTab.value === 'receipts') return 'مدیریت پرداخت‌ها';
    if (activeTab.value === 'students') return 'دانش‌آموزان کافه فرانسوی';
    return 'تقویم و ظرفیت‌ها';
});

// --- متغیرهای بخش فیش‌ها ---
const receipts = ref([]);
const isLoadingReceipts = ref(false);

// --- متغیرهای بخش زبان‌آموزان ---
const students = ref([]);
const isLoadingStudents = ref(false);

// --- متغیرهای بخش اسلات‌ها (تقویم) ---
const slotForm = ref({ startTime: '', endTime: '', meetingLink: '' });
const isSubmitting = ref(false);
const isEditingMode = ref(false);
const editingId = ref(null);
const mySlots = ref([]);

// --- متغیرهای مودال نمره دهی ---
const showGradingModal = ref(false);
const selectedStudentName = ref('');
const gradeForm = ref({ slotId: null, score: '', feedback: '', assignedLevel: 'A1' });


// ==========================================
// توابع دریافت اطلاعات (GET)
// ==========================================

const fetchReceipts = async () => {
    try {
        isLoadingReceipts.value = true;
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/admin/receipts', {
            headers: { Authorization: `Bearer ${token}` }
        });
        receipts.value = response.data.receipts;
    } catch (error) {
        if (error.response?.status === 401) router.push('/');
    } finally {
        isLoadingReceipts.value = false;
    }
};

const fetchStudents = async () => {
    try {
        isLoadingStudents.value = true;
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/admin/students', {
            headers: { Authorization: `Bearer ${token}` }
        });
        students.value = response.data.students;
    } catch (error) {
        console.error(error);
    } finally {
        isLoadingStudents.value = false;
    }
};

const fetchMySlots = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/slots/teacher-slots', {
            headers: { Authorization: `Bearer ${token}` }
        });
        mySlots.value = response.data.slots;
    } catch (error) {
        console.error("خطا در دریافت برنامه‌ها", error);
    }
};

// واچر برای لود کردن دیتا هنگام تغییر تب
watch(activeTab, (newTab) => {
    if (newTab === 'students' && students.value.length === 0) fetchStudents();
    if (newTab === 'receipts') fetchReceipts();
    if (newTab === 'slots') fetchMySlots();
});


// ==========================================
// عملیات روی فیش‌ها
// ==========================================

const approveReceipt = async (id) => {
    try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:3000/api/admin/update-ticket-status',
            { ticketId: id, newStatus: 'APPROVED' },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        receipts.value = receipts.value.filter(r => r.id !== id);
        alert('فیش تایید شد. ✅');
    } catch (error) {
        alert('خطا در تایید فیش.');
    }
};

const rejectReceipt = async (id) => {
    if (!confirm('آیا از رد کردن این فیش مطمئن هستید؟')) return;
    try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:3000/api/admin/update-ticket-status',
            { ticketId: id, newStatus: 'REJECTED' },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        receipts.value = receipts.value.filter(r => r.id !== id);
        alert('فیش رد شد. ❌');
    } catch (error) {
        alert('خطا در رد کردن فیش.');
    }
};

// ==========================================
// عملیات روی دانش‌آموزان
// ==========================================

const changeLevel = async (studentId, newLevel) => {
    try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:3000/api/admin/update-student-level',
            { studentId, newLevel },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        alert(`سطح جدید (${newLevel}) با موفقیت ثبت شد. ✅`);
    } catch (error) {
        alert('خطا در ثبت سطح آموزشی.');
    }
};

// ==========================================
// عملیات روی اسلات‌ها (تقویم)
// ==========================================

// آماده‌سازی فرم برای ویرایش
const editSlot = (slot) => {
    isEditingMode.value = true;
    editingId.value = slot.id;
    // تبدیل تاریخ به فرمت مناسب اینپوت datetime-local (YYYY-MM-DDTHH:mm)
    slotForm.value = {
        startTime: new Date(slot.startTime).toISOString().slice(0, 16),
        endTime: new Date(slot.endTime).toISOString().slice(0, 16),
        meetingLink: slot.meetingLink || ''
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// انصراف از ویرایش
const cancelEdit = () => {
    isEditingMode.value = false;
    editingId.value = null;
    slotForm.value = { startTime: '', endTime: '', meetingLink: '' };
};

// ثبت نهایی (ایجاد یا آپدیت)
const submitSlot = async () => {
    try {
        isSubmitting.value = true;
        const token = localStorage.getItem('token');

        if (isEditingMode.value) {
            // آپدیت
            await axios.put(`http://localhost:3000/api/slots/update/${editingId.value}`, slotForm.value, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('تایم با موفقیت ویرایش شد ✅');
        } else {
            // ایجاد جدید
            await axios.post('http://localhost:3000/api/slots/create', slotForm.value, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('ظرفیت جدید ساخته شد ✅');
        }

        cancelEdit(); // ریست کردن فرم
        fetchMySlots(); // آپدیت لیست
    } catch (error) {
        alert(error.response?.data?.message || 'خطا در عملیات.');
    } finally {
        isSubmitting.value = false;
    }
};

// حذف اسلات
const deleteSlot = async (id) => {
    if (!confirm("آیا از حذف این تایم مطمئن هستید؟")) return;

    try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3000/api/slots/delete/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchMySlots();
        alert("تایم حذف شد 🗑️");
    } catch (error) {
        alert("خطا در حذف. ممکن است این تایم رزرو شده باشد.");
    }
};

// ==========================================
// عملیات ثبت نمره (Grading)
// ==========================================

// چک کردن اینکه آیا زمان کلاس رسیده است؟
const isClassStarted = (startTime) => {
    return new Date() >= new Date(startTime);
};

const openGradingModal = (slot) => {
    gradeForm.value.slotId = slot.id;
    selectedStudentName.value = slot.student ? `${slot.student.firstName} ${slot.student.lastName}` : 'نامشخص';
    showGradingModal.value = true;
};

const submitGrade = async () => {
    try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:3000/api/slots/submit-result', gradeForm.value, {
            headers: { Authorization: `Bearer ${token}` }
        });

        alert('نتیجه با موفقیت ثبت شد! 🎉');
        showGradingModal.value = false;
        fetchMySlots();
    } catch (error) {
        alert(error.response?.data?.message || 'خطا در ثبت نمره.');
    }
};

const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
};

// اجرای اولیه
onMounted(() => {
    fetchReceipts();
});
</script>