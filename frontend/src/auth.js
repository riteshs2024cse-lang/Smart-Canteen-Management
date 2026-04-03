const AUTH_STORAGE_KEY = 'smart_canteen_auth';

export const getAuth = () => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setAuth = (authPayload) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authPayload));
};

export const clearAuth = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const isAuthenticated = () => {
  const auth = getAuth();
  return Boolean(auth?.token && auth?.user?.role);
};

export const hasRole = (requiredRoles = []) => {
  const auth = getAuth();
  const role = auth?.user?.role;
  if (!role) {
    return false;
  }
  return requiredRoles.includes(role);
};
