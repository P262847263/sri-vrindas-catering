export function getLocalFavoritesKey(): string {
  try {
    const token = localStorage.getItem('token');
    if (!token) return 'localFavorites:anon';
    const parts = token.split('.');
    if (parts.length < 2) return 'localFavorites:anon';
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    const id = payload?._id || payload?.userId || payload?.id || payload?.sub || null;
    return id ? `localFavorites:${String(id)}` : 'localFavorites:anon';
  } catch (e) {
    return 'localFavorites:anon';
  }
}
