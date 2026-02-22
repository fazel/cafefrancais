<template>
    <div class="min-h-screen bg-gray-50 p-6" dir="rtl">
        <div class="max-w-3xl mx-auto">
            <h2 class="text-3xl font-bold text-gray-800 mb-8 text-center">انتخاب زمان تعیین سطح 📅</h2>

            <div v-if="isLoading" class="text-center py-10">در حال بارگذاری تایم‌ها...</div>

            <div v-else-if="slots.length === 0" class="text-center py-10 bg-white rounded-xl shadow">
                <p class="text-gray-500 text-lg">در حال حاضر تایم خالی موجود نیست. 🛑</p>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="slot in slots" :key="slot.id"
                    class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-500 transition-all flex justify-between items-center">
                    <div>
                        <p class="font-bold text-gray-800">استاد: {{ slot.teacher.firstName }} {{ slot.teacher.lastName
                        }}</p>
                        <p class="text-sm text-gray-500 mt-1">
                            {{ new Date(slot.startTime).toLocaleDateString('fa-IR') }} ساعت {{ new
                                Date(slot.startTime).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }) }}
                        </p>
                    </div>
                    <button @click="bookThisSlot(slot.id)"
                        class="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition">
                        رزرو
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const slots = ref([]);
const isLoading = ref(true);
const actionMessage = ref('');

// دریافت لیست تایم‌ها
const fetchSlots = async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/slots/available');
        slots.value = response.data.slots;
    } catch (error) {
        console.error('خطا در دریافت تایم‌ها');
    } finally {
        isLoading.value = false;
    }
};

// رزرو تایم (با ارسال توکن)
const bookThisSlot = async (slotId) => {
    try {
        // گرفتن توکن از حافظه مرورگر
        const token = localStorage.getItem('token');

        if (!token) {
            alert('لطفاً ابتدا وارد حساب کاربری خود شوید.');
            router.push('/login');
            return;
        }

        // ارسال درخواست به همراه توکن
        await axios.post('http://localhost:3000/api/slots/book',
            { slotId: slotId },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        alert('تبریک! رزرو با موفقیت در دیتابیس ثبت شد. 🇫🇷');
        fetchSlots(); // رفرش کردن لیست تایم‌ها (تا تایمی که گرفتیم غیب شود)

        // برگشت به داشبورد بعد از رزرو موفق
        router.push('/dashboard');

    } catch (error) {
        alert(error.response?.data?.message || 'خطا در رزرو تایم');
    }
};

onMounted(fetchSlots);
</script>