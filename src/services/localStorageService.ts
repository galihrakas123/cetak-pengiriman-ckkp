// In-memory fallback jika browser memblokir localStorage (Tracking Prevention / Incognito mode)
const memoryStorage: Record<string, string> = {};

export const setLocalStorage = (key: string, value: any) => {
  try {
    const stringValue = JSON.stringify(value);
    memoryStorage[key] = stringValue;
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(key, stringValue);
    }
  } catch (e) {
    console.warn("Storage access restricted, using memory fallback for:", key);
  }
};

export const getLocalStorage = (key: string) => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        return JSON.parse(item);
      }
    }
  } catch (e) {
    console.warn("Storage access restricted, reading from memory fallback for:", key);
  }
  
  if (memoryStorage[key]) {
    try {
      return JSON.parse(memoryStorage[key]);
    } catch {
      return null;
    }
  }
  return null;
};

export const removeLocalStorage = (key: string) => {
  delete memoryStorage[key];
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  } catch {
    // ignore
  }
};

export const clearLocalStorage = () => {
  Object.keys(memoryStorage).forEach((k) => delete memoryStorage[k]);
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.clear();
    }
  } catch {
    // ignore
  }
};
