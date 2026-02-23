import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue"; // این حالا صفحه لاگین است
import RegisterView from "../views/RegisterView.vue"; // صفحه جدید ثبت‌نام
import ReservationView from "../views/ReservationView.vue";
import DashboardView from "../views/DashboardView.vue";
import AdminView from "../views/AdminView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", name: "login", component: HomeView }, // صفحه اصلی = لاگین
    { path: "/register", name: "register", component: RegisterView }, // ثبت‌نام
    {
      path: "/dashboard",
      name: "dashboard",
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: "/reserve",
      name: "reserve",
      component: ReservationView,
      meta: { requiresAuth: true },
    },
    {
      path: "/admin",
      name: "admin",
      component: AdminView,
      meta: { requiresAuth: true },
    },
  ],
});

// نگهبان هوشمند روتر
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRole'); // نقشی که موقع لاگین ذخیره کردیم
  
  // ۱. اگر صفحه قفل بود و کاربر توکن نداشت، بفرستش به صفحه لاگین
  if (to.meta.requiresAuth && !token) {
    return next('/'); 
  }

  // ۲. اگر زبان‌آموز خواست برود پنل ادمین، پرتش کن به داشبورد خودش!
  if (to.path === '/admin' && role === 'STUDENT') {
    alert('شما به این بخش دسترسی ندارید.');
    return next('/dashboard');
  }

  // ۳. اگر استاد خواست برود پنل زبان‌آموز، پرتش کن به پنل مدیریت!
  if ((to.path === '/dashboard' || to.path === '/reserve') && (role === 'TEACHER' || role === 'ADMIN')) {
    return next('/admin');
  }

  // در غیر این صورت اجازه عبور بده
  next(); 
})


export default router;
