"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import AuthShell from "@/components/AuthShell";
import { useAuth } from "@/components/AuthProvider";
import { pathAfterAuth, register } from "@/lib/auth";

const inputClass =
  "mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-sky-500";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  country: "",
  password: "",
  confirmPassword: "",
};

function validate(form) {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = "Name is required.";
  }

  if (!form.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@gmail\.com$/i.test(form.email.trim())) {
    errors.email = "Use a Gmail address ending in @gmail.com.";
  }

  if (!form.phone.trim()) {
    errors.phone = "Phone number is required.";
  }

  if (!form.country.trim()) {
    errors.country = "Country is required.";
  }

  if (!form.password) {
    errors.password = "Password is required.";
  } else if (form.password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  } else if (
    !/[A-Z]/.test(form.password) ||
    !/[a-z]/.test(form.password) ||
    !/\d/.test(form.password)
  ) {
    errors.password =
      "Password must include an uppercase letter, a lowercase letter, and a number.";
  }

  if (form.confirmPassword !== form.password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

function Field({ id, label, error, children }) {
  return (
    <label className="block text-sm font-medium text-slate-800" htmlFor={id}>
      {label}
      {children}
      {error ? <span className="mt-1 block text-xs font-normal text-red-600">{error}</span> : null}
    </label>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<AuthShell title="Create your account" subtitle="Register to save trips and pick up planning where you left off." />}>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(field) {
    return (event) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      const session = await register({
        name: form.name.trim(),
        email: form.email.trim(),
        phoneNumber: form.phone.trim(),
        country: form.country.trim(),
        password: form.password,
      });
      signIn(session);
      router.push(pathAfterAuth(searchParams));
    } catch (err) {
      setError(err.message || "Registration failed.");
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Register to save trips and pick up planning where you left off."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href={
              searchParams.get("next")
                ? `/login?next=${encodeURIComponent(searchParams.get("next"))}`
                : "/login"
            }
            className="font-semibold text-sky-600"
          >
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}

        <Field id="name" label="Name" error={errors.name}>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={update("name")}
            className={inputClass}
          />
        </Field>

        <Field id="email" label="Email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={update("email")}
            className={inputClass}
            placeholder="name@gmail.com"
          />
        </Field>

        <Field id="phone" label="Phone number" error={errors.phone}>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={update("phone")}
            className={inputClass}
          />
        </Field>

        <Field id="country" label="Country" error={errors.country}>
          <input
            id="country"
            name="country"
            type="text"
            autoComplete="country-name"
            value={form.country}
            onChange={update("country")}
            className={inputClass}
          />
        </Field>

        <Field id="password" label="Password" error={errors.password}>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={update("password")}
            className={inputClass}
          />
        </Field>

        <p className="-mt-2 text-xs text-gray-500">
          At least 6 characters, with an uppercase letter, a lowercase letter, and a number.
        </p>

        <Field id="confirm-password" label="Confirm password" error={errors.confirmPassword}>
          <input
            id="confirm-password"
            name="confirm-password"
            type="password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={update("confirmPassword")}
            className={inputClass}
          />
        </Field>

        <button
          id="register-button"
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-sky-500 py-2.5 text-sm font-semibold text-white hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Creating account..." : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}
