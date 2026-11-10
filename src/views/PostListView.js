import { ref, computed, onMounted } from 'vue';
import TheSidebar from '../shared/components/TheSidebar.js';
import PostHeroBanner from '../features/posts/components/PostHeroBanner.js';
import PostListItem from '../features/posts/components/PostListItem.js';
import { usePosts } from '../features/posts/composables/usePosts.js';
import { useAuth } from '../features/auth/composables/useAuth.js';

export default {
  name: 'PostListView',
  components: {
    TheSidebar,
    PostHeroBanner,
    PostListItem
  },
  setup() {
    const {
      posts,
      featuredPost,
      isLoading,
      loadPosts,
      removePost
    } = usePosts();

    const { isAdmin } = useAuth();
    const searchQuery = ref('');

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

    return {
      posts,
      featuredPost,
      filteredPosts,
      searchQuery,
      isLoading,
      isAdmin,
      handleDeletePost
    };
  },
  template: /* html */ `
    <main class="container">
      <PostHeroBanner :post="featuredPost" />

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
            載入雲端文章中...
          </div>

          <div v-else-if="filteredPosts.length === 0" class="text-center py-5 text-white-50">
            {{ searchQuery ? '找不到符合「' + searchQuery + '」的文章。' : '目前尚無文章。' }}
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
