/**
 * 內容格式化、純文字摘要擷取、Slug 產生與資源路徑正規化工具
 */

export function normalizeAssetPaths(htmlContent = '') {
  return String(htmlContent).replace(/\.\.\/media\/pictures\//g, './media/pictures/');
}

export function extractPlainTextExcerpt(rawContent = '', maxLength = 140) {
  const withoutTags = String(rawContent)
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*`>~_\-[\]()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (withoutTags.length <= maxLength) {
    return withoutTags;
  }
  return `${withoutTags.slice(0, maxLength)}...`;
}

export function formatDisplayDate(isoDateString = '') {
  const match = String(isoDateString).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return isoDateString || new Date().toISOString().slice(0, 10);
  }
  const [, year, month, day] = match;
  return `${year}年${month}月${day}日`;
}

export function generatePostSlug(title = '', isoDate = '') {
  const datePrefix = isoDate || new Date().toISOString().slice(0, 10);
  const sanitizedTitle = String(title)
    .trim()
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);

  const fallbackSuffix = Math.random().toString(36).slice(2, 8);
  return `${datePrefix}-${sanitizedTitle || fallbackSuffix}`;
}
