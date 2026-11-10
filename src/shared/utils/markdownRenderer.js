import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { normalizeAssetPaths } from './contentFormatter.js';

marked.setOptions({
  breaks: true,
  gfm: true
});

/**
 * 將文章內容（Markdown 或既有 HTML）安全渲染為乾淨的 HTML 字串
 */
export function renderPostContent(rawContent = '', format = 'markdown') {
  if (!rawContent) {
    return '';
  }

  const normalized = normalizeAssetPaths(rawContent);
  const htmlOutput = format === 'html' ? normalized : marked.parse(normalized);

  return DOMPurify.sanitize(htmlOutput, {
    ADD_ATTR: ['target', 'rel', 'width', 'height']
  });
}
