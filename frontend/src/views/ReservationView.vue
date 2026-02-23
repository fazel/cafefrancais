<template>
    <div class="min-h-screen bg-slate-50 flex font-sans" dir="rtl">
        <aside class="w-72 bg-white shadow-xl hidden md:block border-l border-slate-100 p-6">
            <h1 class="text-2xl font-black text-blue-600 mb-8">کافه فرانسوی 🇫🇷</h1>
            <nav class="space-y-2">
                <router-link to="/dashboard"
                    class="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl transition">
                    <span>🏠</span> داشبورد
                </router-link>
                <div
                    class="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl font-bold cursor-default">
                    <span>📅</span> رزرو تعیین سطح
                </div>
            </nav>
        </aside>

        <main class="flex-1 p-6 md:p-10">
            <header class="mb-10">
                <h2 class="text-3xl font-extrabold text-slate-800">رزرو جلسه تعیین سطح</h2>
                <p class="text-slate-500 mt-2">یکی از زمان‌های خالی زیر را انتخاب کنید تا سطح شما توسط مدرس سنجیده شود.
                </p>
            </header>

            <div v-if="isLoading" class="py-20 text-center">
                <div
                    class="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4">
                </div>
                <p class="text-slate-400 font-bold">در حال جستجوی تایم‌های خالی...</p>
            </div>

            <div v-else-if="availableSlots.length === 0"
                class="bg-white p-12 rounded-3xl text-center border border-slate-100 shadow-sm">
                <div class="text-6xl mb-4">😔</div>
                <h3 class="text-xl font-black text-slate-700 mb-2">هیچ تایم خالی وجود ندارد!</h3>
                <p class="text-slate-500 max-w-md mx-auto leading-relaxed">
                    متاسفانه تمام وقت‌های تعیین سطح پر شده‌اند یا مدرس هنوز تایم جدیدی باز نکرده است.
                    <br />لطفاً فردا دوباره سر بزنید.
                </p>
                <button @click="fetchSlots"
                    class="mt-6 px-6 py-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 font-bold transition">
                    🔄 تلاش مجدد
                </button>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="slot in availableSlots" :key="slot.id"
                    class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all group relative overflow-hidden">

                    <div
                        class="absolute top-0 right-0 w-2 h-full bg-blue-500 group-hover:bg-blue-600 transition-colors">
                    </div>

                    <div class="flex justify-between items-start mb-4">
                        <span class="bg-blue-50 text-blue-700 text-xs font-black px-3 py-1 rounded-full">
                            جلسه آنلاین 📹
                        </span>
                        <span class="text-slate-400 text-sm font-mono font-bold">
                            {{ getDuration(slot.startTime, slot.endTime) }} دقیقه
                        </span>
                    </div>

                    <div class="text-center py-4">
                        <p class="text-lg font-black text-slate-800 mb-1">
                            {{ new Date(slot.startTime).toLocaleDateString('fa-IR', {
                                weekday: 'long', day: 'numeric',
                            month: 'long' }) }}
                        </p>
                        <p class="text-3xl font-black text-blue-600 font-mono my-2" dir="ltr">
                            {{ new Date(slot.startTime).toLocaleTimeString('fa-IR', {
                                hour: '2-digit', minute: '2-digit'
                            }) }}
                        </p>
                        <p class="text-xs text-slate-400">مدرس: {{ slot.teacher?.firstName }} {{ slot.teacher?.lastName
                            }}</p>
                    </div>

                    <button @click="bookSlot(slot.id)" :disabled="isBooking"
                        class="w-full mt-4 py-3 rounded-xl font-bold transition-all flex justify-center items-center gap-2"
                        :class="isBooking ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-blue-600 shadow-lg hover:shadow-blue-500/30'">
                        <span v-if="isBooking && selectedSlotId === slot.id"
                            class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        <span>{{ (isBooking && selectedSlotId === slot.id) ? 'در حال رزرو...' : 'رزرو این تایم'
                            }}</span>
                    </button>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const availableSlots = ref([]);
const isLoading = ref(true);
const isBooking = ref(false);
const selectedSlotId = ref(null); // برای اینکه فقط دکمه‌ی کارتی که کلیک شده لودینگ شود

// محاسبه مدت زمان کلاس
const getDuration = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    return (e - s) / 60000; // تبدیل میلی‌ثانیه به دقیقه
};

const fetchSlots = async () => {
    try {
        isLoading.value = true;
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/slots/available', {
            headers: { Authorization: `Bearer ${token}` }
        });
        availableSlots.value = response.data.slots;
    } catch (error) {
        if (error.response?.status === 401) router.push('/');
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
        const token = localStorage.getItem('token');

        await axios.post('http://localhost:3000/api/slots/book',
            { slotId },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        alert("تبریک! جلسه تعیین سطح شما رزرو شد. 🎉");
        router.push('/dashboard'); // بازگشت به داشبورد برای دیدن وضعیت جدید

    } catch (error) {
        alert(error.response?.data?.message || "خطا در رزرو.");
    } finally {
        isBooking.value = false;
        selectedSlotId.value = null;
    }
};

onMounted(() => {
    fetchSlots();
});
</script>