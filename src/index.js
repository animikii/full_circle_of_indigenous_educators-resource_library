// import App from './components/app';
import { createApp } from 'vue';
import VueRouter from 'vue-router';

import App from './components/app';
import ResourceList from './components/resource-list';

const routes = [
];

const router = new VueRouter({ routes });

const app = createApp(App);

app.mount('#app');


