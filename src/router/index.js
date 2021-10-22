import Vue from 'vue';
import VueRouter from 'vue-router';
import Converter from '../views/Converter.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/converter',
  },
  {
    path: '/converter',
    name: 'Converter',
    component: Converter,
  },
  {
    path: '/portfolio',
    name: 'Portfolio',
    component: () => import('../views/Portfolio.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
