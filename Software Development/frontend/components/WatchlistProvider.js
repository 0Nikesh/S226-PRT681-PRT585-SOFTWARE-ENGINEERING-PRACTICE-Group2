"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { getWatchlist, saveWatchlist } from "@/lib/watchlist";

const WatchlistContext = createContext(null);

export function WatchlistProvider({ children }) {
  const { user, ready } = useAuth();
  const [ids, setIds] = useState([]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    setIds(user ? getWatchlist(user.userId) : []);
  }, [ready, user]);

  function isSaved(destinationId) {
    return ids.includes(Number(destinationId));
  }

  function toggle(destinationId) {
    if (!user) {
      return false;
    }

    const id = Number(destinationId);

    setIds((current) => {
      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];

      saveWatchlist(user.userId, next);
      return next;
    });

    return true;
  }

  return (
    <WatchlistContext.Provider value={{ ids, isSaved, toggle }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);

  if (!context) {
    throw new Error("useWatchlist must be used within WatchlistProvider");
  }

  return context;
}
