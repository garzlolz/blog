import BaseButton from '../../../shared/components/BaseButton.js';
import { useAuth } from '../composables/useAuth.js';

export default {
  name: 'AuthActionButton',
  components: {
    BaseButton
  },
  setup() {
    const {
      currentUser,
      isLoggedIn,
      isAdmin,
      isAuthenticating,
      loginWithGoogle,
      logout
    } = useAuth();

    async function handleLogin() {
      try {
        await loginWithGoogle();
      } catch (error) {
        alert(error.message);
      }
    }

    async function handleLogout() {
      await logout();
    }

    return {
      currentUser,
      isLoggedIn,
      isAdmin,
      isAuthenticating,
      handleLogin,
      handleLogout
    };
  },
  template: /* html */ `
    <div class="d-flex align-items-center flex-wrap justify-content-end gap-2">
      <template v-if="isLoggedIn">
        <span v-if="isAdmin" class="cyber-badge" title="已以管理員帳號登入">
          ★ 管理員
        </span>
        <span v-else class="text-white-50 small" :title="currentUser.email">
          {{ currentUser.displayName }} (唯讀)
        </span>

        <router-link
          v-if="isAdmin"
          to="/posts/new"
          class="cyber-action-btn"
        >
          ＋ 新增文章
        </router-link>

        <BaseButton variant="outline" @click="handleLogout">
          登出
        </BaseButton>
      </template>

      <template v-else>
        <BaseButton
          variant="outline"
          :disabled="isAuthenticating"
          @click="handleLogin"
        >
          {{ isAuthenticating ? '登入中...' : 'Google 登入' }}
        </BaseButton>
      </template>
    </div>
  `
};
