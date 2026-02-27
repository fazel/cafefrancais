import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import DashboardView from "../views/DashboardView.vue";
import AdminView from "../views/AdminView.vue";
import TeacherView from "../views/TeacherView.vue";
import ReserveView from "../views/ReservationView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: LoginView,
      meta: { requiresAuth: false },
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
      meta: { requiresAuth: false },
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: DashboardView,
      // فقط زبان‌آموز
      meta: { requiresAuth: true, role: "STUDENT" },
    },
    {
      path: "/reserve", // 👈 تعریف مسیر رزرو
      name: "reserve",
      component: ReserveView,
      // فقط زبان‌آموز می‌تونه رزرو کنه
      meta: { requiresAuth: true, role: "STUDENT" },
    },
    {
      path: "/teacher",
      name: "teacher",
      component: TeacherView,
      meta: { requiresAuth: true, role: "TEACHER" },
    },
    {
      path: "/admin",
      name: "admin",
      component: AdminView,
      meta: { requiresAuth: true, role: "ADMIN" },
    },
  ],
});

// گارد هوشمند و مدرن روتر (بدون استفاده از next)
router.beforeEach((to, from) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  // ۱. اگه صفحه نیاز به لاگین داره ولی توکن نیست
  if (to.meta.requiresAuth && !token) {
    return "/"; // 👈 پرت میشه به صفحه لاگین
  }

  // ۲. اگه کاربر لاگین کرده ولی میخواد بره صفحه لاگین/ثبت‌نام
  if ((to.path === "/" || to.path === "/register") && token) {
    if (userRole === "ADMIN") return "/admin";
    if (userRole === "TEACHER") return "/teacher";
    return "/dashboard";
  }

  // ۳. اگه صفحه مخصوص یک نقش خاصه ولی نقش کاربر فرق داره
  if (to.meta.role && to.meta.role !== userRole) {
    if (userRole === "ADMIN") return "/admin";
    if (userRole === "TEACHER") return "/teacher";
    if (userRole === "STUDENT") return "/dashboard";

    // اگه نقش نامعتبر بود
    localStorage.clear();
    return "/";
  }

  // ۴. اجازه عبور در صورت درست بودن همه چیز
  return true;
});

export default router;
