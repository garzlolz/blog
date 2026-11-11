import { computed } from 'vue';

const MAX_VISIBLE_PAGE_BUTTONS = 5;

export default {
  name: 'BasePagination',
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    }
  },
  emits: ['change'],
  setup(props, { emit }) {
    const visiblePages = computed(() => {
      const total = props.totalPages;
      const current = props.currentPage;

      if (total <= MAX_VISIBLE_PAGE_BUTTONS) {
        return Array.from({ length: total }, (_, i) => i + 1);
      }

      const half = Math.floor(MAX_VISIBLE_PAGE_BUTTONS / 2);
      let start = Math.max(1, current - half);
      let end = start + MAX_VISIBLE_PAGE_BUTTONS - 1;

      if (end > total) {
        end = total;
        start = Math.max(1, end - MAX_VISIBLE_PAGE_BUTTONS + 1);
      }

      const pages = [];
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    });

    function goToPage(page) {
      if (page < 1 || page > props.totalPages || page === props.currentPage) {
        return;
      }
      emit('change', page);
    }

    return {
      visiblePages,
      goToPage
    };
  },
  template: /* html */ `
    <nav v-if="totalPages > 1" aria-label="文章分頁導覽" class="cyber-pagination my-4">
      <button
        type="button"
        class="cyber-page-btn"
        :disabled="currentPage <= 1"
        @click="goToPage(currentPage - 1)"
      >
        ← 上一頁
      </button>

      <div class="d-flex flex-wrap gap-2 justify-content-center">
        <button
          v-for="page in visiblePages"
          :key="page"
          type="button"
          :class="['cyber-page-btn page-num', { active: page === currentPage }]"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </div>

      <button
        type="button"
        class="cyber-page-btn"
        :disabled="currentPage >= totalPages"
        @click="goToPage(currentPage + 1)"
      >
        下一頁 →
      </button>
    </nav>
  `
};
