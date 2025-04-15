import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/poledni-menu",
    name: "Daily",
    component: () =>
      import(/* webpackChunkName: "Daily" */ "../views/Daily.vue"),
  },
  {
    path: "/napojovy-listek",
    name: "Drinks",
    component: () =>
      import(/* webpackChunkName: "Drinks" */ "../views/Drinks.vue"),
  },
  {
    path: "/kontakt",
    name: "Contact",
    component: () =>
      import(/* webpackChunkName: "Contact" */ "../views/Contact.vue"),
  },
  {
    path: "/update-jidelak",
    name: "UpdateTool",
    component: () =>
      import(/* webpackChunkName: "UpdateTool" */ "../views/UpdateTool.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    component: Home,
  },
];

const router = createRouter({
  history: createWebHistory('/'),
  routes,
});

export default router;
