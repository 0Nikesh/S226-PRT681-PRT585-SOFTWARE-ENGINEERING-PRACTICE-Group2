"use client";

import Link from "next/link";
import { useState } from "react";
import SaveDestinationButton from "@/components/SaveDestinationButton";
import { formatMoney } from "@/lib/destinations";

const seasonStyles = {
  Spring: "bg-emerald-50 text-emerald-700",
  Summer: "bg-amber-50 text-amber-700",
  Autumn: "bg-orange-50 text-orange-700",
  Winter: "bg-sky-50 text-sky-700",
};

export default function DestinationCard({ destination }) {
  const season = destination.bestSeason || "Season";
  const visitors = Number(destination.averageVisitorsPerWeek) || 0;
  const imageUrl = destination.imageUrl || "";
  const [failedUrl, setFailedUrl] = useState("");
  const showImage = Boolean(imageUrl) && failedUrl !== imageUrl;

  return (
    <article className="relative rounded-xl bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <SaveDestinationButton
        destination={destination}
        className="absolute right-3 top-3 z-10"
      />

      <Link href={`/destinations/${destination.id}`} className="block">
        {showImage ? (
          <img
            src={imageUrl}
            alt=""
            className="h-44 w-full rounded-t-xl object-cover"
            onError={() => setFailedUrl(imageUrl)}
          />
        ) : (
          <div className="flex h-44 items-end rounded-t-xl bg-gradient-to-br from-sky-500 to-slate-900 p-4 text-white">
            <div>
              <p className="text-xs uppercase tracking-wider text-sky-100">{destination.continent}</p>
              <p className="font-serif text-2xl">{destination.name}</p>
            </div>
          </div>
        )}

        <div className="p-4">
          <div className="flex items-start justify-between gap-3 pr-1">
            <div>
              <p className="text-xs text-sky-600">
                {destination.country}
                {destination.continent ? ` · ${destination.continent}` : ""}
              </p>
              <h3 className="mt-1 text-xl font-semibold text-slate-900">{destination.name}</h3>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${seasonStyles[season] || "bg-gray-100 text-gray-600"}`}>
              {season}
            </span>
          </div>

          {destination.description ? (
            <p className="mt-3 text-sm leading-6 text-gray-500">{destination.description}</p>
          ) : null}

          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-gray-500">Price range</dt>
              <dd className="font-medium text-slate-900">
                {formatMoney(destination.minPrice)} – {formatMoney(destination.maxPrice)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-gray-500">Average / day</dt>
              <dd className="font-semibold text-slate-900">{formatMoney(destination.averagePricePerDay)}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-gray-500">Visitors / week</dt>
              <dd className="font-medium text-slate-900">{visitors.toLocaleString("en-AU")}</dd>
            </div>
          </dl>

          <p className="mt-4 text-sm font-semibold text-sky-600">View places to visit</p>
        </div>
      </Link>
    </article>
  );
}
