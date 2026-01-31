const STORAGE_KEY = "auth";

export const getStoredAuth = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const setStoredAuth = (auth) => {
  if (!auth?.token) {
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
};

export const clearStoredAuth = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const getStoredToken = () => getStoredAuth()?.token || null;
