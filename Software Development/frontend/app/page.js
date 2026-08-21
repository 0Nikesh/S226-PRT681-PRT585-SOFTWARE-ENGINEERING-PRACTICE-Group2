import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import DestinationCard from "@/components/DestinationCard";
import Footer from "@/components/Footer";

const popularDestinations = [
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
];

export default function Home() {
  return (
    <main>

      <Navbar />

      <Hero />

      {/* Popular destinations */}
      <section className="mx-auto max-w-7xl px-6 py-16">

        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">
            Handpicked destinations
          </p>

          <h2 className="mt-2 font-serif text-3xl font-semibold">
            Popular Destinations
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {popularDestinations.map((destination) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
            />
          ))}

        </div>

      </section>

      <Footer />

    </main>
  );
}