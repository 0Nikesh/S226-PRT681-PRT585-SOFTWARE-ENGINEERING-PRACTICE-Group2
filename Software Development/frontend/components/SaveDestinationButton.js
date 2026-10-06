"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/components/AuthProvider";
import { useWatchlist } from "@/components/WatchlistProvider";

function BookmarkIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        d="M7 4.5h10a1 1 0 0 1 1 1V20l-6-3.5L6 20V5.5a1 1 0 0 1 1-1z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function SaveDestinationButton({ destination, className = "" }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, ready } = useAuth();
  const { isSaved, toggle } = useWatchlist();
  const [loginOpen, setLoginOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const saved = isSaved(destination.id);
  const loginHref = `/login?next=${encodeURIComponent(pathname || `/destinations/${destination.id}`)}`;

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleSave(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!ready || !user) {
      setLoginOpen(true);
      return;
    }

    toggle(destination.id);
  }

  function goToLogin() {
    setLoginOpen(false);
    router.push(loginHref);
  }

  const loginDialog =
    loginOpen && mounted
      ? createPortal(
          <div
            role="presentation"
            onClick={() => setLoginOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(15, 23, 42, 0.55)",
              padding: "1rem",
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby={`save-login-${destination.id}`}
              className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
              onClick={(event) => event.stopPropagation()}
            >
              <h2 id={`save-login-${destination.id}`} className="font-serif text-2xl font-semibold text-slate-900">
                Log in to save
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                You need to log in before adding {destination.name} to your watchlist.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setLoginOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={goToLogin}
                  className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600"
                >
                  Log in
                </button>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <button
        type="button"
        onClick={handleSave}
        aria-label={saved ? `Remove ${destination.name} from watchlist` : `Save ${destination.name} to watchlist`}
        className={`flex h-9 w-9 items-center justify-center rounded-full shadow-sm ${
          saved ? "bg-sky-500 text-white" : "bg-white text-slate-700 hover:text-sky-600"
        } ${className}`}
      >
        <BookmarkIcon filled={saved} />
      </button>
      {loginDialog}
    </>
  );
}
