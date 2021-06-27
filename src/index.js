import { createApp } from 'vue/dist/vue.esm-bundler.js';
import { createRouter, createWebHashHistory } from 'vue-router';


import Root from './components/root';
import ResourcesPage from './components/resources/page';
import ResourcePage, { route as resourceRoute } from './components/resource/page';

const routes = [
  { 
    path: '/',
    component: ResourcesPage,
    name: 'resources'
  },
  resourceRoute
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

var e = document.querySelector("#app");

e.appendChild(
  document.createElement('root')
);

const app = createApp({});

app.use(router);
app.component('root', Root);
app.mount('#app');

