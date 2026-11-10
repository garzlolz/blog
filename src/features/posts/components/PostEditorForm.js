import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import BaseCard from '../../../shared/components/BaseCard.js';
import BaseButton from '../../../shared/components/BaseButton.js';
import { renderPostContent } from '../../../shared/utils/markdownRenderer.js';
import { generatePostSlug } from '../../../shared/utils/contentFormatter.js';
import { compressImageToDataUrl } from '../../../shared/utils/imageCompressor.js';

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
    const inlineImages = ref({});
    const editorTextarea = ref(null);
    let easyMdeInstance = null;

    function initEasyMde() {
      if (!editorTextarea.value || !window.EasyMDE || easyMdeInstance) {
        return;
      }

      easyMdeInstance = new window.EasyMDE({
        element: editorTextarea.value,
        initialValue: content.value,
        autoDownloadFontAwesome: false,
        spellChecker: false,
        nativeSpellcheck: false,
        minHeight: '380px',
        placeholder: '支援 Markdown 語法，可直接 Ctrl+V 貼上截圖、拖曳圖片或點擊工具列圖片圖示上傳...',
        uploadImage: true,
        imageAccept: 'image/png, image/jpeg, image/gif, image/webp',
        imageUploadFunction: async (file, onSuccess, onError) => {
          try {
            const compressedDataUrl = await compressImageToDataUrl(file);
            const imgId = `img-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
            inlineImages.value = {
              ...inlineImages.value,
              [imgId]: compressedDataUrl
            };
            onSuccess(`blog-img://${imgId}`);
          } catch (error) {
            onError(error.message || '圖片處理失敗');
          }
        },
        previewRender: (plainText) => {
          return renderPostContent(plainText, format.value, title.value, inlineImages.value);
        },
        toolbar: [
          'bold',
          'italic',
          'heading',
          '|',
          'quote',
          'code',
          'unordered-list',
          'ordered-list',
          '|',
          'link',
          'upload-image',
          'table',
          '|',
          'preview',
          'side-by-side',
          'fullscreen',
          '|',
          'guide'
        ],
        status: ['lines', 'words']
      });

      easyMdeInstance.codemirror.on('change', () => {
        content.value = easyMdeInstance.value();
      });
    }

    onMounted(() => {
      nextTick(() => {
        initEasyMde();
      });
    });

    onBeforeUnmount(() => {
      if (easyMdeInstance) {
        easyMdeInstance.toTextArea();
        easyMdeInstance = null;
      }
    });

    watch(
      () => props.initialPost,
      (post) => {
        if (post) {
          title.value = post.title || '';
          isoDate.value = post.isoDate || new Date().toISOString().slice(0, 10);
          customSlug.value = post.id || '';
          format.value = post.format || 'markdown';
          content.value = post.content || '';
          inlineImages.value = post.inlineImages ? { ...post.inlineImages } : {};

          if (easyMdeInstance && easyMdeInstance.value() !== content.value) {
            easyMdeInstance.value(content.value);
          }
        }
      },
      { immediate: true }
    );

    const suggestedSlug = computed(() => {
      if (customSlug.value.trim()) return customSlug.value.trim();
      return generatePostSlug(title.value || 'untitled', isoDate.value);
    });

    function handleSubmit() {
      const currentContent = easyMdeInstance ? easyMdeInstance.value() : content.value;
      if (!String(currentContent).trim()) {
        alert('請輸入文章內容');
        return;
      }

      // 僅保留文章內實際有使用到的圖片，避免儲存多餘資料
      const usedImages = {};
      for (const [imgId, dataUrl] of Object.entries(inlineImages.value)) {
        if (currentContent.includes(imgId)) {
          usedImages[imgId] = dataUrl;
        }
      }

      emit('submit', {
        id: props.isEditMode ? props.initialPost?.id : suggestedSlug.value,
        title: title.value,
        isoDate: isoDate.value,
        format: format.value,
        content: currentContent,
        inlineImages: usedImages,
        existingCreatedAt: props.initialPost?.createdAt
      });
    }

    return {
      title,
      isoDate,
      customSlug,
      format,
      content,
      editorTextarea,
      suggestedSlug,
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
          <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
            <label class="form-label fw-bold mb-0">文章內容 *</label>
            <small class="text-white-50">
              💡 提示：可直接 <kbd>Ctrl+V</kbd> 貼上剪貼簿截圖、拖放圖片至編輯器，或點擊工具列圖片圖示上傳
            </small>
          </div>

          <textarea ref="editorTextarea" class="cyber-textarea"></textarea>
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
