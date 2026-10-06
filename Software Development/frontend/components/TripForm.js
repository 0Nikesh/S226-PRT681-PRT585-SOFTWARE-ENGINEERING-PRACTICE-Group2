"use client";

import { useMemo, useState } from "react";
import { uploadTripImage } from "@/lib/api";

const seasons = ["Spring", "Summer", "Autumn", "Winter"];

const emptyHotel = {
  name: "",
  area: "",
  pricePerNight: "",
  description: "",
  mapsQuery: "",
};

export const emptyTripForm = {
  name: "",
  country: "Australia",
  continent: "Oceania",
  destinationTime: "4",
  minPrice: "",
  maxPrice: "",
  averageVisitorsPerWeek: "",
  bestSeason: "Summer",
  description: "",
  imageUrl: "",
  mapsQuery: "",
  hotels: [],
};

const inputClass =
  "mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-sky-500";

function Field({ id, label, hint, children }) {
  return (
    <label className="block text-sm font-medium text-slate-800" htmlFor={id}>
      {label}
      {children}
      {hint ? <span className="mt-1 block text-xs font-normal text-gray-500">{hint}</span> : null}
    </label>
  );
}

export function tripToForm(trip) {
  return {
    name: trip.name || "",
    country: trip.country || "",
    continent: trip.continent || "",
    destinationTime: String(trip.destinationTime || 1),
    minPrice: String(trip.minPrice ?? ""),
    maxPrice: String(trip.maxPrice ?? ""),
    averageVisitorsPerWeek: String(trip.averageVisitorsPerWeek ?? ""),
    bestSeason: trip.bestSeason || "Summer",
    description: trip.description || "",
    imageUrl: trip.imageUrl || "",
    mapsQuery: trip.mapsQuery || "",
    hotels: (trip.hotels || []).map((hotel) => ({
      name: hotel.name || "",
      area: hotel.area || "",
      pricePerNight: String(hotel.pricePerNight ?? ""),
      description: hotel.description || "",
      mapsQuery: hotel.mapsQuery || "",
    })),
  };
}

export default function TripForm({ initial, submitLabel, onSubmit }) {
  const [form, setForm] = useState(initial || emptyTripForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const averagePrice = useMemo(() => {
    const min = Number(form.minPrice);
    const max = Number(form.maxPrice);

    if (!Number.isFinite(min) || !Number.isFinite(max) || form.minPrice === "" || form.maxPrice === "") {
      return null;
    }

    if (max < min) {
      return null;
    }

    return ((min + max) / 2).toFixed(2);
  }, [form.minPrice, form.maxPrice]);

  function update(field) {
    return (event) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
    };
  }

  function updateHotel(index, field, value) {
    setForm((current) => ({
      ...current,
      hotels: current.hotels.map((hotel, hotelIndex) =>
        hotelIndex === index ? { ...hotel, [field]: value } : hotel
      ),
    }));
  }

  async function handleImageFile(event) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setError("");
    setUploading(true);

    try {
      const imageUrl = await uploadTripImage(file);
      setForm((current) => ({ ...current, imageUrl }));
    } catch (err) {
      setError(err.message || "Could not upload that image.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const minPrice = Number(form.minPrice);
    const maxPrice = Number(form.maxPrice);
    const visitors = Number(form.averageVisitorsPerWeek);
    const days = Number(form.destinationTime);

    if (!form.name.trim() || !form.country.trim() || !form.continent.trim()) {
      setError("Name, country, and continent are required.");
      return;
    }

    if (!Number.isFinite(minPrice) || !Number.isFinite(maxPrice) || minPrice < 0 || maxPrice < minPrice) {
      setError("Enter a minimum price and a maximum price that is at least as high.");
      return;
    }

    if (!Number.isInteger(visitors) || visitors < 0) {
      setError("Average visitors per week must be a whole number.");
      return;
    }

    if (!Number.isInteger(days) || days < 1 || days > 365) {
      setError("Recommended days must be between 1 and 365.");
      return;
    }

    const hotels = [];

    for (const hotel of form.hotels) {
      if (!hotel.name.trim()) {
        continue;
      }

      const pricePerNight = Number(hotel.pricePerNight);

      if (!Number.isFinite(pricePerNight) || pricePerNight < 0) {
        setError(`Enter a nightly price for ${hotel.name.trim()}.`);
        return;
      }

      hotels.push({
        name: hotel.name.trim(),
        area: hotel.area.trim(),
        pricePerNight,
        description: hotel.description.trim(),
        mapsQuery: hotel.mapsQuery.trim() || hotel.name.trim(),
      });
    }

    setSubmitting(true);

    try {
      await onSubmit({
        name: form.name.trim(),
        country: form.country.trim(),
        continent: form.continent.trim(),
        destinationTime: days,
        minPrice,
        maxPrice,
        averageVisitorsPerWeek: visitors,
        bestSeason: form.bestSeason,
        description: form.description.trim(),
        imageUrl: form.imageUrl.trim() || null,
        mapsQuery: form.mapsQuery.trim(),
        hotels,
      });
    } catch (err) {
      setError(err.message || "Could not save this trip.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4 rounded-2xl bg-white p-6 shadow-sm">
      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <Field id="name" label="Destination name">
        <input id="name" value={form.name} onChange={update("name")} className={inputClass} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="country" label="Country">
          <input id="country" value={form.country} onChange={update("country")} className={inputClass} />
        </Field>
        <Field id="continent" label="Continent">
          <input id="continent" value={form.continent} onChange={update("continent")} className={inputClass} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="min-price" label="Minimum price per day (AUD)">
          <input id="min-price" type="number" min="0" step="0.01" value={form.minPrice} onChange={update("minPrice")} className={inputClass} />
        </Field>
        <Field id="max-price" label="Maximum price per day (AUD)">
          <input id="max-price" type="number" min="0" step="0.01" value={form.maxPrice} onChange={update("maxPrice")} className={inputClass} />
        </Field>
      </div>

      <div className="rounded-lg bg-sky-50 px-4 py-3 text-sm text-sky-900">
        Average price per day:{" "}
        <span className="font-semibold">
          {averagePrice ? `AUD $${Number(averagePrice).toLocaleString("en-AU")}` : "Enter both prices"}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="visitors" label="Average visitors per week">
          <input id="visitors" type="number" min="0" step="1" value={form.averageVisitorsPerWeek} onChange={update("averageVisitorsPerWeek")} className={inputClass} />
        </Field>
        <Field id="best-season" label="Best season">
          <select id="best-season" value={form.bestSeason} onChange={update("bestSeason")} className={inputClass}>
            {seasons.map((season) => (
              <option key={season} value={season}>
                {season}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field id="days" label="Recommended days" hint="How long a typical trip lasts.">
        <input id="days" type="number" min="1" max="365" value={form.destinationTime} onChange={update("destinationTime")} className={inputClass} />
      </Field>

      <Field id="description" label="Description">
        <textarea id="description" rows="3" value={form.description} onChange={update("description")} className={inputClass} />
      </Field>

      <Field id="maps-query" label="Google Maps place" hint="City, address, or landmark. Travellers open this in Google Maps.">
        <input id="maps-query" value={form.mapsQuery} onChange={update("mapsQuery")} className={inputClass} placeholder="Sydney Opera House" />
      </Field>

      <Field id="image-file" label="Photo" hint="JPEG, PNG, WEBP, or GIF from your computer, up to 5 MB.">
        <input id="image-file" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImageFile} className={inputClass} />
      </Field>

      {uploading ? <p className="text-sm text-slate-500">Uploading photo...</p> : null}
      {form.imageUrl ? <img src={form.imageUrl} alt="Trip preview" className="h-40 w-full rounded-lg object-cover" /> : null}

      <div className="rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-800">Hotels</p>
            <p className="text-xs text-slate-500">Each hotel can open in Google Maps and be booked on the trip page.</p>
          </div>
          <button
            type="button"
            onClick={() => setForm((current) => ({ ...current, hotels: [...current.hotels, { ...emptyHotel }] }))}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-800"
          >
            Add hotel
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {form.hotels.length === 0 ? (
            <p className="text-sm text-slate-500">No hotels yet.</p>
          ) : null}
          {form.hotels.map((hotel, index) => (
            <div key={index} className="space-y-3 rounded-lg bg-slate-50 p-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field id={`hotel-name-${index}`} label="Hotel name">
                  <input id={`hotel-name-${index}`} value={hotel.name} onChange={(event) => updateHotel(index, "name", event.target.value)} className={inputClass} />
                </Field>
                <Field id={`hotel-area-${index}`} label="Area">
                  <input id={`hotel-area-${index}`} value={hotel.area} onChange={(event) => updateHotel(index, "area", event.target.value)} className={inputClass} />
                </Field>
              </div>
              <Field id={`hotel-price-${index}`} label="Price per night (AUD)">
                <input id={`hotel-price-${index}`} type="number" min="0" step="0.01" value={hotel.pricePerNight} onChange={(event) => updateHotel(index, "pricePerNight", event.target.value)} className={inputClass} />
              </Field>
              <Field id={`hotel-maps-${index}`} label="Google Maps search" hint="Hotel name and city if the name alone is not specific.">
                <input id={`hotel-maps-${index}`} value={hotel.mapsQuery} onChange={(event) => updateHotel(index, "mapsQuery", event.target.value)} className={inputClass} />
              </Field>
              <Field id={`hotel-description-${index}`} label="Description">
                <textarea id={`hotel-description-${index}`} rows="2" value={hotel.description} onChange={(event) => updateHotel(index, "description", event.target.value)} className={inputClass} />
              </Field>
              <button
                type="button"
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    hotels: current.hotels.filter((_, hotelIndex) => hotelIndex !== index),
                  }))
                }
                className="text-sm font-semibold text-red-600"
              >
                Remove hotel
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting || uploading}
        className="w-full rounded-lg bg-sky-500 py-2.5 text-sm font-semibold text-white hover:bg-sky-600 disabled:opacity-60"
      >
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
