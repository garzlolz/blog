import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TheSidebar from '../shared/components/TheSidebar.js';
import BasePagination from '../shared/components/BasePagination.js';
import PostHeroBanner from '../features/posts/components/PostHeroBanner.js';
import PostListItem from '../features/posts/components/PostListItem.js';
import { usePosts } from '../features/posts/composables/usePosts.js';
import { useAuth } from '../features/auth/composables/useAuth.js';

const POSTS_PER_PAGE = 5;

export default {
  name: 'PostListView',
  components: {
    TheSidebar,
    BasePagination,
    PostHeroBanner,
    PostListItem
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const {
      posts,
      featuredPost,
      isLoading,
      loadPosts,
      removePost
    } = usePosts();

    const { isAdmin } = useAuth();
    const searchQuery = ref('');
    const currentPage = ref(Number(route.query.page) > 0 ? Number(route.query.page) : 1);
    const listHeadingRef = ref(null);

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

    const totalPages = computed(() => {
      return Math.max(1, Math.ceil(filteredPosts.value.length / POSTS_PER_PAGE));
    });

    const paginatedPosts = computed(() => {
      const safePage = Math.min(Math.max(1, currentPage.value), totalPages.value);
      const startIndex = (safePage - 1) * POSTS_PER_PAGE;
      return filteredPosts.value.slice(startIndex, startIndex + POSTS_PER_PAGE);
    });

    watch(searchQuery, () => {
      currentPage.value = 1;
      router.replace({ query: { ...route.query, page: undefined } });
    });

    watch(
      () => route.query.page,
      (newPage) => {
        const parsed = Number(newPage);
        currentPage.value = parsed > 0 ? parsed : 1;
      }
    );

    function handlePageChange(page) {
      currentPage.value = page;
      router.push({
        path: '/posts',
        query: page > 1 ? { page: String(page) } : {}
      });
      if (listHeadingRef.value) {
        listHeadingRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    async function handleDeletePost(postId) {
      try {
        await removePost(postId);
        if (currentPage.value > totalPages.value) {
          handlePageChange(totalPages.value);
        }
      } catch (error) {
        alert(error.message);
      }
    }

    return {
      posts,
      featuredPost,
      filteredPosts,
      paginatedPosts,
      searchQuery,
      currentPage,
      totalPages,
      listHeadingRef,
      isLoading,
      isAdmin,
      handlePageChange,
      handleDeletePost
    };
  },
  template: /* html */ `
    <main class="container">
      <PostHeroBanner :post="featuredPost" />

      <div class="row">
        <div class="col-md-8">
          <div
            ref="listHeadingRef"
            class="d-flex justify-content-between align-items-center flex-wrap gap-2 pb-3 mb-4 cyber-border-bottom"
          >
            <h3 class="mb-0">
              最新文章 ({{ filteredPosts.length }})
              <small v-if="totalPages > 1" class="text-white-50 fs-6 ms-2">
                第 {{ currentPage }} / {{ totalPages }} 頁
              </small>
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
              v-for="post in paginatedPosts"
              :key="post.id"
              :post="post"
              :is-admin="isAdmin"
              @delete="handleDeletePost"
            />

            <BasePagination
              :current-page="currentPage"
              :total-pages="totalPages"
              @change="handlePageChange"
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
