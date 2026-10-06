"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/components/AuthProvider";

export default function DashboardPage() {
  const router = useRouter();
  const { user, ready } = useAuth();

  useEffect(() => {
    if (ready && !user) {
      router.replace("/login");
    }
  }, [ready, user, router]);

  if (!ready || !user) {
    return (
      <main className="min-h-screen bg-[#f7f9fc]">
        <Navbar />
        <p className="px-6 py-16 text-center text-sm text-gray-500">Loading your account...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <Navbar />

      <section id="dashboard" className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">
          Your account
        </p>

        <h1 className="mt-2 font-serif text-4xl font-semibold text-slate-900">
          Welcome, {user.name}
        </h1>

        <p className="mt-3 text-sm text-gray-500">
          You are signed in and ready to plan your next trip.
        </p>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-gray-500">Name</dt>
              <dd className="mt-1 font-medium text-slate-900">{user.name}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Email</dt>
              <dd className="mt-1 font-medium text-slate-900">{user.email}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Role</dt>
              <dd className="mt-1 font-medium text-slate-900">{user.role}</dd>
            </div>
          </dl>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/destinations"
              className="inline-flex rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600"
            >
              Browse destinations
            </Link>
            {user.role === "Admin" ? (
              <Link
                href="/admin"
                className="inline-flex rounded-lg border border-sky-200 px-4 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-50"
              >
                Open admin panel
              </Link>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
