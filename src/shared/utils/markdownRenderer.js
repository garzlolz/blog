import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { normalizeAssetPaths } from './contentFormatter.js';

marked.setOptions({
  breaks: true,
  gfm: true
});

/**
 * 將內嵌短網址 blog-img://img-xxx 替換為實際壓縮後的圖片 Data URL
 */
function resolveInlineImages(htmlContent = '', inlineImages = {}) {
  if (!inlineImages || typeof inlineImages !== 'object') {
    return htmlContent;
  }
  return String(htmlContent).replace(/blog-img:\/\/(img-[a-zA-Z0-9_-]+)/g, (match, imgId) => {
    return inlineImages[imgId] || match;
  });
}

/**
 * 將文章內容（Markdown 或既有 HTML）安全渲染為乾淨的 HTML 字串，
 * 並移除舊文章內重複的開頭 H1 與多餘的 GitHub 錨點圖示。
 */
export function renderPostContent(
  rawContent = '',
  format = 'markdown',
  postTitle = '',
  inlineImages = {}
) {
  if (!rawContent) {
    return '';
  }

  const normalized = normalizeAssetPaths(rawContent);
  const rawHtml = format === 'html' ? normalized : marked.parse(normalized);

  const sanitized = DOMPurify.sanitize(rawHtml, {
    ADD_ATTR: ['target', 'rel', 'width', 'height'],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|data|blog-img):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  });

  // 在 DOMPurify 清洗後再將 blog-img://img-xxx 替換為實際的 Base64 Data URL，避免長字串被截斷或誤濾
  let cleaned = resolveInlineImages(sanitized, inlineImages).replace(
    /<a[^>]*class="[^"]*anchor[^"]*"[^>]*>[\s\S]*?<\/a>/gi,
    ''
  );

  if (postTitle) {
    const firstH1Match = cleaned.match(/^\s*(?:<div[^>]*>\s*)*<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (firstH1Match) {
      const h1Text = firstH1Match[1].replace(/<[^>]+>/g, '').trim();
      const normalizedTitle = postTitle.trim();
      if (
        h1Text === normalizedTitle ||
        h1Text.includes(normalizedTitle.slice(0, 10)) ||
        normalizedTitle.includes(h1Text.slice(0, 10))
      ) {
        cleaned = cleaned.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, '');
      }
    }
  }

  return cleaned;
}
