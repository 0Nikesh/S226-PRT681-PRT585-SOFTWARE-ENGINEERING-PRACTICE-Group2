"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import DestinationCard from "@/components/DestinationCard";
import Footer from "@/components/Footer";
import { getDestinations } from "@/lib/api";
import { mergeCatalog } from "@/lib/destinations";

const seasons = ["All", "Spring", "Summer", "Autumn", "Winter"];

function matchesName(destination, query) {
  const name = query.trim().toLowerCase();

  if (!name) {
    return true;
  }

  return String(destination.name || "").toLowerCase().includes(name);
}

function matchesPrice(destination, minPrice, maxPrice) {
  const low = Number(destination.minPrice);
  const high = Number(destination.maxPrice);
  const floor = minPrice === "" ? null : Number(minPrice);
  const ceiling = maxPrice === "" ? null : Number(maxPrice);

  if (floor !== null && Number.isFinite(floor) && high < floor) {
    return false;
  }

  if (ceiling !== null && Number.isFinite(ceiling) && low > ceiling) {
    return false;
  }

  return true;
}

function DestinationsContent() {
  const searchParams = useSearchParams();
  const requestedSeason = searchParams.get("season") || "All";
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [season, setSeason] = useState(seasons.includes(requestedSeason) ? requestedSeason : "All");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sort, setSort] = useState("visitors");
  const [remote, setRemote] = useState(null);

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
    const nextSeason = searchParams.get("season") || "All";
    setSeason(seasons.includes(nextSeason) ? nextSeason : "All");
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
  }, [searchParams]);

  useEffect(() => {
    let active = true;

    getDestinations()
      .then((items) => {
        if (!active) {
          return;
        }

        setRemote(items);
      })
      .catch(() => {
        if (active) {
          setRemote([]);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const visible = useMemo(() => {
    const catalog = mergeCatalog(remote || []);
    const filtered = catalog.filter((destination) => {
      const seasonMatches = season === "All" || destination.bestSeason === season;
      return seasonMatches && matchesName(destination, query) && matchesPrice(destination, minPrice, maxPrice);
    });

    return [...filtered].sort((left, right) => {
      if (sort === "price-asc") {
        return Number(left.averagePricePerDay) - Number(right.averagePricePerDay);
      }

      if (sort === "price-desc") {
        return Number(right.averagePricePerDay) - Number(left.averagePricePerDay);
      }

      return Number(right.averageVisitorsPerWeek) - Number(left.averageVisitorsPerWeek);
    });
  }, [maxPrice, minPrice, query, remote, season, sort]);

  const summary = [
    query.trim() ? query.trim() : "",
    season !== "All" ? season : "",
    minPrice !== "" || maxPrice !== "" ? `AUD $${minPrice || "0"}–AUD $${maxPrice || "any"} / day` : "",
  ].filter(Boolean);

  return (
    <main>
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">
              Plan by season and budget
            </p>
            <h1 className="mt-2 font-serif text-4xl font-semibold text-slate-900">Destinations</h1>
            <p className="mt-2 text-sm text-gray-500">
              {remote === null
                ? "Loading destinations..."
                : `${visible.length} ${visible.length === 1 ? "destination" : "destinations"}`}
              {remote !== null && summary.length > 0 ? ` · ${summary.join(" · ")}` : ""}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {seasons.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setSeason(item)}
                className={`rounded-full px-3 py-1.5 text-sm ${
                  season === item
                    ? "bg-sky-500 text-white"
                    : "bg-white text-gray-600 shadow-sm"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Destination name"
              aria-label="Destination name"
              className="rounded-lg border bg-white px-3 py-2 text-sm"
            />
            <input
              type="number"
              min="0"
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
              placeholder="Min AUD $"
              aria-label="Minimum price per day in AUD"
              className="w-28 rounded-lg border bg-white px-3 py-2 text-sm"
            />
            <input
              type="number"
              min="0"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              placeholder="Max AUD $"
              aria-label="Maximum price per day in AUD"
              className="w-28 rounded-lg border bg-white px-3 py-2 text-sm"
            />
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="rounded-lg border bg-white px-3 py-2 text-sm"
            >
              <option value="visitors">Most visitors</option>
              <option value="price-asc">Average price: low to high</option>
              <option value="price-desc">Average price: high to low</option>
            </select>
          </div>
        </div>

        {remote !== null && visible.length === 0 ? (
          <p className="mt-8 text-sm text-gray-500">
            No destinations match this name, season, or price range.
          </p>
        ) : null}

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function DestinationsPage() {
  return (
    <Suspense
      fallback={
        <main>
          <Navbar />
          <p className="px-6 py-16 text-center text-sm text-gray-500">Loading destinations...</p>
        </main>
      }
    >
      <DestinationsContent />
    </Suspense>
  );
}
