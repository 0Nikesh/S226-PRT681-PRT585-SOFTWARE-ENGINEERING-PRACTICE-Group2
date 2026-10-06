"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/components/AuthProvider";
import { formatMoney, getDestinationById, localDetailsFor } from "@/lib/destinations";
import { getDestination } from "@/lib/api";
import { getHotel, mapsUrl, nightsBetween, saveBooking } from "@/lib/hotels";

function todayValue() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export default function BookHotelPage() {
  const params = useParams();
  const router = useRouter();
  const { user, ready } = useAuth();
  const staticDestination = getDestinationById(params.id);
  const staticHotel = getHotel(params.id, params.hotelId);
  const [destination, setDestination] = useState(staticDestination);
  const [hotel, setHotel] = useState(staticHotel);
  const [status, setStatus] = useState(staticDestination && staticHotel ? "ready" : "loading");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [error, setError] = useState("");
  const [booking, setBooking] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let active = true;

    getDestination(params.id)
      .then((remote) => {
        if (!active) {
          return;
        }

        const local = staticDestination || localDetailsFor(remote?.name);
        const nextDestination = remote || local;
        const nextHotel =
          (remote?.hotels || []).find((item) => String(item.id) === String(params.hotelId)) || staticHotel;

        if (!nextDestination || !nextHotel) {
          setStatus("missing");
          return;
        }

        setDestination({
          ...nextDestination,
          overview: local?.overview || nextDestination.description || "",
        });
        setHotel(nextHotel);
        setStatus("ready");
      })
      .catch(() => {
        if (!active) {
          return;
        }

        if (staticDestination && staticHotel) {
          setStatus("ready");
          return;
        }

        setStatus("missing");
      });

    return () => {
      active = false;
    };
  }, [params.id, params.hotelId, staticDestination, staticHotel]);

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-[#f7f9fc]">
        <Navbar />
        <p className="px-6 py-16 text-center text-sm text-gray-500">Loading hotel...</p>
      </main>
    );
  }

  if (status === "missing" || !destination || !hotel) {
    return (
      <main className="min-h-screen bg-[#f7f9fc]">
        <Navbar />
        <section className="mx-auto max-w-lg px-6 py-16 text-center">
          <h1 className="font-serif text-3xl font-semibold">Hotel not found</h1>
          <Link href="/destinations" className="mt-4 inline-flex text-sm font-semibold text-sky-600">
            Back to destinations
          </Link>
        </section>
      </main>
    );
  }

  const nights = nightsBetween(checkIn, checkOut);
  const guestCount = Number(guests);
  const total = nights > 0 ? nights * hotel.pricePerNight : 0;
  const loginHref = `/login?next=${encodeURIComponent(`/destinations/${destination.id}/hotels/${hotel.id}`)}`;

  function handleBook(event) {
    event.preventDefault();
    setError("");

    if (!ready || !user) {
      setLoginOpen(true);
      return;
    }

    if (!checkIn || !checkOut || nights < 1) {
      setError("Choose a check-out date after the check-in date.");
      return;
    }

    if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 8) {
      setError("Guests must be between 1 and 8.");
      return;
    }

    const saved = {
      id: `booking-${Date.now()}`,
      hotelId: hotel.id,
      hotelName: hotel.name,
      area: hotel.area || "",
      mapsQuery: hotel.mapsQuery || `${hotel.name}, ${destination.name}`,
      destinationId: destination.id,
      destinationName: destination.name,
      checkIn,
      checkOut,
      guests: guestCount,
      nights,
      pricePerNight: hotel.pricePerNight,
      total,
      guestName: user.name,
      userId: user.userId,
      createdAt: new Date().toISOString(),
    };

    saveBooking(saved);
    setBooking(saved);
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
              aria-labelledby="hotel-login-title"
              className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
              onClick={(event) => event.stopPropagation()}
            >
              <h2 id="hotel-login-title" className="font-serif text-2xl font-semibold text-slate-900">
                Log in to book
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                You need to log in before booking {hotel.name}.
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
                  onClick={() => router.push(loginHref)}
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
    <main className="min-h-screen bg-[#f7f9fc]">
      <Navbar />
      <section className="mx-auto max-w-xl px-6 py-10">
        <Link href={`/destinations/${destination.id}`} className="text-sm font-medium text-sky-600">
          Back to {destination.name}
        </Link>

        <div className="mt-4 rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">{hotel.area}</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-slate-900">{hotel.name}</h1>
          <p className="mt-2 text-sm leading-6 text-gray-600">{hotel.description}</p>
          <p className="mt-3 text-sm text-slate-800">
            {Number(hotel.rating) > 0 ? `${Number(hotel.rating).toFixed(1)} / 5 · ` : ""}
            {formatMoney(hotel.pricePerNight)} per night
          </p>
          <a
            href={mapsUrl(hotel.mapsQuery || `${hotel.name}, ${destination.name}`)}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex text-sm font-semibold text-sky-600"
          >
            View on Google Maps
          </a>

          {booking ? (
            <div className="mt-6 rounded-xl bg-sky-50 p-4 text-sm text-slate-800">
              <p className="font-semibold text-slate-900">Booking confirmed</p>
              <p className="mt-2">
                {booking.hotelName} in {booking.destinationName}, {booking.nights} night
                {booking.nights === 1 ? "" : "s"}, {booking.guests} guest
                {booking.guests === 1 ? "" : "s"}.
              </p>
              <p className="mt-1">
                {booking.checkIn} to {booking.checkOut} · {formatMoney(booking.total)}
              </p>
              <Link href="/bookings" className="mt-3 inline-flex font-semibold text-sky-700">
                See your bookings
              </Link>
            </div>
          ) : (
            <form onSubmit={handleBook} className="mt-6 space-y-4">
              {error ? (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                  {error}
                </p>
              ) : null}

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-800" htmlFor="check-in">
                  Check in
                  <input
                    id="check-in"
                    type="date"
                    min={todayValue()}
                    value={checkIn}
                    onChange={(event) => setCheckIn(event.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-800" htmlFor="check-out">
                  Check out
                  <input
                    id="check-out"
                    type="date"
                    min={checkIn || todayValue()}
                    value={checkOut}
                    onChange={(event) => setCheckOut(event.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  />
                </label>
              </div>

              <label className="block text-sm font-medium text-slate-800" htmlFor="guests">
                Guests
                <input
                  id="guests"
                  type="number"
                  min="1"
                  max="8"
                  value={guests}
                  onChange={(event) => setGuests(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </label>

              <p className="text-sm text-gray-600">
                {nights > 0
                  ? `${nights} night${nights === 1 ? "" : "s"} · ${formatMoney(total)} total`
                  : "Select dates to see the total."}
              </p>

              <button
                type="submit"
                className="w-full rounded-lg bg-sky-500 py-2.5 text-sm font-semibold text-white hover:bg-sky-600"
              >
                Book hotel
              </button>
            </form>
          )}
        </div>
      </section>
      {loginDialog}
    </main>
  );
}
