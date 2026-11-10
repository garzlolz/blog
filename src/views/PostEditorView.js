import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BaseCard from '../shared/components/BaseCard.js';
import BaseButton from '../shared/components/BaseButton.js';
import PostEditorForm from '../features/posts/components/PostEditorForm.js';
import { usePosts } from '../features/posts/composables/usePosts.js';
import { useAuth } from '../features/auth/composables/useAuth.js';
import { ADMIN_EMAIL } from '../config/firebase.config.js';

export default {
  name: 'PostEditorView',
  components: {
    BaseCard,
    BaseButton,
    PostEditorForm
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { loadSinglePost, savePost } = usePosts();
    const { isAdmin, loginWithGoogle } = useAuth();

    const isEditMode = computed(() => Boolean(route.params.id));
    const initialPost = ref(null);
    const isSaving = ref(false);

    onMounted(async () => {
      if (isEditMode.value) {
        initialPost.value = await loadSinglePost(route.params.id);
      }
    });

    async function handleSavePost(formPayload) {
      isSaving.value = true;
      try {
        const saved = await savePost(formPayload);
        router.push(`/posts/${encodeURIComponent(saved.id)}`);
      } catch (error) {
        alert(`儲存失敗：${error.message}`);
      } finally {
        isSaving.value = false;
      }
    }

    function handleCancel() {
      if (isEditMode.value && route.params.id) {
        router.push(`/posts/${encodeURIComponent(route.params.id)}`);
      } else {
        router.push('/posts');
      }
    }

    return {
      isAdmin,
      adminEmail: ADMIN_EMAIL,
      isEditMode,
      initialPost,
      isSaving,
      loginWithGoogle,
      handleSavePost,
      handleCancel
    };
  },
  template: /* html */ `
    <main class="container">
      <div class="mb-3">
        <router-link to="/posts" class="cyber-link">
          ← 返回文章列表
        </router-link>
      </div>

      <BaseCard v-if="!isAdmin" class="text-center py-5">
        <h3 class="cyber-title">🔒 需要管理員權限</h3>
        <p class="text-white-50 mb-4">
          僅限管理員 Google 帳號（<em class="cyber-highlight">{{ adminEmail }}</em>）可新增或編輯文章。
        </p>
        <div class="d-flex justify-content-center gap-3">
          <BaseButton @click="loginWithGoogle">
            使用 Google 帳號登入
          </BaseButton>
          <router-link to="/posts" class="cyber-action-btn btn-outline">
            返回列表
          </router-link>
        </div>
      </BaseCard>

      <template v-else>
        <h2 class="pb-3 mb-4 cyber-border-bottom">
          {{ isEditMode ? '✏️ 編輯文章' : '✨ 新增文章' }}
        </h2>

        <PostEditorForm
          :initial-post="initialPost"
          :is-edit-mode="isEditMode"
          :is-saving="isSaving"
          @submit="handleSavePost"
          @cancel="handleCancel"
        />
      </template>
    </main>
  `
};
