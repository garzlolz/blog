import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { getFirebaseClient } from '../../../shared/api/firebaseClient.js';

/**
 * 訂閱 Firebase 登入狀態變更
 */
export function subscribeToAuthChanges(callback) {
  const client = getFirebaseClient();
  if (!client) {
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(client.auth, (user) => {
    callback(user);
  });
}

/**
 * 使用 Google 帳號彈窗登入
 */
export async function signInWithGoogle() {
  const client = getFirebaseClient();
  if (!client) {
    throw new Error('尚未設定 Firebase 金鑰，請先於 src/config/firebase.config.js 填入您的 Firebase 專案設定。');
  }

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  try {
    const result = await signInWithPopup(client.auth, provider);
    return result.user;
  } catch (error) {
    if (error?.code === 'auth/unauthorized-domain') {
      const host = window.location.hostname || window.location.origin;
      throw new Error(
        `目前網域「${host}」尚未加入 Firebase 授權網域。\n請至 Firebase Console -> Authentication -> 設定 -> 授權網域，新增「${host}」與「garzlolz.github.io」。`
      );
    }
    throw error;
  }
}

/**
 * 登出目前使用者
 */
export async function signOutUser() {
  const client = getFirebaseClient();
  if (!client) {
    return;
  }
  await firebaseSignOut(client.auth);
}
