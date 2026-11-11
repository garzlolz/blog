import { useRoute } from 'vue-router';
import BaseCard from './BaseCard.js';
import { AUTHOR_PROFILE } from '../../config/firebase.config.js';

export default {
  name: 'TheSidebar',
  components: {
    BaseCard
  },
  props: {
    recentPosts: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    const route = useRoute();
    return {
      route,
      profile: AUTHOR_PROFILE
    };
  },
  template: /* html */ `
    <aside class="sidebar-sticky">
      <BaseCard>
        <div class="profile-pic-wrapper">
          <img
            :src="profile.avatarUrl"
            :alt="profile.englishName"
            class="profile-pic"
            loading="lazy"
            decoding="async"
          />
        </div>
        <h4 class="cyber-title">關於我</h4>
        <p class="mb-0">
          <strong class="d-block fs-5 mb-1">{{ profile.englishName }}</strong>
          e-Mail:
          <em class="cyber-highlight">{{ profile.email }}</em><br />
          <span>{{ profile.title }}</span>
        </p>
      </BaseCard>

      <BaseCard>
        <h4 class="cyber-title">最近貼文 ({{ recentPosts.length }})</h4>
        <ol class="list-unstyled mb-0 cyber-list cyber-scroll" style="max-height: 340px; overflow-y: auto; padding-right: 6px;">
          <li v-for="post in recentPosts" :key="post.id">
            <router-link
              :to="'/posts/' + encodeURIComponent(post.id)"
              :class="['cyber-link d-block', { 'active-post-link fw-bold': route.params.id === post.id }]"
            >
              {{ post.title }}
            </router-link>
            <small class="text-white-50">{{ post.date }}</small>
          </li>
        </ol>
      </BaseCard>

      <BaseCard>
        <h4 class="cyber-title">社群</h4>
        <ol class="list-unstyled mb-0 cyber-list">
          <li v-for="social in profile.socialLinks" :key="social.label">
            <a :href="social.url" target="_blank" rel="noopener" class="cyber-link">
              {{ social.label }}
            </a>
          </li>
        </ol>
      </BaseCard>
    </aside>
  `
};
