import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/poledni-menu',
    name: 'Daily',
    component: () => import(/* webpackChunkName: "Daily" */ '../views/Daily.vue')
  },
  {
    path: '/napojovy-lister',
    name: 'Drinks',
    component: () => import(/* webpackChunkName: "Drinks" */ '../views/Drinks.vue')
  },
  {
    path: '/pronajem',
    name: 'Rent',
    component: () => import(/* webpackChunkName: "Rent" */ '../views/Rent.vue')
  },
  {
    path: '/kontakt',
    name: 'Contact',
    component: () => import(/* webpackChunkName: "Contact" */ '../views/Contact.vue')
  },
  {
    path: '/uprav-menu',
    name: 'UpravMenu',
    component: () => import(/* webpackChunkName: "EditMenu" */ '../views/EditMenu.vue')
  },
  { 
    path: '/:pathMatch(.*)*', 
    component: Home 
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
