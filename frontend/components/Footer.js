export default function Footer() {
  return (
    <footer className="bg-slate-950 px-6 py-12 text-white">

      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">

        <div className="md:col-span-2">

          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-sky-500">
              ✈
            </div>

            <span className="font-serif text-xl">
              TripMate
            </span>
          </div>

          <p className="mt-4 max-w-sm text-sm leading-6 text-gray-400">
            Plan your perfect trip, discover amazing destinations,
            and create unforgettable travel experiences.
          </p>

        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold">
            Destinations
          </h3>

          <div className="space-y-2 text-sm text-gray-400">
            <p>Sydney</p>
            <p>Melbourne</p>
            <p>Cairns</p>
            <p>Perth</p>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold">
            Contact
          </h3>

          <div className="space-y-2 text-sm text-gray-400">
            <p>hello@tripmate.com</p>
            <p>+61 400 000 000</p>
          </div>
        </div>

      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-gray-800 pt-6 text-xs text-gray-500">
        © 2026 TripMate. All rights reserved.
      </div>

    </footer>
  );
}