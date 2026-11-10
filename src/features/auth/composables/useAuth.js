import { ref, computed } from 'vue';
import { ADMIN_EMAIL, isFirebaseConfigured } from '../../../config/firebase.config.js';
import {
  subscribeToAuthChanges,
  signInWithGoogle,
  signOutUser
} from '../services/auth.service.js';

const currentUser = ref(null);
const isAuthReady = ref(false);
const isAuthenticating = ref(false);
const authError = ref('');
let isListenerInitialized = false;

function ensureAuthListener() {
  if (isListenerInitialized) {
    return;
  }
  isListenerInitialized = true;

  subscribeToAuthChanges((user) => {
    currentUser.value = user
      ? {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || user.email || '使用者',
          photoURL: user.photoURL || ''
        }
      : null;
    isAuthReady.value = true;
  });
}

export function useAuth() {
  ensureAuthListener();

  const isLoggedIn = computed(() => Boolean(currentUser.value));

  const isAdmin = computed(() => {
    const email = currentUser.value?.email?.toLowerCase();
    return Boolean(email && email === ADMIN_EMAIL.toLowerCase());
  });

  const isConfigured = computed(() => isFirebaseConfigured());

  async function loginWithGoogle() {
    authError.value = '';
    isAuthenticating.value = true;
    try {
      await signInWithGoogle();
    } catch (error) {
      authError.value = error?.message || 'Google 登入失敗，請稍後再試。';
      throw error;
    } finally {
      isAuthenticating.value = false;
    }
  }

  async function logout() {
    authError.value = '';
    await signOutUser();
  }

  return {
    currentUser,
    isAuthReady,
    isAuthenticating,
    authError,
    isLoggedIn,
    isAdmin,
    isConfigured,
    loginWithGoogle,
    logout
  };
}
