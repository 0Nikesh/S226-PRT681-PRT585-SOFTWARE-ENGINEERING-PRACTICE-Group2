"use client";

import { useRouter } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();

  const handleSearch = () => {
    router.push("/destinations");
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-3 rounded-2xl bg-white p-3 shadow-xl md:flex-row md:items-center">

      {/* Destination */}
      <div className="flex-1 px-4 py-2">
        <p className="text-[10px] font-semibold uppercase text-gray-500">
          Where to?
        </p>

        <input
          type="text"
          placeholder="Enter destination..."
          className="w-full border-none text-sm outline-none"
        />
      </div>

      {/* Date */}
      <div className="flex-1 border-t px-4 py-2 md:border-l md:border-t-0">
        <p className="text-[10px] font-semibold uppercase text-gray-500">
          Dates
        </p>

        <input
          type="text"
          placeholder="Select check-in - out"
          className="w-full text-sm outline-none"
        />
      </div>

      {/* Guests */}
      <div className="flex-1 border-t px-4 py-2 md:border-l md:border-t-0">
        <p className="text-[10px] font-semibold uppercase text-gray-500">
          Guests
        </p>

        <input
          type="text"
          placeholder="Add guests"
          className="w-full text-sm outline-none"
        />
      </div>

      {/* Search */}
      <button
        onClick={handleSearch}
        className="rounded-xl bg-sky-600 px-7 py-4 text-sm font-semibold text-white hover:bg-sky-700"
      >
        🔍 Search
      </button>

    </div>
  );
}