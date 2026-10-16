function storageKey(userId) {
  return `tripmate_watchlist_${userId}`;
}

export function getWatchlist(userId) {
  if (!userId || typeof window === "undefined") {
    return [];
  }

  try {
    const raw = localStorage.getItem(storageKey(userId));
    const ids = raw ? JSON.parse(raw) : [];

    if (!Array.isArray(ids)) {
      return [];
    }

    return ids.map(Number).filter((id) => Number.isInteger(id));
  } catch {
    return [];
  }
}

export function saveWatchlist(userId, ids) {
  localStorage.setItem(storageKey(userId), JSON.stringify(ids));
}
