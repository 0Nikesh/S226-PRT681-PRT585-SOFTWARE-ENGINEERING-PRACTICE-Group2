"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/components/AuthProvider";
import { getProfile, getSession } from "@/lib/auth";

export default function ProfilePage() {
  const router = useRouter();
  const { user, ready, signIn, signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (ready && !user) {
      router.replace("/login?next=/profile");
    }
  }, [ready, user, router]);

  useEffect(() => {
    if (!user?.token) {
      return;
    }

    const token = user.token;
    let active = true;

    getProfile(token)
      .then((nextProfile) => {
        if (!active) {
          return;
        }

        setProfile(nextProfile);
        signIn({ ...getSession(), ...nextProfile, token });
      })
      .catch((err) => {
        if (active) {
          setError(err.message || "Could not load your profile.");
          setProfile(user);
        }
      });

    return () => {
      active = false;
    };
  }, [user?.token]);

  function handleSignOut() {
    signOut();
    router.push("/");
  }

  const account = profile || user;

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <Navbar />

      <section id="dashboard" className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">Your profile</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold text-slate-900">
          {account?.name || "Your account"}
        </h1>

        {!ready || !user ? (
          <p className="mt-6 text-sm text-gray-500">Loading your profile...</p>
        ) : (
          <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
            {error ? (
              <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                {error}
              </p>
            ) : null}

            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-gray-500">Name</dt>
                <dd className="mt-1 font-medium text-slate-900">{account.name || "—"}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Email</dt>
                <dd className="mt-1 font-medium text-slate-900">{account.email || "—"}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Phone</dt>
                <dd className="mt-1 font-medium text-slate-900">{account.phoneNumber || "—"}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Country</dt>
                <dd className="mt-1 font-medium text-slate-900">{account.country || "—"}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Role</dt>
                <dd className="mt-1 font-medium text-slate-900">{account.role || "User"}</dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={handleSignOut}
              className="mt-8 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Sign out
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
