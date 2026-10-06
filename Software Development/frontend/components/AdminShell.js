"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { sessionExpired, tokenIsCurrent } from "@/lib/auth";

const links = [
  { href: "/admin", label: "Trips" },
  { href: "/admin/destinations", label: "Add trip" },
];

export default function AdminShell({ title, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, ready, signOut } = useAuth();

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (!user) {
      router.replace("/login?next=/admin");
      return;
    }

    if (!tokenIsCurrent(user.token)) {
      sessionExpired();
    }
  }, [ready, user, router]);

  function handleSignOut() {
    signOut();
    router.push("/");
  }

  if (!ready || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 text-sm text-slate-500">
        Loading admin panel...
      </main>
    );
  }

  if (user.role !== "Admin") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
        <section className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Admin only</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-slate-900">This page is for admins</h1>
          <p className="mt-3 text-sm text-slate-500">
            Sign in with the admin account to add trip information and prices.
          </p>
          <Link href="/destinations" className="mt-6 inline-flex text-sm font-semibold text-sky-600">
            Back to destinations
          </Link>
        </section>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <aside className="flex flex-col bg-slate-900 text-white md:min-h-screen md:w-64">
        <div className="border-b border-white/10 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-300">TripMate</p>
          <p className="mt-1 font-serif text-2xl">Admin</p>
          <p className="mt-2 truncate text-sm text-slate-300">{user.name}</p>
        </div>

        <nav className="flex gap-2 overflow-x-auto px-4 py-4 md:block md:space-y-1">
          {links.map((link) => {
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-lg px-3 py-2 text-sm font-medium ${
                  active ? "bg-white text-slate-900" : "text-slate-200 hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex gap-4 border-t border-white/10 px-6 py-4 text-sm md:flex-col md:gap-3">
          <Link href="/" className="text-slate-300 hover:text-white">
            View traveller site
          </Link>
          <button type="button" onClick={handleSignOut} className="text-left text-slate-300 hover:text-white">
            Sign out
          </button>
        </div>
      </aside>

      <section className="min-w-0 flex-1 px-6 py-8 md:px-10">
        <h1 className="font-serif text-3xl font-semibold text-slate-900">{title}</h1>
        <div className="mt-6">{children}</div>
      </section>
    </div>
  );
}
