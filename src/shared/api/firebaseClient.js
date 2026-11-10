import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFirebaseConfig, isFirebaseConfigured } from '../../config/firebase.config.js';

let firebaseInstances = null;

/**
 * 取得 Firebase 單例實例（App / Auth / Firestore）
 * 若尚未設定有效金鑰則回傳 null，讓上層服務自動切換為本地種子資料模式。
 */
export function getFirebaseClient() {
  if (!isFirebaseConfigured()) {
    return null;
  }

  if (firebaseInstances) {
    return firebaseInstances;
  }

  try {
    const config = getFirebaseConfig();
    const app = getApps().length > 0 ? getApp() : initializeApp(config);
    const auth = getAuth(app);
    const db = getFirestore(app);

    firebaseInstances = { app, auth, db };
    return firebaseInstances;
  } catch (error) {
    console.error('[FirebaseClient] 初始化失敗:', error);
    return null;
  }
}
