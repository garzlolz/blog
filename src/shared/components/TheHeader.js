import { AUTHOR_PROFILE } from '../../config/firebase.config.js';

export default {
  name: 'TheHeader',
  setup() {
    return {
      profile: AUTHOR_PROFILE
    };
  },
  template: /* html */ `
    <div class="container">
      <header class="blog-header">
        <div class="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <router-link class="cyber-link" to="/">
              ← 返回封面
            </router-link>
          </div>
          <div class="text-center">
            <router-link class="blog-header-logo" to="/posts">
              {{ profile.englishName }}
            </router-link>
          </div>
          <div class="d-flex justify-content-end align-items-center gap-2">
            <slot name="actions" />
          </div>
        </div>
      </header>

      <div class="nav-scroller py-1 mb-4">
        <nav class="nav d-flex justify-content-between align-items-center">
          <router-link class="p-2 cyber-link" to="/posts">所有文章</router-link>
          <a class="p-2 cyber-link" :href="profile.socialLinks[1].url" target="_blank" rel="noopener">LinkedIn</a>
          <a class="p-2 cyber-link" :href="profile.socialLinks[0].url" target="_blank" rel="noopener">GitHub</a>
          <a class="p-2 cyber-link" :href="'mailto:' + profile.email">聯絡我</a>
        </nav>
      </div>
    </div>
  `
};
