"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import SaveDestinationButton from "@/components/SaveDestinationButton";
import { formatMoney, getDestinationById, localDetailsFor } from "@/lib/destinations";
import { getDestination } from "@/lib/api";
import { getHotelsForDestination, mapsUrl } from "@/lib/hotels";

const seasonStyles = {
  Spring: "bg-emerald-50 text-emerald-700",
  Summer: "bg-amber-50 text-amber-700",
  Autumn: "bg-orange-50 text-orange-700",
  Winter: "bg-sky-50 text-sky-700",
};

export default function DestinationDetailPage() {
  const params = useParams();
  const staticDestination = getDestinationById(params.id);
  const [destination, setDestination] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;

    getDestination(params.id)
      .then((remote) => {
        if (!active) {
          return;
        }

        if (!remote) {
          setStatus("missing");
          return;
        }

        const local = staticDestination || localDetailsFor(remote.name);

        setDestination({
          ...remote,
          overview: local?.overview || remote.description || "",
          places: local?.places || [],
        });
        setStatus("ready");
      })
      .catch(() => {
        if (!active) {
          return;
        }

        if (staticDestination) {
          setDestination(staticDestination);
          setStatus("ready");
          return;
        }

        setStatus("missing");
      });

    return () => {
      active = false;
    };
  }, [params.id, staticDestination]);

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-[#f7f9fc]">
        <Navbar />
        <p className="px-6 py-16 text-center text-sm text-gray-500">Loading destination...</p>
      </main>
    );
  }

  if (status === "missing" || !destination) {
    return (
      <main className="min-h-screen bg-[#f7f9fc]">
        <Navbar />
        <section className="mx-auto max-w-3xl px-6 py-16 text-center">
          <h1 className="font-serif text-3xl font-semibold">Destination not found</h1>
          <Link href="/destinations" className="mt-4 inline-flex text-sm font-semibold text-sky-600">
            Back to destinations
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <Navbar />

      <section className="mx-auto max-w-3xl px-6 py-10">
        <Link href="/destinations" className="text-sm font-medium text-sky-600">
          Back to destinations
        </Link>

        <div className="relative mt-4 rounded-2xl bg-white shadow-sm">
          <SaveDestinationButton
            destination={destination}
            className="absolute right-4 top-4 z-10"
          />
          {destination.imageUrl ? (
            <div className="relative">
              <img
                src={destination.imageUrl}
                alt={destination.name}
                className="h-72 w-full rounded-t-2xl object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-gradient-to-t from-slate-900/80 to-transparent px-6 py-6 pr-16 text-white">
                <p className="text-xs uppercase tracking-wider text-sky-100">
                  {destination.country} · {destination.continent}
                </p>
                <h1 className="mt-2 font-serif text-4xl font-semibold">{destination.name}</h1>
              </div>
            </div>
          ) : (
            <div className="rounded-t-2xl bg-gradient-to-br from-sky-500 to-slate-900 px-6 py-10 pr-16 text-white">
              <p className="text-xs uppercase tracking-wider text-sky-100">
                {destination.country} · {destination.continent}
              </p>
              <h1 className="mt-2 font-serif text-4xl font-semibold">{destination.name}</h1>
            </div>
          )}

          <div className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${seasonStyles[destination.bestSeason] || "bg-gray-100 text-gray-600"}`}>
                Best season: {destination.bestSeason}
              </span>
              <p className="text-sm text-gray-500">{destination.destinationTime} day trip</p>
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-700">{destination.overview}</p>

            <a
              href={mapsUrl(destination.mapsQuery || `${destination.name}, ${destination.country}`)}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex text-sm font-semibold text-sky-600"
            >
              Open {destination.name} in Google Maps
            </a>

            <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <dt className="text-gray-500">Price range</dt>
                <dd className="mt-1 font-semibold text-slate-900">
                  {formatMoney(destination.minPrice)} – {formatMoney(destination.maxPrice)}
                </dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <dt className="text-gray-500">Average / day</dt>
                <dd className="mt-1 font-semibold text-slate-900">
                  {formatMoney(destination.averagePricePerDay)}
                </dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <dt className="text-gray-500">Visitors / week</dt>
                <dd className="mt-1 font-semibold text-slate-900">
                  {destination.averageVisitorsPerWeek.toLocaleString("en-AU")}
                </dd>
              </div>
            </dl>

            <Link
              href={`/experiences?destination=${destination.id}`}
              className="mt-6 inline-flex text-sm font-semibold text-sky-600"
            >
              Share your experience
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="font-serif text-2xl font-semibold text-slate-900">Hotels</h2>
          <p className="mt-2 text-sm text-gray-500">
            Stays in {destination.name}. Open a hotel on Google Maps, or book it in TripMate.
          </p>
          <div className="mt-5 space-y-4">
            {(destination.hotels?.length ? destination.hotels : getHotelsForDestination(destination.id)).length === 0 ? (
              <p className="rounded-2xl bg-white p-5 text-sm text-gray-500 shadow-sm">
                No hotels have been added for this trip yet.
              </p>
            ) : null}
            {(destination.hotels?.length ? destination.hotels : getHotelsForDestination(destination.id)).map((hotel) => (
              <article key={hotel.id} className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">{hotel.area}</p>
                    <h3 className="mt-1 text-lg font-semibold text-slate-900">{hotel.name}</h3>
                  </div>
                  {Number(hotel.rating) > 0 ? (
                    <p className="text-sm font-semibold text-slate-900">{Number(hotel.rating).toFixed(1)} / 5</p>
                  ) : null}
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">{hotel.description}</p>
                <p className="mt-3 text-sm font-semibold text-slate-900">
                  {formatMoney(hotel.pricePerNight)} per night
                </p>
                <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
                  <a
                    href={mapsUrl(hotel.mapsQuery || `${hotel.name}, ${destination.name}`)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-600"
                  >
                    View on Google Maps
                  </a>
                  <Link
                    href={`/destinations/${destination.id}/hotels/${hotel.id}`}
                    className="rounded-lg bg-sky-500 px-3 py-1.5 text-white hover:bg-sky-600"
                  >
                    Book
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="font-serif text-2xl font-semibold text-slate-900">Best places to visit</h2>
          <p className="mt-2 text-sm text-gray-500">
            Places inside {destination.name} that are worth planning into the trip.
          </p>

          <ol className="mt-5 space-y-4">
            {(destination.places || []).length === 0 ? (
              <li className="rounded-2xl bg-white p-5 text-sm text-gray-500 shadow-sm">
                Places for this trip have not been added yet.
              </li>
            ) : null}
            {(destination.places || []).map((place, index) => (
              <li key={place.name} className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">
                  {index + 1}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">{place.name}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{place.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
