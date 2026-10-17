// One current photo per tab. IndexedDB keeps large payloads out of Web Storage.
(() => {
  const key = 'dpblast-customize-image';
  let database;
  const open = () => database ??= new Promise((resolve, reject) => {
    const request = indexedDB.open('dpblast-photos', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('photos');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('Photo storage is blocked'));
  });
  const transaction = async (mode, action) => {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('photos', mode);
      const request = action(tx.objectStore('photos'));
      tx.oncomplete = () => resolve(request.result);
      tx.onerror = tx.onabort = () => reject(tx.error);
    });
  };
  const tabKey = () => {
    let id = sessionStorage.getItem('dpblast-photo-tab');
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem('dpblast-photo-tab', id);
    }
    return id;
  };
  window.dpblastPhotos = {
    async save(photo) {
      try {
        const id = tabKey();
        await transaction('readwrite', store => {
          // Bound retention for abandoned tabs; photos never leave this device.
          const cursor = store.openCursor();
          cursor.onsuccess = () => {
            const item = cursor.result;
            if (!item) return;
            if (item.key !== id && item.value.savedAt < Date.now() - 86400000) item.delete();
            item.continue();
          };
          return store.put({ ...photo, savedAt: Date.now() }, id);
        });
        sessionStorage.removeItem(key);
        return true;
      } catch {
        try {
          sessionStorage.setItem(key, JSON.stringify({ ...photo, savedAt: Date.now() }));
          return true;
        } catch { return false; }
      }
    },
    async load(eventSlug) {
      let photo;
      // A fallback save is newer than any previous IndexedDB photo.
      try { photo = JSON.parse(sessionStorage.getItem(key) || 'null'); } catch {}
      if (!photo) {
        try { photo = await transaction('readonly', store => store.get(tabKey())); } catch {}
      }
      if (photo?.eventSlug !== eventSlug || typeof photo.dataUrl !== 'string') return null;
      if (photo.savedAt && photo.savedAt < Date.now() - 86400000) return null;
      return photo;
    },
  };
})();
