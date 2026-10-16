"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function Navbar() {
  const pathname = usePathname();
  const { user, ready } = useAuth();

  return (
    <nav className="flex h-16 items-center justify-between border-b bg-white px-6 md:px-10">
      
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-sky-500 text-white">
          ✈
        </div>

        <span className="font-serif text-xl font-semibold">
          TripMate
        </span>
      </Link>

      {/* Navigation */}
      <div className="flex gap-4 overflow-x-auto text-sm md:gap-8">

        <Link
          href="/"
          className={pathname === "/" ? "text-sky-600" : "text-gray-600"}
        >
          Explore
        </Link>

        <Link
          href="/destinations"
          className={
            pathname === "/destinations"
              ? "text-sky-600"
              : "text-gray-600"
          }
        >
          Destinations
        </Link>

        <Link
          href="/experiences"
          className={pathname === "/experiences" ? "text-sky-600" : "text-gray-600"}
        >
          Experiences
        </Link>

      </div>

      {/* Right side */}
      <div className="flex items-center gap-4 text-sm">
        {!ready ? (
          <div className="h-8 w-16" />
        ) : user ? (
          <div className="flex items-center gap-3">
            <Link
              href="/bookings"
              className={pathname === "/bookings" ? "font-semibold text-sky-600" : "text-gray-600"}
            >
              Bookings
            </Link>
            <Link
              href="/watchlist"
              className={pathname === "/watchlist" ? "font-semibold text-sky-600" : "text-gray-600"}
            >
              Saved
            </Link>
            {user.role === "Admin" ? (
              <Link
                href="/admin"
                className={
                  pathname.startsWith("/admin")
                    ? "font-semibold text-sky-600"
                    : "font-medium text-gray-600"
                }
              >
                Admin
              </Link>
            ) : null}
            <Link
              href="/profile"
              className="flex items-center gap-2 font-medium text-slate-800"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-50">
                👤
              </span>
              <span className="hidden max-w-32 truncate md:inline">{user.name}</span>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className={pathname === "/login" ? "font-medium text-sky-600" : "text-gray-600"}
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-sky-500 px-3 py-1.5 font-semibold text-white hover:bg-sky-600"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>

    </nav>
  );
}