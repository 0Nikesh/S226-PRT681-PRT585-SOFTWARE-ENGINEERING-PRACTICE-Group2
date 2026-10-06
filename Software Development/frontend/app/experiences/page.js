"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/components/AuthProvider";
import { destinations } from "@/lib/destinations";
import { getSharedExperiences, sampleExperiences, saveSharedExperience } from "@/lib/experiences";

function Stars({ value }) {
  return (
    <span className="tracking-wide" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= value ? "text-amber-500" : "text-gray-300"}>
          ★
        </span>
      ))}
    </span>
  );
}

function formatDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${date.getUTCDate()} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

function ExperiencesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, ready } = useAuth();
  const [shared, setShared] = useState([]);
  const [destinationId, setDestinationId] = useState(searchParams.get("destination") || "");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(0);
  const [error, setError] = useState("");
  const [loginOpen, setLoginOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setShared(getSharedExperiences());
  }, []);

  const experiences = useMemo(
    () => [...shared, ...sampleExperiences],
    [shared]
  );

  function openLogin() {
    setLoginOpen(true);
  }

  function goToLogin() {
    const next = destinationId
      ? `/experiences?destination=${destinationId}`
      : "/experiences";
    router.push(`/login?next=${encodeURIComponent(next)}`);
  }

  function handleShare(event) {
    event.preventDefault();
    setError("");

    if (!ready || !user) {
      openLogin();
      return;
    }

    const destination = destinations.find((item) => item.id === Number(destinationId));

    if (!destination) {
      setError("Choose a destination.");
      return;
    }

    if (!description.trim()) {
      setError("Add a short description of your experience.");
      return;
    }

    if (rating < 1 || rating > 5) {
      setError("Choose a rating from 1 to 5.");
      return;
    }

    const experience = {
      id: `user-${Date.now()}`,
      destinationId: destination.id,
      destinationName: destination.name,
      country: destination.country,
      authorName: user.name,
      description: description.trim(),
      rating,
      createdAt: new Date().toISOString(),
    };

    setShared(saveSharedExperience(experience));
    setDescription("");
    setRating(0);
    setDestinationId("");
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
              aria-labelledby="experience-login-title"
              className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
              onClick={(event) => event.stopPropagation()}
            >
              <h2 id="experience-login-title" className="font-serif text-2xl font-semibold text-slate-900">
                Log in to share
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                You need to log in before sharing a destination experience.
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
                  onClick={goToLogin}
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

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[320px_1fr]">
        <form onSubmit={handleShare} className="h-fit rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">Share</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-slate-900">Your experience</h1>
          <p className="mt-2 text-sm text-gray-500">
            Tell other travellers what the destination was like and how you would rate it.
          </p>

          {error ? (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {error}
            </p>
          ) : null}

          <label className="mt-5 block text-sm font-medium text-slate-800" htmlFor="experience-destination">
            Destination
            <select
              id="experience-destination"
              value={destinationId}
              onChange={(event) => setDestinationId(event.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-sky-500"
            >
              <option value="">Choose a destination</option>
              {destinations.map((destination) => (
                <option key={destination.id} value={destination.id}>
                  {destination.name}, {destination.country}
                </option>
              ))}
            </select>
          </label>

          <label className="mt-4 block text-sm font-medium text-slate-800" htmlFor="experience-description">
            Description
            <textarea
              id="experience-description"
              rows="5"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What did you do, and what should someone else know?"
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-sky-500"
            />
          </label>

          <fieldset className="mt-4">
            <legend className="text-sm font-medium text-slate-800">Destination rating</legend>
            <div className="mt-2 flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  aria-label={`Rate ${star} out of 5`}
                  className={`h-10 w-10 rounded-lg border text-lg ${
                    star <= rating
                      ? "border-amber-300 bg-amber-50 text-amber-500"
                      : "border-gray-200 bg-white text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </fieldset>

          <button
            type="submit"
            className="mt-6 w-full rounded-lg bg-sky-500 py-2.5 text-sm font-semibold text-white hover:bg-sky-600"
          >
            Share experience
          </button>
        </form>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">From travellers</p>
          <h2 className="mt-2 font-serif text-4xl font-semibold text-slate-900">Experiences</h2>
          <p className="mt-2 text-sm text-gray-500">
            {experiences.length} shared {experiences.length === 1 ? "story" : "stories"} about destinations.
          </p>

          <div className="mt-6 space-y-4">
            {experiences.map((experience) => (
              <article key={experience.id} className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-gray-500">{experience.authorName}</p>
                    <h3 className="mt-1 text-xl font-semibold text-slate-900">
                      <Link href={`/destinations/${experience.destinationId}`} className="hover:text-sky-600">
                        {experience.destinationName}
                      </Link>
                    </h3>
                    <p className="text-sm text-sky-600">{experience.country}</p>
                  </div>
                  <div className="text-right">
                    <Stars value={experience.rating} />
                    <p className="mt-1 text-xs text-gray-500">{formatDate(experience.createdAt)}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-700">{experience.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      {loginDialog}
    </main>
  );
}

export default function ExperiencesPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#f7f9fc]">
          <Navbar />
          <p className="px-6 py-16 text-center text-sm text-gray-500">Loading experiences...</p>
        </main>
      }
    >
      <ExperiencesPageContent />
    </Suspense>
  );
}
