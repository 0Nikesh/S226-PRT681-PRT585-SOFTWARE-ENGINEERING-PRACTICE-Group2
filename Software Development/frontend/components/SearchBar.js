"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const seasons = ["All", "Spring", "Summer", "Autumn", "Winter"];

export default function SearchBar() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [season, setSeason] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [error, setError] = useState("");

  function handleSearch(event) {
    event.preventDefault();
    setError("");

    const minimum = minPrice === "" ? null : Number(minPrice);
    const maximum = maxPrice === "" ? null : Number(maxPrice);

    if ((minimum !== null && (!Number.isFinite(minimum) || minimum < 0)) || (maximum !== null && (!Number.isFinite(maximum) || maximum < 0))) {
      setError("Prices must be zero or more.");
      return;
    }

    if (minimum !== null && maximum !== null && maximum < minimum) {
      setError("Maximum price must be at least the minimum price.");
      return;
    }

    const params = new URLSearchParams();
    const place = name.trim();

    if (place) {
      params.set("q", place);
    }

    if (season !== "All") {
      params.set("season", season);
    }

    if (minimum !== null) {
      params.set("minPrice", String(minimum));
    }

    if (maximum !== null) {
      params.set("maxPrice", String(maximum));
    }

    const query = params.toString();
    router.push(query ? `/destinations?${query}` : "/destinations");
  }

  return (
    <form
      onSubmit={handleSearch}
      className="mx-auto flex max-w-4xl flex-col gap-3 rounded-2xl bg-white p-3 text-left text-slate-900 shadow-xl md:flex-row md:items-end"
    >
      <label className="min-w-0 flex-1 px-3 py-2">
        <p className="text-[10px] font-semibold uppercase text-gray-500">Destination</p>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Destination name"
          className="w-full text-sm outline-none"
        />
      </label>

      <label className="min-w-0 flex-1 border-t px-3 py-2 md:border-l md:border-t-0">
        <p className="text-[10px] font-semibold uppercase text-gray-500">Season</p>
        <select
          value={season}
          onChange={(event) => setSeason(event.target.value)}
          className="w-full bg-transparent text-sm outline-none"
        >
          {seasons.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <div className="flex min-w-0 flex-1 gap-2 border-t px-3 py-2 md:border-l md:border-t-0">
        <label className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase text-gray-500">Min AUD $</p>
          <input
            type="number"
            min="0"
            step="1"
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
            placeholder="0"
            className="w-full text-sm outline-none"
          />
        </label>
        <label className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase text-gray-500">Max AUD $</p>
          <input
            type="number"
            min="0"
            step="1"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            placeholder="300"
            className="w-full text-sm outline-none"
          />
        </label>
      </div>

      <button
        type="submit"
        className="rounded-xl bg-sky-600 px-7 py-4 text-sm font-semibold text-white hover:bg-sky-700"
      >
        Search
      </button>

      {error ? (
        <p className="basis-full px-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
