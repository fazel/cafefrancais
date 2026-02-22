<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 font-sans" dir="rtl">
        <div class="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">ثبت‌نام در کافه فرانسوی 🇫🇷</h2>

            <form @submit.prevent="handleRegister" class="space-y-5">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">نام</label>
                    <input v-model="form.firstName" type="text" required
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="مثلاً: علی" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">نام خانوادگی</label>
                    <input v-model="form.lastName" type="text" required
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="مثلاً: رضایی" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">شماره موبایل</label>
                    <input v-model="form.phoneNumber" type="tel" required
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="09123456789" />
                </div>

                <button type="submit" :disabled="isLoading"
                    class="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-blue-300 mt-4">
                    {{ isLoading ? 'در حال ارسال...' : 'شروع یادگیری' }}
                </button>
            </form>

            <p v-if="message" :class="isError ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50'"
                class="mt-6 text-center text-sm font-medium p-3 rounded-lg">
                {{ message }}
            </p>

            <div class="mt-6 text-center border-t border-gray-100 pt-6">
                <p class="text-sm text-gray-500">
                    قبلاً ثبت‌نام کرده‌اید؟
                    <router-link to="/" class="text-blue-600 font-bold hover:underline">وارد شوید</router-link>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const form = ref({
    firstName: '',
    lastName: '',
    phoneNumber: ''
});

const router = useRouter();
const isLoading = ref(false);
const message = ref('');
const isError = ref(false);

const handleRegister = async () => {
    try {
        isLoading.value = true;
        isError.value = false;

        const response = await axios.post('http://localhost:3000/api/users/register', form.value);

        // چون کاربر تازه ثبت‌نام کرده، نقشش را هم به عنوان دانش‌آموز ذخیره می‌کنیم
        localStorage.setItem('studentName', form.value.firstName);
        localStorage.setItem('userRole', 'STUDENT');

        message.value = "ثبت‌نام با موفقیت انجام شد! در حال انتقال به ورود...";

        // هدایت کاربر به صفحه لاگین (تا از مسیر درست وارد شود)
        setTimeout(() => {
            router.push('/');
        }, 1500);

    } catch (error) {
        isError.value = true;
        message.value = error.response?.data?.message || 'خطایی در ارتباط با سرور رخ داد.';
    } finally {
        isLoading.value = false;
    }
};
</script>