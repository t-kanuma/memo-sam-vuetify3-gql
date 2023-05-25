import { createRouter, createWebHistory } from "vue-router";

import Content from "@/views/template/Content.vue";
import MemoList from "@/views/MemoList.vue";
import ArchivedList from "@/views/ArchivedList.vue";
import Login from "@/views/Login.vue";
import ErrorDestination from "@/views/ErrorDestination.vue";
import { isLoggedIn } from "@/modules/auth.js";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: Content,
      meta: { requiresAuth: true },
      redirect: () => {
        return { name: "MemoList" };
      },
      children: [
        {
          path: "/memos",
          name: "MemoList",
          component: MemoList,
        },
        {
          path: "/archives",
          name: "ArchivedList",
          component: ArchivedList,
        },
      ],
    },
    {
      beforeEnter: async (to, from, next) => {
        // ログイン済みの場合はメモ一覧画面に遷移する
        if (await isLoggedIn()) {
          next({
            path: "/memos",
          });
        } else {
          next();
        }
      },
      path: "/login",
      name: "Login",
      component: Login,
    },
    {
      path: "/error",
      name: "ErrorDestination",
      component: ErrorDestination,
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (await isLoggedIn()) {
      next();
    } else {
      next({
        path: "/login",
      });
    }
  } else {
    next();
  }
});

export default router;
