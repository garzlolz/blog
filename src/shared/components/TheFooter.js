import { AUTHOR_PROFILE } from '../../config/firebase.config.js';

export default {
  name: 'TheFooter',
  setup() {
    function scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return {
      profile: AUTHOR_PROFILE,
      scrollToTop
    };
  },
  template: /* html */ `
    <footer class="blog-footer cyber-footer mt-5">
      <p class="mb-2">
        Blog built by
        <a :href="profile.socialLinks[1].url" target="_blank" rel="noopener" class="cyber-link">
          {{ profile.name }}
        </a>
      </p>
      <p class="mb-0">
        <a href="javascript:void(0)" class="cyber-link" @click="scrollToTop">回到 TOP ↑</a>
      </p>
    </footer>
  `
};
