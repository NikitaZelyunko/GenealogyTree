import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';
// oxlint-disable-next-line import/no-unassigned-import -- side-effect CSS entry (standard Vite pattern)
import './assets/css/main.css';

createApp(App).use(router).mount('#app');
