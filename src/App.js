import { computed } from 'vue';
import { useRoute } from 'vue-router';
import TheHeader from './shared/components/TheHeader.js';
import TheFooter from './shared/components/TheFooter.js';
import AuthActionButton from './features/auth/components/AuthActionButton.js';

export default {
  name: 'App',
  components: {
    TheHeader,
    TheFooter,
    AuthActionButton
  },
  setup() {
    const route = useRoute();
    const isCoverLayout = computed(() => route.meta?.layout === 'cover');

    return {
      isCoverLayout
    };
  },
  template: /* html */ `
    <div class="app-shell min-vh-100 d-flex flex-column">
      <TheHeader v-if="!isCoverLayout">
        <template #actions>
          <AuthActionButton />
        </template>
      </TheHeader>

      <div class="flex-grow-1">
        <router-view />
      </div>

      <TheFooter v-if="!isCoverLayout" />
    </div>
  `
};
