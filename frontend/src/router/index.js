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

// نگهبان روتر
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (to.meta.requiresAuth && !token) {
    next("/"); // اگر دسترسی نداشت، برگردد به صفحه اصلی (لاگین)
  } else {
    next();
  }
});

export default router;
