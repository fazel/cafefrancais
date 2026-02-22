<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 font-sans" dir="rtl">
        <div class="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">

            <div class="bg-slate-50 border-b border-gray-100 p-2 flex gap-2">
                <button @click="loginType = 'STUDENT'"
                    :class="['flex-1 py-3 text-sm font-bold rounded-2xl transition-all', loginType === 'STUDENT' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600']">
                    🎓 زبان‌آموز
                </button>
                <button @click="loginType = 'TEACHER'"
                    :class="['flex-1 py-3 text-sm font-bold rounded-2xl transition-all', loginType === 'TEACHER' ? 'bg-slate-800 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600']">
                    👨‍🏫 کادر آموزشی
                </button>
            </div>

            <div class="p-8 relative z-10">
                <div class="text-center mb-8">
                    <span class="text-4xl mb-2 block">{{ loginType === 'STUDENT' ? '🇫🇷' : '💼' }}</span>
                    <h2 class="text-2xl font-black text-gray-800">
                        {{ loginType === 'STUDENT' ? 'ورود به کافه فرانسوی' : 'پنل مدیریت' }}
                    </h2>
                    <p class="text-sm text-gray-500 mt-2">شماره موبایل خود را وارد کنید</p>
                </div>

                <form @submit.prevent="handleLogin" class="space-y-6">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">شماره موبایل</label>
                        <input v-model="form.phoneNumber" type="tel" required
                            :class="['w-full px-5 py-3 border-2 rounded-xl outline-none transition-colors font-mono text-left',
                                loginType === 'TEACHER' ? 'border-slate-200 focus:border-slate-800' : 'border-gray-200 focus:border-blue-500']" placeholder="09123456789"
                            dir="ltr" />
                    </div>

                    <button type="submit" :disabled="isLoading"
                        :class="['w-full text-white font-bold py-4 rounded-xl transition-all shadow-md disabled:bg-gray-300 flex justify-center items-center gap-2',
                            loginType === 'TEACHER' ? 'bg-slate-800 hover:bg-slate-900' : 'bg-blue-600 hover:bg-blue-700']">
                        <span v-if="isLoading"
                            class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        <span>{{ isLoading ? 'در حال بررسی...' : 'ورود به سیستم' }}</span>
                    </button>
                </form>

                <p v-if="message" :class="isError ? 'text-red-500 bg-red-50' : 'text-green-600 bg-green-50'"
                    class="mt-6 text-center text-sm font-bold p-4 rounded-xl">
                    {{ message }}
                </p>

                <div v-if="loginType === 'STUDENT'" class="mt-8 text-center border-t border-gray-100 pt-6">
                    <p class="text-sm text-gray-500">
                        حساب کاربری ندارید؟
                        <router-link to="/register" class="text-blue-600 font-bold hover:underline">ثبت‌نام
                            کنید</router-link>
                    </p>
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
const form = ref({ phoneNumber: '' });
const isLoading = ref(false);
const message = ref('');
const isError = ref(false);
const loginType = ref('STUDENT');

// چک کردن اینکه آیا کاربر از قبل لاگین است؟
onMounted(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    if (token) {
        if (role === 'ADMIN' || role === 'TEACHER') {
            router.push('/admin');
        } else {
            router.push('/dashboard');
        }
    }
});

const handleLogin = async () => {
    try {
        isLoading.value = true;
        isError.value = false;
        message.value = '';

        const apiUrl = loginType.value === 'STUDENT'
            ? 'http://localhost:3000/api/users/login'
            : 'http://localhost:3000/api/users/teacher-login';

        const response = await axios.post(apiUrl, form.value);

        // ذخیره اطلاعات مهم در مرورگر
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', response.data.user.role); // نقش کاربر ذخیره می‌شود
        if (response.data.user?.firstName) {
            localStorage.setItem('studentName', response.data.user.firstName);
        }

        message.value = response.data.message;

        // هدایت به داشبورد مربوطه
        setTimeout(() => {
            if (response.data.user.role === 'ADMIN' || response.data.user.role === 'TEACHER') {
                router.push('/admin');
            } else {
                router.push('/dashboard');
            }
        }, 1000);

    } catch (error) {
        isError.value = true;
        message.value = error.response?.data?.message || "خطایی رخ داد. اتصال را بررسی کنید.";
    } finally {
        isLoading.value = false;
    }
};
</script>