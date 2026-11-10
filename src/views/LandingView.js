import { ref, onMounted, onUnmounted } from 'vue';
import { AUTHOR_PROFILE } from '../config/firebase.config.js';

export default {
  name: 'LandingView',
  setup() {
    const glitchShadow = ref('');
    const copySuccess = ref(false);
    let glitchTimer = null;

    function copyEmail() {
      navigator.clipboard.writeText(AUTHOR_PROFILE.email).then(() => {
        copySuccess.value = true;
        setTimeout(() => {
          copySuccess.value = false;
        }, 2200);
      });
    }

    onMounted(() => {
      glitchTimer = setInterval(() => {
        const x1 = (Math.random() * 8).toFixed(1);
        const y1 = (Math.random() * 8).toFixed(1);
        const x2 = (Math.random() * -8).toFixed(1);
        const y2 = (Math.random() * -8).toFixed(1);
        glitchShadow.value = `${x1}px ${y1}px #0ff, ${x2}px ${y2}px #f0f`;
      }, 80);
    });

    onUnmounted(() => {
      if (glitchTimer) {
        clearInterval(glitchTimer);
      }
    });

    return {
      profile: AUTHOR_PROFILE,
      glitchShadow,
      copySuccess,
      copyEmail
    };
  },
  template: /* html */ `
    <div class="landing-wrapper">
      <div class="cover-container d-flex w-100 min-vh-100 p-3 mx-auto flex-column justify-content-between">
        <header class="mb-auto">
          <div class="d-flex flex-wrap justify-content-between align-items-center gap-2">
            <h3 class="mb-0 cyber-text">{{ profile.englishName }}'s Legacy</h3>
            <nav class="nav nav-masthead justify-content-center">
              <router-link class="nav-link active" to="/">首頁</router-link>
              <router-link class="nav-link" to="/posts">部落格</router-link>
              <a class="nav-link" :href="profile.socialLinks[1].url" target="_blank" rel="noopener">我的社群</a>
              <a class="nav-link" href="javascript:void(0)" @click="copyEmail">
                {{ copySuccess ? '✓ 已複製 Email!' : profile.email }}
              </a>
            </nav>
          </div>
        </header>

        <main class="px-3 my-5">
          <div class="cyber-container">
            <h1 class="landing-title" :style="{ textShadow: glitchShadow }">
              {{ profile.englishName }}'s Legacy
            </h1>
            <div class="cyber-lines"></div>
            <p class="lead mb-4">Life、Coding、Future</p>
            <p class="lead">
              <router-link to="/posts" class="cyber-enter-btn">
                進入部落格
              </router-link>
            </p>
          </div>
        </main>

        <footer class="mt-auto text-white-50 pt-3">
          <p class="mb-0">
            {{ profile.englishName }}'s Legacy
            <a :href="profile.socialLinks[1].url" target="_blank" rel="noopener" class="cyber-link">
              @{{ profile.name }}
            </a>
          </p>
        </footer>
      </div>
    </div>
  `
};
