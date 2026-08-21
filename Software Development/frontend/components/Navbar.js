"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

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
      <div className="hidden gap-8 text-sm md:flex">

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

        <Link href="#" className="text-gray-600">
          Experiences
        </Link>

        <Link href="#" className="text-gray-600">
          Trips
        </Link>

        <Link href="#" className="text-gray-600">
          About
        </Link>

      </div>

      {/* Right side */}
      <div className="flex items-center gap-4 text-sm">
        <span>AUD ($)</span>

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-50">
          👤
        </div>
      </div>

    </nav>
  );
}