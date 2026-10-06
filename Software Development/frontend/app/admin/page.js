"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import { deleteDestination, getDestinations } from "@/lib/api";
import { formatMoney } from "@/lib/destinations";

export default function AdminTripsPage() {
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getDestinations()
      .then((items) => {
        if (active) {
          setTrips(items);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message || "Could not load trips.");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleDelete(trip) {
    const confirmed = window.confirm(`Remove ${trip.name}? Travellers will no longer see this trip.`);

    if (!confirmed) {
      return;
    }

    setError("");

    try {
      await deleteDestination(trip.id);
      setTrips((current) => current.filter((item) => item.id !== trip.id));
    } catch (err) {
      setError(err.message || "Could not remove this trip.");
    }
  }

  return (
    <AdminShell title="Trip catalogue">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-xl text-sm text-slate-500">
          Trips you add here are stored in the database. Travellers keep their own destinations page, and new trips appear there as well.
        </p>
        <Link
          href="/admin/destinations"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          Add trip
        </Link>
      </div>

      {error ? (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      {loading ? <p className="mt-6 text-sm text-slate-500">Loading trips...</p> : null}

      {!loading && trips.length === 0 ? (
        <p className="mt-6 rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-sm">
          No trips yet. Add the city, prices, season, and description.
        </p>
      ) : null}

      {trips.length > 0 ? (
        <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Photo</th>
                <th className="px-4 py-3 font-semibold">Trip</th>
                <th className="px-4 py-3 font-semibold">Prices / day</th>
                <th className="px-4 py-3 font-semibold">Average</th>
                <th className="px-4 py-3 font-semibold">Season</th>
                <th className="px-4 py-3 font-semibold">Days</th>
                <th className="px-4 py-3 font-semibold" />
              </tr>
            </thead>
            <tbody>
              {trips.map((trip) => (
                <tr key={trip.id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    {trip.imageUrl ? (
                      <img src={trip.imageUrl} alt="" className="h-14 w-20 rounded-md object-cover" />
                    ) : (
                      <div className="h-14 w-20 rounded-md bg-slate-100" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{trip.name}</p>
                    <p className="text-xs text-slate-500">
                      {trip.country}
                      {trip.continent ? ` · ${trip.continent}` : ""}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {formatMoney(trip.minPrice)} – {formatMoney(trip.maxPrice)}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {formatMoney(trip.averagePricePerDay)}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{trip.bestSeason || "—"}</td>
                  <td className="px-4 py-3 text-slate-700">{trip.destinationTime}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/destinations/${trip.id}`} className="mr-4 text-sm font-semibold text-sky-700">
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(trip)}
                      className="text-sm font-semibold text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </AdminShell>
  );
}
