import { computed } from 'vue';
import { extractPlainTextExcerpt } from '../../../shared/utils/contentFormatter.js';

export default {
  name: 'PostHeroBanner',
  props: {
    post: {
      type: Object,
      default: null
    }
  },
  setup(props) {
    const excerpt = computed(() => {
      if (!props.post) return '探索程式碼的未來世界';
      return extractPlainTextExcerpt(props.post.content, 110);
    });

    return {
      excerpt
    };
  },
  template: /* html */ `
    <div class="cyber-hero p-4 p-md-5 mb-4 text-white">
      <div class="col-lg-8 px-0">
        <template v-if="post">
          <span class="cyber-badge mb-2">最新精選文章</span>
          <h1 class="display-6 cyber-text mb-2">{{ post.title }}</h1>
          <p class="text-white-50 small mb-2">📅 {{ post.date }}</p>
          <p class="lead my-3 cyber-subtext">{{ excerpt }}</p>
          <router-link
            :to="'/posts/' + encodeURIComponent(post.id)"
            class="cyber-action-btn mt-2"
          >
            閱讀完整文章 →
          </router-link>
        </template>
        <template v-else>
          <h1 class="display-4 cyber-text">Welcome to the Future</h1>
          <p class="lead my-3 cyber-subtext">探索程式碼的未來世界</p>
        </template>
      </div>
    </div>
  `
};
