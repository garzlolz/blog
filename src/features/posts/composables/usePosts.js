import { ref, computed } from 'vue';
import { AUTHOR_PROFILE } from '../../../config/firebase.config.js';
import {
  formatDisplayDate,
  generatePostSlug
} from '../../../shared/utils/contentFormatter.js';
import {
  fetchAllPosts,
  fetchPostById,
  upsertPostToFirestore,
  deletePostFromFirestore,
  seedLegacyPostsToFirestore
} from '../services/post.service.js';

const posts = ref([]);
const isLoading = ref(false);
const errorMessage = ref('');
const dataSource = ref('seed'); // 'seed' | 'firestore'
let hasLoadedInitial = false;

export function usePosts() {
  const featuredPost = computed(() => posts.value[0] || null);
  const isUsingFallbackSeed = computed(() => dataSource.value === 'seed');

  async function loadPosts(forceRefresh = false) {
    if (hasLoadedInitial && !forceRefresh && posts.value.length > 0) {
      return posts.value;
    }

    isLoading.value = true;
    errorMessage.value = '';
    try {
      const result = await fetchAllPosts();
      posts.value = result.posts;
      dataSource.value = result.source;
      hasLoadedInitial = true;
      return posts.value;
    } catch (error) {
      errorMessage.value = error?.message || '載入文章列表失敗';
      return [];
    } finally {
      isLoading.value = false;
    }
  }

  async function loadSinglePost(postId) {
    const existing = posts.value.find((item) => item.id === decodeURIComponent(postId));
    if (existing) {
      return existing;
    }
    isLoading.value = true;
    try {
      return await fetchPostById(postId);
    } finally {
      isLoading.value = false;
    }
  }

  async function savePost({ id, title, isoDate, content, format = 'markdown', existingCreatedAt }) {
    const cleanTitle = String(title).trim();
    if (!cleanTitle) {
      throw new Error('請輸入文章標題');
    }

    const effectiveIsoDate = isoDate || new Date().toISOString().slice(0, 10);
    const postId = (id && String(id).trim()) || generatePostSlug(cleanTitle, effectiveIsoDate);
    const now = Date.now();

    const payload = {
      id: postId,
      title: cleanTitle,
      isoDate: effectiveIsoDate,
      date: formatDisplayDate(effectiveIsoDate),
      content: String(content || '').trim(),
      format: format || 'markdown',
      author: AUTHOR_PROFILE.name,
      authorEmail: AUTHOR_PROFILE.email,
      createdAt: existingCreatedAt || new Date(`${effectiveIsoDate}T12:00:00+08:00`).getTime() || now,
      updatedAt: now
    };

    const saved = await upsertPostToFirestore(postId, payload);
    await loadPosts(true);
    return saved;
  }

  async function removePost(postId) {
    await deletePostFromFirestore(postId);
    posts.value = posts.value.filter((item) => item.id !== postId);
  }

  async function importSeedPosts() {
    isLoading.value = true;
    try {
      const count = await seedLegacyPostsToFirestore();
      await loadPosts(true);
      return count;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    posts,
    featuredPost,
    isLoading,
    errorMessage,
    dataSource,
    isUsingFallbackSeed,
    loadPosts,
    loadSinglePost,
    savePost,
    removePost,
    importSeedPosts
  };
}
