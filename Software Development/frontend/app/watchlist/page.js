"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import DestinationCard from "@/components/DestinationCard";
import { useAuth } from "@/components/AuthProvider";
import { useWatchlist } from "@/components/WatchlistProvider";
import { getDestinations } from "@/lib/api";
import { mergeCatalog } from "@/lib/destinations";

export default function WatchlistPage() {
  const { user, ready } = useAuth();
  const { ids, toggle } = useWatchlist();
  const [catalog, setCatalog] = useState([]);

  useEffect(() => {
    let active = true;

    getDestinations()
      .then((posted) => {
        if (active) {
          setCatalog(mergeCatalog(posted));
        }
      })
      .catch(() => {
        if (active) {
          setCatalog(mergeCatalog([]));
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const saved = catalog.filter((destination) => ids.includes(Number(destination.id)));

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">Your trips</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold text-slate-900">Watchlist</h1>

        {!ready ? (
          <p className="mt-6 text-sm text-gray-500">Loading your saved destinations...</p>
        ) : !user ? (
          <div className="mt-8 max-w-lg rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm leading-6 text-gray-600">
              Log in to save destinations and see them here.
            </p>
            <Link
              href="/login?next=/watchlist"
              className="mt-4 inline-flex rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600"
            >
              Log in
            </Link>
          </div>
        ) : saved.length === 0 ? (
          <div className="mt-8 max-w-lg rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm leading-6 text-gray-600">
              You have not saved a destination yet. Open a city and add it to your watchlist.
            </p>
            <Link href="/destinations" className="mt-4 inline-flex text-sm font-semibold text-sky-600">
              Browse destinations
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {saved.map((destination) => (
              <div key={destination.id}>
                <DestinationCard destination={destination} />
                <button
                  type="button"
                  onClick={() => toggle(destination.id)}
                  className="mt-3 text-sm font-medium text-gray-500 hover:text-red-600"
                >
                  Remove from watchlist
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
