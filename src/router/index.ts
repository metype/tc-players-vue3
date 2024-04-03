import Vue from 'vue';
import {createRouter, createWebHistory} from 'vue-router';

import NotFound from '@/views/NotFound.vue';
import MainView from '@/components/MainView.vue';
import PlayerSearch from '@/components/PlayerSearch.vue';
import PlayerProfile from '@/components/PlayerProfile.vue';

//
// import MainView from '@/components/MainView.vue';
// import PlayerProfile from '@/components/PlayerProfile.vue';
// import PlayerSearch from '@/components/PlayerSearch.vue';

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: 'main',
    },
    {
      path: '/main',
      name: 'main',
      component: MainView,
    },
    {
      path: '/player',
      component: PlayerProfile,
    },
    {
      path: '/player/:name',
      name: 'player',
      component: PlayerProfile,
      props: true,
    },
    {
      path: '/search',
      component: PlayerSearch,
    },
    {
      path: '/search/:name',
      component: PlayerSearch,
      props: true,
    },
    {
      path: '/search/:name/:page',
      name: 'search',
      component: PlayerSearch,
      props: true,
    },
    {
      path: '/:pathMatch(.*)*',
      component: NotFound,
    },
  ],
});
