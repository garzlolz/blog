import { createApp } from 'vue';
import App from './App.js';
import { router } from './router/index.js';

// Firebase 預設僅授權 localhost，若開發工具以 127.0.0.1 開啟則自動導向 localhost
if (window.location.hostname === '127.0.0.1') {
  const targetUrl = window.location.href.replace('://127.0.0.1', '://localhost');
  window.location.replace(targetUrl);
}

const app = createApp(App);
app.use(router);
app.mount('#app');
