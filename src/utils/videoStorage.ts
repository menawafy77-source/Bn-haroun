// IndexedDB storage for persisting custom user uploaded video (e.g. 692276014_1791972383954407.mp4)

const DB_NAME = 'HarounCoffeeDB';
const DB_VERSION = 1;
const STORE_NAME = 'media_files';
const VIDEO_KEY = 'haroun_uploaded_promo_video';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveVideoBlob(file: Blob, fileName?: string): Promise<string> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const record = {
      id: VIDEO_KEY,
      blob: file,
      name: fileName || 'ben_haroun_video.mp4',
      type: file.type || 'video/mp4',
      timestamp: Date.now(),
    };
    await new Promise<void>((resolve, reject) => {
      const putReq = store.put(record);
      putReq.onsuccess = () => resolve();
      putReq.onerror = () => reject(putReq.error);
    });

    const objectUrl = URL.createObjectURL(file);
    // Dispatch event to sync all video players across components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('haroun_video_changed', {
          detail: { url: objectUrl, name: record.name },
        })
      );
    }
    return objectUrl;
  } catch (err) {
    console.warn('Failed to save video to IndexedDB, fallback to objectURL', err);
    return URL.createObjectURL(file);
  }
}

export async function getSavedVideoUrl(): Promise<string | null> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const record = await new Promise<any>((resolve, reject) => {
      const getReq = store.get(VIDEO_KEY);
      getReq.onsuccess = () => resolve(getReq.result);
      getReq.onerror = () => reject(getReq.error);
    });

    if (record && record.blob) {
      return URL.createObjectURL(record.blob);
    }
    return null;
  } catch {
    return null;
  }
}

export async function clearSavedVideo(): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    await new Promise<void>((resolve, reject) => {
      const delReq = store.delete(VIDEO_KEY);
      delReq.onsuccess = () => resolve();
      delReq.onerror = () => reject(delReq.error);
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('haroun_video_changed', {
          detail: { url: null, name: '' },
        })
      );
    }
  } catch (err) {
    console.warn('Failed to clear video from IndexedDB', err);
  }
}
