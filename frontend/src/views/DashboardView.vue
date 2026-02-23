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
                        <span>رزرو تعیین سطح <span v-if="bookedSlot"
                                class="bg-green-100 text-green-600 text-[10px] px-2 py-0.5 rounded-full mr-2">۱
                                مورد</span></span>
                    </router-link>
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
                        <div :style="{ width: userLevel !== 'نامشخص' ? '60%' : '10%' }"
                            class="h-full bg-white rounded-full transition-all duration-1000"></div>
                    </div>
                    <p class="text-[10px] mt-2 text-left italic">Niveau: {{ userLevel }}</p>
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
                        <span :class="bookedSlot ? 'bg-green-500' : 'bg-yellow-500'"
                            class="w-2 h-2 rounded-full animate-pulse"></span>
                        <span class="text-xs font-bold text-gray-600">
                            وضعیت: {{ bookedSlot ? 'رزرو شده ✅' : 'در انتظار تعیین سطح' }}
                        </span>
                    </div>
                </div>
            </header>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div
                    class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div class="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 text-2xl">📖
                    </div>
                    <p class="text-gray-400 text-sm font-medium">کلاس‌های فعال</p>
                    <p class="text-3xl font-black text-gray-800 mt-1">{{ bookedSlot ? '۱' : '۰' }}</p>
                </div>
                <div
                    class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div class="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-4 text-2xl">🎯
                    </div>
                    <p class="text-gray-400 text-sm font-medium">سطح فعلی</p>
                    <p class="text-3xl font-black text-gray-800 mt-1">{{ userLevel }}</p>
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

                <section
                    class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden">
                    <div v-if="bookedSlot" class="absolute top-0 left-0 w-2 h-full bg-green-500"></div>

                    <div>
                        <h3 class="text-xl font-black text-gray-800 mb-2 flex items-center gap-2">
                            <span class="text-2xl">🎓</span> وضعیت کلاسی
                        </h3>

                        <div v-if="!bookedSlot">
                            <p class="text-sm text-gray-500 mb-8 leading-relaxed">برای شروع یادگیری، ابتدا باید تعیین
                                سطح شوید.</p>
                            <div class="bg-yellow-50 border border-yellow-100 rounded-2xl p-5 mb-4">
                                <p class="text-xs text-yellow-700 font-bold mb-1 italic uppercase tracking-tighter">
                                    Prochaine étape:</p>
                                <p class="text-sm text-yellow-900 leading-relaxed font-bold">شما هنوز نوبت تعیین سطح
                                    رزرو نکرده‌اید.</p>
                            </div>
                            <router-link to="/reserve"
                                class="w-full block bg-blue-50 text-blue-700 font-bold py-4 rounded-2xl text-center hover:bg-blue-100 transition-all border border-blue-100">
                                رزرو تایم تعیین سطح (رایگان)
                            </router-link>
                        </div>

                        <div v-else>
                            <p class="text-sm text-gray-500 mb-6 leading-relaxed">شما یک کلاس فعال دارید!</p>

                            <div class="bg-green-50 border border-green-100 rounded-2xl p-6 mb-6">
                                <div class="flex justify-between items-start mb-4">
                                    <span
                                        class="bg-white text-green-700 text-xs font-black px-3 py-1 rounded-lg border border-green-100">جلسه
                                        آنلاین</span>
                                    <span class="text-xs text-green-600 font-bold animate-pulse">🔴 در انتظار
                                        شروع...</span>
                                </div>
                                <h4 class="text-lg font-black text-gray-800 mb-1">جلسه تعیین سطح شفاهی</h4>
                                <p class="text-sm text-gray-600 font-bold mb-4">
                                    📅 {{ new Date(bookedSlot.startTime).toLocaleDateString('fa-IR', {
                                        weekday: 'long',
                                        day: 'numeric', month: 'long'
                                    }) }}
                                    - ساعت {{ new Date(bookedSlot.startTime).toLocaleTimeString('fa-IR', {
                                        hour:
                                            '2-digit', minute: '2-digit'
                                    }) }}
                                </p>

                                <a :href="bookedSlot.meetingLink || '#'" target="_blank"
                                    :class="!bookedSlot.meetingLink ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'"
                                    class="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-green-200">
                                    <span>🎥</span>
                                    <span>{{ bookedSlot.meetingLink ? 'ورود به کلاس آنلاین' : 'لینک هنوز ثبت نشده'
                                        }}</span>
                                </a>
                                <p class="text-[10px] text-center text-gray-400 mt-2">لطفاً ۵ دقیقه قبل از شروع وارد
                                    شوید.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                    <div class="relative z-10">
                        <h3 class="text-xl font-black text-gray-800 mb-2 flex items-center gap-2">
                            <span class="text-2xl">💳</span> پرداخت شهریه
                        </h3>
                        <p class="text-sm text-gray-500 mb-6 leading-relaxed">پس از تعیین سطح، فیش ترم جدید را اینجا
                            آپلود کنید.</p>

                        <div class="space-y-4">
                            <div class="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-blue-400 transition-all cursor-pointer bg-gray-50/50 group"
                                @click="$refs.fileInput.click()">
                                <input type="file" ref="fileInput" @change="onFileSelected" accept="image/*"
                                    class="hidden" />
                                <div v-if="!selectedFile" class="space-y-2">
                                    <span class="text-4xl block group-hover:scale-110 transition-transform">📸</span>
                                    <p class="text-sm text-gray-400 font-bold">انتخاب تصویر فیش</p>
                                </div>
                                <div v-else class="flex items-center justify-center gap-3 text-blue-600 font-bold">
                                    <span class="text-xl">📄</span>
                                    <span class="text-sm">{{ selectedFile.name }}</span>
                                </div>
                            </div>

                            <button @click="uploadReceipt" :disabled="!selectedFile || isUploading"
                                class="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl hover:bg-blue-600 transition-all shadow-lg disabled:bg-gray-200 flex items-center justify-center gap-2">
                                <span v-if="isUploading"
                                    class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                <span>{{ isUploading ? 'در حال ارسال...' : 'تایید و ارسال نهایی' }}</span>
                            </button>
                            <p v-if="uploadMessage" class="text-center text-sm font-bold mt-2"
                                :class="isUploadError ? 'text-red-500' : 'text-green-600'">{{ uploadMessage }}</p>
                        </div>
                    </div>
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

// متغیرهای وضعیت
const userName = ref("کاربر عزیز");
const userLevel = ref("نامشخص");
const bookedSlot = ref(null); // نگهداری اطلاعات کامل اسلات رزرو شده
const selectedFile = ref(null);
const isUploading = ref(false);
const uploadMessage = ref('');
const isUploadError = ref(false);

const fetchUserProfile = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/users/me', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const user = response.data.user;
        userName.value = user.firstName;
        userLevel.value = user.frenchLevel || "نامشخص";

        // اگر اسلات رزرو شده‌ای وجود داشته باشد، اولین مورد را می‌گیریم
        if (user.studentSlots && user.studentSlots.length > 0) {
            bookedSlot.value = user.studentSlots[0];
        }
    } catch (error) {
        console.error("خطا در بارگذاری پروفایل");
    }
};

onMounted(fetchUserProfile);

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
    const token = localStorage.getItem('token');
    try {
        await axios.post('http://localhost:3000/api/payments/upload-receipt', formData, {
            headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` }
        });
        uploadMessage.value = "فیش با موفقیت ارسال شد.";
        selectedFile.value = null;
    } catch (error) {
        isUploadError.value = true;
        uploadMessage.value = "خطا در آپلود فیش.";
    } finally {
        isUploading.value = false;
    }
};

const handleLogout = () => {
    localStorage.clear();
    router.push('/');
};
</script>