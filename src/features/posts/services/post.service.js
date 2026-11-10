import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { getFirebaseClient } from '../../../shared/api/firebaseClient.js';

const POSTS_COLLECTION = 'posts';

/**
 * 從 Cloud Firestore 取得所有文章（依建立時間降序）
 */
export async function fetchAllPosts() {
  const client = getFirebaseClient();
  if (!client) {
    return [];
  }

  const postsRef = collection(client.db, POSTS_COLLECTION);
  const q = query(postsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data()
  }));
}

/**
 * 依文章 ID 從 Cloud Firestore 取得單篇文章
 */
export async function fetchPostById(postId) {
  const client = getFirebaseClient();
  if (!client) {
    return null;
  }

  const decodedId = decodeURIComponent(postId);
  const docRef = doc(client.db, POSTS_COLLECTION, decodedId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return {
    id: docSnap.id,
    ...docSnap.data()
  };
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
