"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/components/AuthProvider";
import { formatMoney } from "@/lib/destinations";
import { canCancelBooking, cancelBooking, getBookings, mapsUrl } from "@/lib/hotels";

export default function BookingsPage() {
  const router = useRouter();
  const { user, ready } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [pending, setPending] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (ready && !user) {
      router.replace("/login?next=/bookings");
    }
  }, [ready, user, router]);

  useEffect(() => {
    if (user) {
      setBookings(getBookings().filter((booking) => booking.userId === user.userId));
    }
  }, [user]);

  function confirmCancel() {
    if (!pending || !canCancelBooking(pending)) {
      setPending(null);
      return;
    }

    const next = cancelBooking(pending.id);
    setBookings(next.filter((booking) => booking.userId === user.userId));
    setPending(null);
  }

  const dialog =
    pending && mounted
      ? createPortal(
          <div
            role="presentation"
            onClick={() => setPending(null)}
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
              aria-labelledby="cancel-booking-title"
              className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
              onClick={(event) => event.stopPropagation()}
            >
              <h2 id="cancel-booking-title" className="font-serif text-2xl font-semibold text-slate-900">
                Cancel this booking?
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                {pending.hotelName} in {pending.destinationName} checks out on {pending.checkOut}. This removes the stay from your bookings.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPending(null)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                >
                  Keep booking
                </button>
                <button
                  type="button"
                  onClick={confirmCancel}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Cancel booking
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
      <section className="mx-auto max-w-3xl px-6 py-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">Your stays</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold text-slate-900">Hotel bookings</h1>
        <p className="mt-2 text-sm text-gray-500">A booking can be cancelled when check-out is at least 3 days away.</p>

        {!ready || !user ? (
          <p className="mt-6 text-sm text-gray-500">Loading your bookings...</p>
        ) : bookings.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-600">You have not booked a hotel yet.</p>
            <Link href="/destinations" className="mt-4 inline-flex text-sm font-semibold text-sky-600">
              Browse destinations
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {bookings.map((booking) => {
              const allowed = canCancelBooking(booking);
              const place = booking.mapsQuery || `${booking.hotelName}, ${booking.destinationName}`;

              return (
                <article key={booking.id} className="rounded-2xl bg-white p-5 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900">{booking.hotelName}</h2>
                  <p className="mt-1 text-sm text-sky-600">
                    {booking.destinationName}
                    {booking.area ? ` · ${booking.area}` : ""}
                  </p>
                  <p className="mt-3 text-sm text-slate-700">
                    {booking.checkIn} to {booking.checkOut} · {booking.nights} night{booking.nights === 1 ? "" : "s"} · {booking.guests} guest{booking.guests === 1 ? "" : "s"}
                  </p>
                  <p className="mt-1 text-sm text-slate-700">
                    {formatMoney(booking.pricePerNight)} per night · {formatMoney(booking.total)} total
                  </p>
                  <a
                    href={mapsUrl(place)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex text-sm font-semibold text-sky-600"
                  >
                    Open {booking.hotelName} in Google Maps
                  </a>
                  {allowed ? (
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => setPending(booking)}
                        className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                      >
                        Cancel booking
                      </button>
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-gray-500">
                      This stay cannot be cancelled. Check-out is within 3 days.
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
      {dialog}
    </main>
  );
}
