/**
 * Firebase 專案設定與管理員權限設定
 * 請至 Firebase Console (https://console.firebase.google.com/) 複製您的 Web App 設定並填入下方。
 * 亦可於瀏覽器開發者工具執行 localStorage.setItem('BLOG_FIREBASE_CONFIG', JSON.stringify({...})) 動態覆寫。
 */

export const ADMIN_EMAIL = 'oscar861213@gmail.com';

export const AUTHOR_PROFILE = {
  name: '施宏勳',
  englishName: 'Finn Shih',
  title: 'C#、.NET 後端工程師',
  email: 'oscar861213@gmail.com',
  avatarUrl: './src/assets/images/profile.jpeg',
  socialLinks: [
    { label: 'GitHub', url: 'https://github.com/garzlolz' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/finn-shih' }
  ]
};

const DEFAULT_FIREBASE_CONFIG = {
  apiKey: 'AIzaSyAzOAtlq0xiFVzASCUBEoigy7703ZI1vPY',
  authDomain: 'finn-blog.firebaseapp.com',
  projectId: 'finn-blog',
  storageBucket: 'finn-blog.firebasestorage.app',
  messagingSenderId: '902897290288',
  appId: '1:902897290288:web:0816992aab76afefa3b1f5',
  measurementId: 'G-038C2NGSH2'
};

export function getFirebaseConfig() {
  try {
    const savedConfig = localStorage.getItem('BLOG_FIREBASE_CONFIG');
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      if (parsed && parsed.apiKey && parsed.projectId) {
        return parsed;
      }
    }
  } catch {
    // 忽略 localStorage 解析錯誤，回退至預設設定
  }
  return DEFAULT_FIREBASE_CONFIG;
}

export function saveFirebaseConfigToLocal(configObject) {
  localStorage.setItem('BLOG_FIREBASE_CONFIG', JSON.stringify(configObject));
}

export function isFirebaseConfigured() {
  const config = getFirebaseConfig();
  return Boolean(
    config &&
    config.apiKey &&
    !config.apiKey.startsWith('YOUR_') &&
    config.projectId &&
    !config.projectId.startsWith('YOUR_')
  );
}
