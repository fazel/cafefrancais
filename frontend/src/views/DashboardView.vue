<template>
    <div class="min-h-screen bg-gray-50 flex font-sans" dir="rtl">
        <aside class="w-72 bg-white shadow-xl hidden md:block border-l border-gray-100 relative">
            <div class="p-8">
                <h1 class="text-2xl font-black text-blue-600 tracking-tight">کافه فرانسوی 🇫🇷</h1>
                <p class="text-xs text-gray-400 mt-1 uppercase tracking-widest">Apprentissage du français</p>
            </div>

            <nav class="mt-4 px-4 space-y-2 flex flex-col h-[calc(100vh-280px)] justify-between">
                <div>
                    <a href="#"
                        class="flex items-center space-x-3 space-x-reverse py-3 px-4 bg-blue-50 text-blue-700 rounded-xl font-bold">
                        <span>🏠</span>
                        <span>میز کار (داشبورد)</span>
                    </a>
                    <router-link to="/reserve"
                        class="flex items-center space-x-3 space-x-reverse py-3 px-4 text-gray-600 hover:bg-gray-50 rounded-xl transition-all mt-2">
                        <span>📅</span>
                        <span>رزرو تعیین سطح</span>
                    </router-link>
                    <a href="#"
                        class="flex items-center space-x-3 space-x-reverse py-3 px-4 text-gray-600 hover:bg-gray-50 rounded-xl transition-all opacity-50 cursor-not-allowed mt-2">
                        <span>📚</span>
                        <span>کلاس‌های من</span>
                    </a>
                    <a href="#"
                        class="flex items-center space-x-3 space-x-reverse py-3 px-4 text-gray-600 hover:bg-gray-50 rounded-xl transition-all opacity-50 cursor-not-allowed mt-2">
                        <span>💬</span>
                        <span>پشتیبانی</span>
                    </a>
                </div>

                <button @click="handleLogout"
                    class="flex items-center space-x-3 space-x-reverse py-3 px-4 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all font-bold mt-auto border border-transparent hover:border-red-100">
                    <span>🚪</span>
                    <span>خروج از حساب</span>
                </button>
            </nav>

            <div class="absolute bottom-8 w-72 px-8">
                <div class="bg-gradient-to-br from-blue-600 to-indigo-700 p-4 rounded-2xl text-white shadow-lg">
                    <p class="text-xs opacity-80 mb-1">پیشرفت آموزشی</p>
                    <div class="h-2 bg-white/20 rounded-full overflow-hidden">
                        <div class="w-1/3 h-full bg-white rounded-full"></div>
                    </div>
                    <p class="text-[10px] mt-2 text-left italic">Niveau: Débutant (A1.1)</p>
                </div>
            </div>
        </aside>

        <main class="flex-1 p-4 md:p-10 overflow-y-auto">
            <header class="flex justify-between items-center mb-10">
                <div>
                    <h2 class="text-2xl font-extrabold text-gray-800">Bonjour, {{ userName }}! 👋</h2>
                    <p class="text-gray-500 mt-1">به پنل یادگیری خود خوش آمدید.</p>
                </div>
                <div class="flex items-center gap-4">
                    <div class="bg-white p-2 rounded-full shadow-sm border px-4 flex items-center gap-2">
                        <span class="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                        <span class="text-xs font-bold text-gray-600">وضعیت: در انتظار تعیین سطح</span>
                    </div>
                </div>
            </header>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div
                    class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div class="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 text-2xl">📖
                    </div>
                    <p class="text-gray-400 text-sm font-medium">کلاس‌های فعال</p>
                    <p class="text-3xl font-black text-gray-800 mt-1">۰</p>
                </div>
                <div
                    class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div class="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-4 text-2xl">🎯
                    </div>
                    <p class="text-gray-400 text-sm font-medium">سطح فعلی</p>
                    <p class="text-3xl font-black text-gray-800 mt-1">نامشخص</p>
                </div>
                <div
                    class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div class="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mb-4 text-2xl">💎
                    </div>
                    <p class="text-gray-400 text-sm font-medium">امتیاز (Bon point)</p>
                    <p class="text-3xl font-black text-gray-800 mt-1">۵۰</p>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                    <div class="relative z-10">
                        <h3 class="text-xl font-black text-gray-800 mb-2 flex items-center gap-2">
                            <span class="text-2xl">💳</span> پرداخت شهریه
                        </h3>
                        <p class="text-sm text-gray-500 mb-6 leading-relaxed">
                            برای فعال‌سازی ترم جدید، مبلغ <span class="font-bold text-gray-800">۴,۵۰۰,۰۰۰ تومان</span>
                            را به کارت زیر واریز و فیش را آپلود کنید:
                            <br />
                            <span
                                class="inline-block mt-2 bg-gray-100 px-3 py-1 rounded-lg font-mono tracking-widest text-blue-700">۶۰۳۷-۹۹۷۹-۸۸۸۸-۷۷۷۷</span>
                        </p>

                        <div class="space-y-4">
                            <div class="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-blue-400 transition-all cursor-pointer bg-gray-50/50 group"
                                @click="$refs.fileInput.click()">
                                <input type="file" ref="fileInput" @change="onFileSelected" accept="image/*"
                                    class="hidden" />
                                <div v-if="!selectedFile" class="space-y-2">
                                    <span class="text-4xl block group-hover:scale-110 transition-transform">📸</span>
                                    <p class="text-sm text-gray-400 font-bold">انتخاب تصویر فیش واریزی</p>
                                </div>
                                <div v-else class="flex items-center justify-center gap-3 text-blue-600 font-bold">
                                    <span class="text-xl">📄</span>
                                    <span class="text-sm">{{ selectedFile.name }}</span>
                                </div>
                            </div>

                            <button @click="uploadReceipt" :disabled="!selectedFile || isUploading"
                                class="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl hover:bg-blue-600 transition-all shadow-lg disabled:bg-gray-200 disabled:shadow-none flex items-center justify-center gap-2">
                                <span v-if="isUploading"
                                    class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                <span>{{ isUploading ? 'در حال ارسال...' : 'تایید و ارسال نهایی' }}</span>
                            </button>

                            <p v-if="uploadMessage" class="text-center text-sm font-bold mt-2"
                                :class="isUploadError ? 'text-red-500' : 'text-green-600'">
                                {{ uploadMessage }}
                            </p>
                        </div>
                    </div>
                </section>

                <section
                    class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                        <h3 class="text-xl font-black text-gray-800 mb-2 flex items-center gap-2">
                            <span class="text-2xl">🎓</span> وضعیت آموزشی
                        </h3>
                        <p class="text-sm text-gray-500 mb-8 leading-relaxed">آخرین وضعیت تعیین سطح و رزروهای شما در این
                            بخش نمایش داده می‌شود.</p>

                        <div class="bg-yellow-50 border border-yellow-100 rounded-2xl p-5 mb-4">
                            <p class="text-xs text-yellow-700 font-bold mb-1 italic uppercase tracking-tighter">
                                Prochaine étape:</p>
                            <p class="text-sm text-yellow-900 leading-relaxed font-bold">شما هنوز نوبت تعیین سطح رزرو
                                نکرده‌اید. برای شروع یادگیری، ابتدا یک تایم انتخاب کنید.</p>
                        </div>
                    </div>

                    <router-link to="/reserve"
                        class="w-full block bg-blue-50 text-blue-700 font-bold py-4 rounded-2xl text-center hover:bg-blue-100 transition-all border border-blue-100">
                        رزرو تایم تعیین سطح (رایگان)
                    </router-link>
                </section>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

// متغیرهای فرم و کاربر
const userName = ref("کاربر عزیز");
const selectedFile = ref(null);
const isUploading = ref(false);
const uploadMessage = ref('');
const isUploadError = ref(false);

// خواندن نام کاربر هنگام لود صفحه
onMounted(() => {
    const savedName = localStorage.getItem('studentName');
    if (savedName) {
        userName.value = savedName;
    }
});

// توابع مربوط به آپلود
const onFileSelected = (event) => {
    selectedFile.value = event.target.files[0];
    uploadMessage.value = '';
    isUploadError.value = false;
};

const uploadReceipt = async () => {
    if (!selectedFile.value) return;

    isUploading.value = true;
    isUploadError.value = false;

    const formData = new FormData();
    formData.append('receipt', selectedFile.value);

    // گرفتن توکن از حافظه مرورگر
    const token = localStorage.getItem('token');

    try {
        const response = await axios.post('http://localhost:3000/api/payments/upload-receipt', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}` // اضافه شدن کلید امنیتی
            }
        });
        uploadMessage.value = "فیش با موفقیت ارسال شد. منتظر تایید ادمین باشید.";
        selectedFile.value = null;
    } catch (error) {
        isUploadError.value = true;
        uploadMessage.value = "خطا در آپلود! حجم فایل یا اتصال را چک کنید.";
    } finally {
        isUploading.value = false;
    }
};

// تابع خروج
const handleLogout = () => {
    localStorage.removeItem('studentName');
    localStorage.removeItem('token');
    router.push('/');
};
</script>

<style scoped>
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>