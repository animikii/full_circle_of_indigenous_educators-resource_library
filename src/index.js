import { createApp } from 'vue/dist/vue.esm-bundler.js';
import { createRouter, createWebHashHistory } from 'vue-router';

import store from './store';

import Root from './components/root';
import { route as resourcesRoute } from './components/resources/page';
import { route as resourceRoute } from './components/resource/page';

const routes = [
  resourcesRoute,
  resourceRoute
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

store.setRouter(router);

var e = document.querySelector("#app");

e.appendChild(
  document.createElement('root')
);

const app = createApp({});

app.use(router);
app.component('root', Root);
app.mount('#app');

