<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 font-sans" dir="rtl">
        <div class="max-w-md w-full bg-white rounded-3xl shadow-lg p-8 border border-gray-100 relative overflow-hidden">
            <div class="absolute -top-10 -right-10 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-60"></div>

            <div class="relative z-10">
                <div class="text-center mb-8">
                    <span class="text-4xl mb-2 block">🔐</span>
                    <h2 class="text-2xl font-black text-gray-800">ورود به کافه فرانسوی</h2>
                    <p class="text-sm text-gray-500 mt-2">برای ورود به پنل، شماره موبایل خود را وارد کنید.</p>
                </div>

                <form @submit.prevent="handleLogin" class="space-y-6">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">شماره موبایل</label>
                        <input v-model="form.phoneNumber" type="tel" required
                            class="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-colors font-mono text-left"
                            placeholder="09123456789" dir="ltr" />
                    </div>

                    <button type="submit" :disabled="isLoading"
                        class="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-blue-600 transition-all shadow-md disabled:bg-gray-300 flex justify-center items-center gap-2">
                        <span v-if="isLoading"
                            class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        <span>{{ isLoading ? 'در حال بررسی...' : 'ورود به سیستم' }}</span>
                    </button>
                </form>

                <p v-if="message" :class="isError ? 'text-red-500 bg-red-50' : 'text-green-600 bg-green-50'"
                    class="mt-6 text-center text-sm font-bold p-4 rounded-xl">
                    {{ message }}
                </p>

                <div class="mt-8 text-center border-t border-gray-100 pt-6">
                    <p class="text-sm text-gray-500">
                        حساب کاربری ندارید؟
                        <router-link to="/" class="text-blue-600 font-bold hover:underline">ثبت‌نام کنید</router-link>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = ref({ phoneNumber: '' });
const isLoading = ref(false);
const message = ref('');
const isError = ref(false);

const handleLogin = async () => {
    try {
        isLoading.value = true;
        isError.value = false;
        message.value = '';

        const response = await axios.post('http://localhost:3000/api/users/login', form.value);

        // ۱. ذخیره توکن امنیتی
        localStorage.setItem('token', response.data.token);

        // ۲. ذخیره نام کاربر برای نمایش در داشبورد
        localStorage.setItem('studentName', response.data.user.firstName);

        message.value = response.data.message;

        // ۳. هدایت کاربر بر اساس نقش (Role)
        setTimeout(() => {
            if (response.data.user.role === 'ADMIN' || response.data.user.role === 'TEACHER') {
                router.push('/admin'); // اگر استاد یا ادمین بود بره پنل مدیریت
            } else {
                router.push('/dashboard'); // اگر زبان‌آموز بود بره داشبورد خودش
            }
        }, 1000);

    } catch (error) {
        isError.value = true;
        message.value = error.response?.data?.message || "خطایی در ارتباط با سرور رخ داد.";
    } finally {
        isLoading.value = false;
    }
};
</script>