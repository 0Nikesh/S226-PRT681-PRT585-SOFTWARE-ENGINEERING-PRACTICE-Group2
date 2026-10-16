import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <Navbar />

      <section className="mx-auto flex max-w-md flex-col px-6 py-12">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-sky-500 text-sm text-white">
              ✈
            </span>
            <span className="font-serif text-lg font-semibold">TripMate</span>
          </Link>

          <h1 className="mt-6 font-serif text-3xl font-semibold text-slate-900">
            {title}
          </h1>

          <p className="mt-2 text-sm text-gray-500">{subtitle}</p>

          <div className="mt-6">{children}</div>
        </div>

        {footer ? <div className="mt-6 text-center text-sm text-gray-600">{footer}</div> : null}
      </section>
    </main>
  );
}
