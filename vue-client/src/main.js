import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import './assets/main.css';

import { VueQueryPlugin } from 'vue-query';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.use(VueQueryPlugin);

app.mount('#app');

console.groupCollapsed(
	'%cApplication is in %s mode ✔',
	"display: inline-block; margin: auto; background: blue; color: white; font-weight: bold;", import.meta.env.MODE
);
	console.log('BASE_URL: %s', import.meta.env.BASE_URL);
	console.log('PORT %s', import.meta.env.VITE_PORT);
console.groupEnd();
