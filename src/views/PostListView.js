import { ref, computed, onMounted } from 'vue';
import BaseCard from '../shared/components/BaseCard.js';
import BaseButton from '../shared/components/BaseButton.js';
import TheSidebar from '../shared/components/TheSidebar.js';
import PostHeroBanner from '../features/posts/components/PostHeroBanner.js';
import PostListItem from '../features/posts/components/PostListItem.js';
import { usePosts } from '../features/posts/composables/usePosts.js';
import { useAuth } from '../features/auth/composables/useAuth.js';

export default {
  name: 'PostListView',
  components: {
    BaseCard,
    BaseButton,
    TheSidebar,
    PostHeroBanner,
    PostListItem
  },
  setup() {
    const {
      posts,
      featuredPost,
      isLoading,
      isUsingFallbackSeed,
      loadPosts,
      removePost,
      importSeedPosts
    } = usePosts();

    const { isAdmin, isConfigured } = useAuth();
    const searchQuery = ref('');
    const isSeeding = ref(false);

    onMounted(() => {
      loadPosts();
    });

    const filteredPosts = computed(() => {
      const q = searchQuery.value.trim().toLowerCase();
      if (!q) return posts.value;
      return posts.value.filter(
        (post) =>
          post.title.toLowerCase().includes(q) ||
          post.date.toLowerCase().includes(q)
      );
    });

    async function handleDeletePost(postId) {
      try {
        await removePost(postId);
      } catch (error) {
        alert(error.message);
      }
    }

    async function handleSeedToFirebase() {
      if (!confirm('確定要將 30 篇歷史文章批次寫入您的 Cloud Firestore 嗎？')) {
        return;
      }
      isSeeding.value = true;
      try {
        const count = await importSeedPosts();
        alert(`成功將 ${count} 篇歷史文章匯入 Cloud Firestore！`);
      } catch (error) {
        alert(`匯入失敗：${error.message}`);
      } finally {
        isSeeding.value = false;
      }
    }

    return {
      posts,
      featuredPost,
      filteredPosts,
      searchQuery,
      isLoading,
      isUsingFallbackSeed,
      isAdmin,
      isConfigured,
      isSeeding,
      handleDeletePost,
      handleSeedToFirebase
    };
  },
  template: /* html */ `
    <main class="container">
      <PostHeroBanner :post="featuredPost" />

      <BaseCard v-if="isAdmin && isUsingFallbackSeed" class="mb-4">
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h5 class="cyber-title mb-1">⚡ 管理員雲端同步提示</h5>
            <p class="mb-0 text-white-50 small">
              目前顯示的是本地預設的 {{ posts.length }} 篇歷史文章種子資料。您可以一鍵將所有舊文章同步寫入 Cloud Firestore。
            </p>
          </div>
          <BaseButton :disabled="isSeeding" @click="handleSeedToFirebase">
            {{ isSeeding ? '匯入中...' : '一鍵將舊文章匯入 Firestore' }}
          </BaseButton>
        </div>
      </BaseCard>

      <div class="row">
        <div class="col-md-8">
          <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 pb-3 mb-4 cyber-border-bottom">
            <h3 class="mb-0">
              最新文章 ({{ filteredPosts.length }})
            </h3>
            <div style="min-width: 240px;">
              <input
                v-model="searchQuery"
                type="search"
                class="cyber-input py-1 px-3"
                placeholder="🔍 搜尋文章標題或日期..."
              />
            </div>
          </div>

          <div v-if="isLoading && posts.length === 0" class="text-center py-5 text-white-50">
            載入文章中...
          </div>

          <div v-else-if="filteredPosts.length === 0" class="text-center py-5 text-white-50">
            找不到符合「{{ searchQuery }}」的文章。
          </div>

          <template v-else>
            <PostListItem
              v-for="post in filteredPosts"
              :key="post.id"
              :post="post"
              :is-admin="isAdmin"
              @delete="handleDeletePost"
            />
          </template>
        </div>

        <div class="col-md-4">
          <TheSidebar :recent-posts="posts" />
        </div>
      </div>
    </main>
  `
};
