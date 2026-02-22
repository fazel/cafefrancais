import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ReservationView from "../views/ReservationView.vue";
import DashboardView from "../views/DashboardView.vue";
import AdminView from "../views/AdminView.vue";
import LoginView from "../views/LoginView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", name: "home", component: HomeView },
    { path: "/login", name: "login", component: LoginView }, // ۲. آدرس ورود
    { path: "/dashboard", name: "dashboard", component: DashboardView },
    { path: "/reserve", name: "reserve", component: ReservationView },
    {
      path: "/admin",
      name: "admin",
      component: AdminView,
      meta: { requiresAuth: true }, // ۳. این مسیر حالا یک برچسب قفل دارد
    },
  ],
});

// ۴. نگهبان روتر: قبل از ورود به هر صفحه چک می‌کند
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  // اگر صفحه قفل بود و کاربر توکن نداشت، بفرستش صفحه لاگین
  if (to.meta.requiresAuth && !token) {
    next("/login");
  } else {
    next(); // در غیر این صورت اجازه عبور بده
  }
});

export default router;
