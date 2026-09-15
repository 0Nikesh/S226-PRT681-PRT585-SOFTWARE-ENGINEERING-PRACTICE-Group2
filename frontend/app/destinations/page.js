"use client";

import Navbar from "@/components/Navbar";
import DestinationCard from "@/components/DestinationCard";
import Footer from "@/components/Footer";

const destinations = [
  {
    id: 1,
    name: "Sydney",
    country: "Australia",
    image: "Sydney.jpg",
    rating: 4.8,
    price: 180,
  },
  {
    id: 2,
    name: "Melbourne",
    country: "Australia",
    image: "Melbourne.jpg",
    rating: 4.7,
    price: 160,
  },
  {
    id: 3,
    name: "Cairns",
    country: "Australia",
    image: "Cairns.jpg",
    rating: 4.9,
    price: 140,
  },
  {
    id: 4,
    name: "Perth",
    country: "Australia",
    image: "Perth.jpg",
    rating: 4.6,
    price: 150,
  },
  {
    id: 5,
    name: "Gold Coast",
    country: "Australia",
    image: "Goldcoast.jpg",
    rating: 4.7,
    price: 130,
  },
  {
    id: 6,
    name: "Hobart",
    country: "Australia",
    image: "Hobart.jpg",
    rating: 4.8,
    price: 145,
  },
];

export default function DestinationsPage() {
  return (
    <main>

      <Navbar />

      {/* Search summary */}
      <div className="border-b bg-white px-6 py-4">

        <div className="mx-auto flex max-w-7xl items-center justify-between">

          <p className="text-sm text-gray-600">
            🔍 Australian destinations
            <span className="mx-2">•</span>
            82 destinations
          </p>

          <button className="rounded-lg border px-4 py-2 text-xs">
            Modify Search
          </button>

        </div>

      </div>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[240px_1fr]">

        {/* Filter sidebar */}
        <aside className="rounded-xl bg-white p-5 shadow-sm">

          <h3 className="font-semibold">
            Filters
          </h3>

          <div className="mt-6 border-b pb-5">

            <p className="text-sm font-semibold">
              Price Range
            </p>

            <input
              type="range"
              min="50"
              max="500"
              className="mt-4 w-full"
            />

            <div className="mt-2 flex justify-between text-xs text-gray-500">
              <span>$50</span>
              <span>$500+</span>
            </div>

          </div>

          <div className="border-b py-5">

            <p className="text-sm font-semibold">
              Travel Type
            </p>

            <div className="mt-4 space-y-3 text-sm">

              <label className="flex gap-2">
                <input type="checkbox" />
                Beach & Lagoon
              </label>

              <label className="flex gap-2">
                <input type="checkbox" />
                Mountain
              </label>

              <label className="flex gap-2">
                <input type="checkbox" />
                City Escape
              </label>

              <label className="flex gap-2">
                <input type="checkbox" />
                Cultural
              </label>

            </div>

          </div>

          <div className="border-b py-5">

            <p className="text-sm font-semibold">
              Rating
            </p>

            <div className="mt-4 space-y-3 text-sm">

              <label className="flex gap-2">
                <input type="checkbox" />
                ★★★★★
              </label>

              <label className="flex gap-2">
                <input type="checkbox" />
                ★★★★☆
              </label>

              <label className="flex gap-2">
                <input type="checkbox" />
                ★★★☆☆
              </label>

            </div>

          </div>

          <div className="pt-5">

            <p className="text-sm font-semibold">
              Budget Tier
            </p>

            <div className="mt-4 space-y-3 text-sm">

              <label className="flex gap-2">
                <input type="checkbox" />
                Budget
              </label>

              <label className="flex gap-2">
                <input type="checkbox" />
                Moderate
              </label>

              <label className="flex gap-2">
                <input type="checkbox" />
                Premium
              </label>

            </div>

          </div>

        </aside>

        {/* Destination results */}
        <div>

          <div className="mb-5 flex items-center justify-between">

            <p className="text-sm text-gray-600">
              Showing destinations
            </p>

            <select className="rounded-lg border bg-white px-3 py-2 text-xs">
              <option>Sort by Rating</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>

          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {destinations.map((destination) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
              />
            ))}

          </div>

        </div>

      </section>

      <Footer />

    </main>
  );
}

// import Navbar from "@/components/Navbar";
// import DestinationCard from "@/components/DestinationCard";
// import Footer from "@/components/Footer";
// import { getDestinations } from "@/lib/api";

// export default async function DestinationsPage() {
//   let destinations = [];

//   try {
//     const result = await getDestinations();

//     destinations = result.data || [];
//   } catch (error) {
//     console.error("Error loading destinations:", error);
//   }

//   return (
//     <main>
//       <Navbar />

//       <section className="mx-auto max-w-7xl px-6 py-10">

//         <h1 className="mb-2 text-3xl font-semibold">
//           Australian Destinations
//         </h1>

//         <p className="mb-8 text-gray-500">
//           Explore destinations available in TripMate.
//         </p>

//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

//           {destinations.map((destination) => (
//             <DestinationCard
//               key={destination.destination_id}
//               destination={destination}
//             />
//           ))}

//         </div>

//       </section>

//       <Footer />
//     </main>
//   );
// } 