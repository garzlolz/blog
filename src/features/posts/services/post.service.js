import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { getFirebaseClient } from '../../../shared/api/firebaseClient.js';
import { LEGACY_POSTS_SEED } from '../data/legacyPosts.seed.js';

const POSTS_COLLECTION = 'posts';

/**
 * 取得所有文章（優先從 Cloud Firestore 讀取，若未設定或無資料則回退至本地歷史種子資料）
 */
export async function fetchAllPosts() {
  const client = getFirebaseClient();
  if (!client) {
    return {
      posts: [...LEGACY_POSTS_SEED],
      source: 'seed'
    };
  }

  try {
    const postsRef = collection(client.db, POSTS_COLLECTION);
    const q = query(postsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return {
        posts: [...LEGACY_POSTS_SEED],
        source: 'seed'
      };
    }

    const posts = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    }));

    return {
      posts,
      source: 'firestore'
    };
  } catch (error) {
    console.warn('[PostService] Firestore 讀取失敗，自動降級使用本地種子資料:', error);
    return {
      posts: [...LEGACY_POSTS_SEED],
      source: 'seed'
    };
  }
}

/**
 * 依文章 ID 取得單篇文章（支援 Firestore 與種子資料雙重查找）
 */
export async function fetchPostById(postId) {
  const decodedId = decodeURIComponent(postId);
  const client = getFirebaseClient();

  if (client) {
    try {
      const docRef = doc(client.db, POSTS_COLLECTION, decodedId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      }
    } catch (error) {
      console.warn('[PostService] 單篇文章讀取異常，嘗試從本地種子查找:', error);
    }
  }

  return LEGACY_POSTS_SEED.find((post) => post.id === decodedId) || null;
}

/**
 * 新增或更新文章至 Cloud Firestore
 */
export async function upsertPostToFirestore(postId, postPayload) {
  const client = getFirebaseClient();
  if (!client) {
    throw new Error('尚未設定 Firebase 金鑰，無法儲存至雲端。');
  }

  const docRef = doc(client.db, POSTS_COLLECTION, postId);
  await setDoc(docRef, postPayload, { merge: true });
  return {
    id: postId,
    ...postPayload
  };
}

/**
 * 從 Cloud Firestore 刪除指定文章
 */
export async function deletePostFromFirestore(postId) {
  const client = getFirebaseClient();
  if (!client) {
    throw new Error('尚未設定 Firebase 金鑰，無法刪除雲端文章。');
  }

  const docRef = doc(client.db, POSTS_COLLECTION, postId);
  await deleteDoc(docRef);
}

/**
 * 將本地 30 篇歷史文章批次匯入至 Cloud Firestore
 */
export async function seedLegacyPostsToFirestore() {
  const client = getFirebaseClient();
  if (!client) {
    throw new Error('尚未設定 Firebase 金鑰，無法匯入種子資料。');
  }

  const batch = writeBatch(client.db);
  for (const seedPost of LEGACY_POSTS_SEED) {
    const docRef = doc(client.db, POSTS_COLLECTION, seedPost.id);
    batch.set(docRef, seedPost, { merge: true });
  }

  await batch.commit();
  return LEGACY_POSTS_SEED.length;
}
