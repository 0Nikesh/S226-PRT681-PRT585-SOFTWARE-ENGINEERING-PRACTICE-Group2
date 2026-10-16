"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import AuthShell from "@/components/AuthShell";
import { useAuth } from "@/components/AuthProvider";
import { login, pathAfterAuth } from "@/lib/auth";

const inputClass =
  "mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-sky-500";

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthShell title="Welcome back" subtitle="Sign in with the email and password on your TripMate account." />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    setSubmitting(true);

    try {
      const session = await login({ email: email.trim(), password });
      signIn(session);
      router.push(pathAfterAuth(searchParams));
    } catch (err) {
      setError(err.message || "Login failed.");
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in with the email and password on your TripMate account."
      footer={
        <>
          New to TripMate?{" "}
          <Link
            href={
              searchParams.get("next")
                ? `/register?next=${encodeURIComponent(searchParams.get("next"))}`
                : "/register"
            }
            className="font-semibold text-sky-600"
          >
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {searchParams.get("expired") === "1" ? (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800" role="status">
            Your sign-in expired, so the photo upload was rejected. Sign in again, then choose the image.
          </p>
        ) : null}
        {error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}

        <label className="block text-sm font-medium text-slate-800" htmlFor="email">
          Email
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClass}
            required
          />
        </label>

        <label className="block text-sm font-medium text-slate-800" htmlFor="password">
          Password
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={inputClass}
            required
          />
        </label>

        <button
          id="login-button"
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-sky-500 py-2.5 text-sm font-semibold text-white hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Signing in..." : "Log in"}
        </button>
      </form>
    </AuthShell>
  );
}
