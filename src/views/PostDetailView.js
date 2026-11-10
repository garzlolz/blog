import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BaseCard from '../shared/components/BaseCard.js';
import BaseButton from '../shared/components/BaseButton.js';
import TheSidebar from '../shared/components/TheSidebar.js';
import { renderPostContent } from '../shared/utils/markdownRenderer.js';
import { usePosts } from '../features/posts/composables/usePosts.js';
import { useAuth } from '../features/auth/composables/useAuth.js';

export default {
  name: 'PostDetailView',
  components: {
    BaseCard,
    BaseButton,
    TheSidebar
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { posts, isLoading, loadPosts, loadSinglePost, removePost } = usePosts();
    const { isAdmin } = useAuth();

    const currentPost = ref(null);
    const copiedLink = ref(false);

    async function fetchDetail(postId) {
      if (!postId) return;
      if (posts.value.length === 0) {
        await loadPosts();
      }
      currentPost.value = await loadSinglePost(postId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    onMounted(() => {
      fetchDetail(route.params.id);
    });

    watch(
      () => route.params.id,
      (newId) => {
        fetchDetail(newId);
      }
    );

    const renderedHtml = computed(() => {
      if (!currentPost.value) return '';
      return renderPostContent(
        currentPost.value.content,
        currentPost.value.format || 'markdown',
        currentPost.value.title,
        currentPost.value.inlineImages || {}
      );
    });

    const currentIndex = computed(() => {
      if (!currentPost.value) return -1;
      return posts.value.findIndex((item) => item.id === currentPost.value.id);
    });

    const previousPost = computed(() => {
      if (currentIndex.value <= 0) return null;
      return posts.value[currentIndex.value - 1];
    });

    const nextPost = computed(() => {
      if (currentIndex.value < 0 || currentIndex.value >= posts.value.length - 1) return null;
      return posts.value[currentIndex.value + 1];
    });

    function copyPostUrl() {
      navigator.clipboard.writeText(window.location.href).then(() => {
        copiedLink.value = true;
        setTimeout(() => {
          copiedLink.value = false;
        }, 2000);
      });
    }

    async function handleDelete() {
      if (!currentPost.value) return;
      if (!confirm(`確定要刪除文章「${currentPost.value.title}」嗎？`)) {
        return;
      }
      try {
        await removePost(currentPost.value.id);
        router.push('/posts');
      } catch (error) {
        alert(error.message);
      }
    }

    return {
      posts,
      currentPost,
      isLoading,
      isAdmin,
      renderedHtml,
      previousPost,
      nextPost,
      copiedLink,
      copyPostUrl,
      handleDelete
    };
  },
  template: /* html */ `
    <main class="container">
      <div class="row">
        <div class="col-md-8">
          <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
            <router-link to="/posts" class="cyber-link">
              ← 返回文章列表
            </router-link>

            <div class="d-flex align-items-center gap-2">
              <BaseButton variant="outline" @click="copyPostUrl">
                {{ copiedLink ? '✓ 已複製文章網址' : '🔗 分享獨立網址' }}
              </BaseButton>

              <template v-if="isAdmin && currentPost">
                <router-link
                  :to="'/posts/' + encodeURIComponent(currentPost.id) + '/edit'"
                  class="cyber-action-btn btn-outline"
                >
                  編輯文章
                </router-link>
                <BaseButton variant="danger" @click="handleDelete">
                  刪除
                </BaseButton>
              </template>
            </div>
          </div>

          <BaseCard v-if="isLoading && !currentPost" class="text-center py-5">
            載入文章內容中...
          </BaseCard>

          <BaseCard v-else-if="!currentPost" class="text-center py-5">
            <h3 class="cyber-title">找不到該篇文章</h3>
            <p class="text-white-50 mb-4">該文章可能已被刪除或網址不正確。</p>
            <router-link to="/posts" class="cyber-action-btn">
              返回所有文章
            </router-link>
          </BaseCard>

          <template v-else>
            <BaseCard>
              <article class="blog-post mb-0">
                <h1 class="blog-post-title mb-2" style="cursor: default;">
                  {{ currentPost.title }}
                </h1>
                <div class="blog-post-meta pb-3 cyber-border-bottom">
                  <span>📅 {{ currentPost.date }}</span>
                  <span>✍️ {{ currentPost.author || '施宏勳' }}</span>
                </div>

                <div
                  class="blog-post-content mt-4"
                  v-html="renderedHtml"
                ></div>
              </article>
            </BaseCard>

            <div class="row g-3 mb-4">
              <div class="col-sm-6">
                <router-link
                  v-if="previousPost"
                  :to="'/posts/' + encodeURIComponent(previousPost.id)"
                  class="post-nav-card"
                >
                  <small class="text-white-50 d-block mb-1">← 較新一篇</small>
                  <span class="cyber-link fw-bold d-block text-truncate">{{ previousPost.title }}</span>
                </router-link>
              </div>
              <div class="col-sm-6">
                <router-link
                  v-if="nextPost"
                  :to="'/posts/' + encodeURIComponent(nextPost.id)"
                  class="post-nav-card text-sm-end"
                >
                  <small class="text-white-50 d-block mb-1">較舊一篇 →</small>
                  <span class="cyber-link fw-bold d-block text-truncate">{{ nextPost.title }}</span>
                </router-link>
              </div>
            </div>
          </template>
        </div>

        <div class="col-md-4">
          <TheSidebar :recent-posts="posts" />
        </div>
      </div>
    </main>
  `
};
