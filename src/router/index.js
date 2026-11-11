import { createRouter, createWebHashHistory } from 'vue-router';
import LandingView from '../views/LandingView.js';
import PostListView from '../views/PostListView.js';
import PostDetailView from '../views/PostDetailView.js';
import PostEditorView from '../views/PostEditorView.js';
import { AUTHOR_PROFILE } from '../config/firebase.config.js';

const routes = [
  {
    path: '/',
    name: 'landing',
    component: LandingView,
    meta: {
      title: `${AUTHOR_PROFILE.englishName}'s Universe`,
      layout: 'cover'
    }
  },
  {
    path: '/posts',
    name: 'post-list',
    component: PostListView,
    meta: {
      title: `文章列表 | ${AUTHOR_PROFILE.englishName}'s Universe`,
      layout: 'blog'
    }
  },
  {
    path: '/posts/new',
    name: 'post-create',
    component: PostEditorView,
    meta: {
      title: `新增文章 | ${AUTHOR_PROFILE.englishName}'s Universe`,
      layout: 'blog',
      requiresAdmin: true
    }
  },
  {
    path: '/posts/:id',
    name: 'post-detail',
    component: PostDetailView,
    meta: {
      title: `閱讀文章 | ${AUTHOR_PROFILE.englishName}'s Universe`,
      layout: 'blog'
    }
  },
  {
    path: '/posts/:id/edit',
    name: 'post-edit',
    component: PostEditorView,
    meta: {
      title: `編輯文章 | ${AUTHOR_PROFILE.englishName}'s Universe`,
      layout: 'blog',
      requiresAdmin: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/posts'
  }
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.afterEach((to) => {
  if (to.meta?.title) {
    document.title = to.meta.title;
  }
});
