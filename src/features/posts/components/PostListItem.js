import { computed } from 'vue';
import BaseCard from '../../../shared/components/BaseCard.js';
import BaseButton from '../../../shared/components/BaseButton.js';
import { extractPlainTextExcerpt } from '../../../shared/utils/contentFormatter.js';

export default {
  name: 'PostListItem',
  components: {
    BaseCard,
    BaseButton
  },
  props: {
    post: {
      type: Object,
      required: true
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  emits: ['delete'],
  setup(props, { emit }) {
    const postUrl = computed(() => `/posts/${encodeURIComponent(props.post.id)}`);
    const excerpt = computed(() => extractPlainTextExcerpt(props.post.content, 180));

    function handleDelete() {
      if (confirm(`確定要刪除文章「${props.post.title}」嗎？此操作無法復原。`)) {
        emit('delete', props.post.id);
      }
    }

    return {
      postUrl,
      excerpt,
      handleDelete
    };
  },
  template: /* html */ `
    <BaseCard :hoverable="true" class="blog-post">
      <router-link :to="postUrl" class="blog-post-title d-block">
        {{ post.title }}
      </router-link>

      <div class="blog-post-meta">
        <span>📅 {{ post.date }}</span>
        <span>✍️ {{ post.author || '施宏勳' }}</span>
      </div>

      <p class="post-excerpt">
        {{ excerpt }}
      </p>

      <div class="post-card-actions">
        <router-link :to="postUrl" class="cyber-action-btn">
          閱讀全文 →
        </router-link>

        <div v-if="isAdmin" class="d-flex align-items-center gap-2 ms-auto">
          <router-link
            :to="postUrl + '/edit'"
            class="cyber-action-btn btn-outline"
          >
            編輯
          </router-link>
          <BaseButton variant="danger" @click="handleDelete">
            刪除
          </BaseButton>
        </div>
      </div>
    </BaseCard>
  `
};
