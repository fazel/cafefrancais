<template>
    <div class="min-h-screen bg-slate-50 flex font-sans" dir="rtl">
        <aside class="w-72 bg-slate-900 text-white shadow-xl hidden md:flex flex-col">
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
            </nav>

            <div class="p-4 border-t border-slate-800">
                <button @click="handleLogout"
                    class="w-full flex items-center justify-center space-x-2 space-x-reverse py-3 px-4 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all font-bold">
                    <span>🚪</span>
                    <span>خروج از پنل</span>
                </button>
            </div>
        </aside>

        <main class="flex-1 p-6 md:p-10 overflow-y-auto">
            <header class="flex justify-between items-center mb-10">
                <h2 class="text-3xl font-extrabold text-slate-800">
                    {{ activeTab === 'receipts' ? 'مدیریت پرداخت‌ها' : 'دانش‌آموزان کافه فرانسوی' }}
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
                        <button
                            class="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-100 transition">
                            + افزودن دستی
                        </button>
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
                                    <th class="px-6 py-4 font-black">وضعیت پرونده</th>
                                    <th class="px-6 py-4 font-black text-center">عملیات</th>
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
                                            class="bg-white border border-slate-200 text-slate-700 text-xs font-black rounded-lg px-2 py-1 outline-none focus:border-blue-500">
                                            <option value="" disabled :selected="!student.level">تعیین سطح</option>
                                            <option v-for="level in ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']" :key="level"
                                                :value="level" :selected="student.level === level">
                                                {{ level }}
                                            </option>
                                        </select>
                                    </td>
                                    <td class="px-6 py-5 text-center">
                                        <button
                                            class="text-blue-500 hover:text-blue-700 font-black text-sm bg-blue-50 px-3 py-1.5 rounded-lg transition">مشاهده
                                            پرونده</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

        </main>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

// متغیرهای مدیریت تب‌ها
const activeTab = ref('receipts');

// استیت‌های بخش فیش‌ها
const receipts = ref([]);
const isLoadingReceipts = ref(false);

// استیت‌های بخش زبان‌آموزان
const students = ref([]);
const isLoadingStudents = ref(false);

// توابع دریافت دیتا
const fetchReceipts = async () => {
    try {
        isLoadingReceipts.value = true;
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/admin/receipts', {
            headers: { Authorization: `Bearer ${token}` }
        });
        receipts.value = response.data.receipts;
    } catch (error) {
        if (error.response?.status === 401) router.push('/login');
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
        if (error.response?.status === 401) router.push('/login');
    } finally {
        isLoadingStudents.value = false;
    }
};

// واچ کردن تغییرات تب برای لود کردن دیتای مناسب
watch(activeTab, (newTab) => {
    if (newTab === 'students' && students.value.length === 0) {
        fetchStudents();
    }
});

const approveReceipt = async (id) => {
    try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:3000/api/admin/update-ticket-status',
            { ticketId: id, newStatus: 'APPROVED' },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        // حذف فیش از لیست فعلی در صفحه (UI Update)
        receipts.value = receipts.value.filter(r => r.id !== id);
        alert('فیش تایید شد و وضعیت زبان‌آموز تغییر یافت. ✅');
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
const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
};

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

// اجرای اولیه
onMounted(() => {
    fetchReceipts();
});
</script>