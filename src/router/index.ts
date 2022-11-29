import { createRouter, createWebHistory } from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Index',
      component: () => import('@/views/Layout.vue'),
      children: [
        {
          path: '',
          name: 'Home',
          component: () => import('@/views/Home/index.vue'),
          meta: {
            title: '首页',
            expand: false,
          }
        },
        {
          path: 'user',
          name: 'User',
          component: () => import('@/views/User/index.vue'),
          meta: {
            title: '用户信息',
            expand: false,
          }
        },
        {
          path: 'booklist',
          redirect: '/booklist/1'
        },
        {
          path: 'booklist/:page',
          name: 'BookList',
          component: () => import('@/views/BookList/index.vue'),
          meta: {
            title: '我的书单',
            expand: true,
          }
        },
        {
          path: 'booklist/search/:keyword',
          name: 'BookListSearch',
          component: () => import('@/views/BookList/index.vue'),
          meta: {
            title: '我的书单',
            expand: true,
          }
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login/index.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/Register/index.vue'),
      meta: {
        requiresAuth: false
      }
    }
  ]
});

export default router;