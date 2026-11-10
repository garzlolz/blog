import { ref, computed, watch } from 'vue';
import BaseCard from '../../../shared/components/BaseCard.js';
import BaseButton from '../../../shared/components/BaseButton.js';
import { renderPostContent } from '../../../shared/utils/markdownRenderer.js';
import { generatePostSlug } from '../../../shared/utils/contentFormatter.js';

export default {
  name: 'PostEditorForm',
  components: {
    BaseCard,
    BaseButton
  },
  props: {
    initialPost: {
      type: Object,
      default: null
    },
    isEditMode: {
      type: Boolean,
      default: false
    },
    isSaving: {
      type: Boolean,
      default: false
    }
  },
  emits: ['submit', 'cancel'],
  setup(props, { emit }) {
    const title = ref('');
    const isoDate = ref(new Date().toISOString().slice(0, 10));
    const customSlug = ref('');
    const format = ref('markdown');
    const content = ref('');
    const activeTab = ref('write'); // 'write' | 'preview'

    watch(
      () => props.initialPost,
      (post) => {
        if (post) {
          title.value = post.title || '';
          isoDate.value = post.isoDate || new Date().toISOString().slice(0, 10);
          customSlug.value = post.id || '';
          format.value = post.format || 'markdown';
          content.value = post.content || '';
        }
      },
      { immediate: true }
    );

    const suggestedSlug = computed(() => {
      if (customSlug.value.trim()) return customSlug.value.trim();
      return generatePostSlug(title.value || 'untitled', isoDate.value);
    });

    const renderedPreview = computed(() => {
      return renderPostContent(content.value, format.value);
    });

    function handleSubmit() {
      emit('submit', {
        id: props.isEditMode ? props.initialPost?.id : suggestedSlug.value,
        title: title.value,
        isoDate: isoDate.value,
        format: format.value,
        content: content.value,
        existingCreatedAt: props.initialPost?.createdAt
      });
    }

    return {
      title,
      isoDate,
      customSlug,
      format,
      content,
      activeTab,
      suggestedSlug,
      renderedPreview,
      handleSubmit
    };
  },
  template: /* html */ `
    <BaseCard>
      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label class="form-label fw-bold">文章標題 *</label>
          <input
            v-model="title"
            type="text"
            class="cyber-input"
            placeholder="請輸入文章標題..."
            required
          />
        </div>

        <div class="row g-3 mb-3">
          <div class="col-md-4">
            <label class="form-label fw-bold">發布日期</label>
            <input
              v-model="isoDate"
              type="date"
              class="cyber-input"
              required
            />
          </div>

          <div class="col-md-4">
            <label class="form-label fw-bold">內容格式</label>
            <select v-model="format" class="cyber-input">
              <option value="markdown">Markdown (支援 HTML)</option>
              <option value="html">純 HTML 原始碼</option>
            </select>
          </div>

          <div class="col-md-4">
            <label class="form-label fw-bold">獨立網址 ID (Slug)</label>
            <input
              v-model="customSlug"
              type="text"
              class="cyber-input"
              :disabled="isEditMode"
              :placeholder="suggestedSlug"
            />
            <small class="text-white-50">網址預覽：#/posts/{{ isEditMode ? initialPost?.id : suggestedSlug }}</small>
          </div>
        </div>

        <div class="mb-3">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <label class="form-label fw-bold mb-0">文章內容 *</label>
            <div class="d-flex gap-2">
              <BaseButton
                :variant="activeTab === 'write' ? 'primary' : 'outline'"
                @click="activeTab = 'write'"
              >
                編輯原始碼
              </BaseButton>
              <BaseButton
                :variant="activeTab === 'preview' ? 'primary' : 'outline'"
                @click="activeTab = 'preview'"
              >
                即時預覽
              </BaseButton>
            </div>
          </div>

          <textarea
            v-if="activeTab === 'write'"
            v-model="content"
            class="cyber-textarea"
            placeholder="支援 Markdown 語法（如 # 標題、**粗體**、程式碼區塊）或 HTML..."
            required
          ></textarea>

          <div
            v-else
            class="cyber-card blog-post-content"
            style="min-height: 360px;"
            v-html="renderedPreview || '<p class=text-white-50>尚無內容可供預覽</p>'"
          ></div>
        </div>

        <div class="d-flex justify-content-end gap-2 mt-4">
          <BaseButton variant="outline" @click="$emit('cancel')">
            取消返回
          </BaseButton>
          <BaseButton type="submit" :disabled="isSaving">
            {{ isSaving ? '儲存至 Firebase 中...' : (isEditMode ? '儲存修改' : '發布文章') }}
          </BaseButton>
        </div>
      </form>
    </BaseCard>
  `
};
