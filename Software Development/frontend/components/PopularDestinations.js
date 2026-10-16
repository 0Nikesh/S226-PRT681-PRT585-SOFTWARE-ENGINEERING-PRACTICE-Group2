"use client";

import { useEffect, useState } from "react";
import DestinationCard from "@/components/DestinationCard";
import { getDestinations } from "@/lib/api";
import { mergeCatalog } from "@/lib/destinations";

export default function PopularDestinations() {
  const [popular, setPopular] = useState([]);

  useEffect(() => {
    let active = true;

    getDestinations()
      .then((posted) => {
        if (!active) {
          return;
        }

        const ranked = [...mergeCatalog(posted)]
          .sort((left, right) => right.averageVisitorsPerWeek - left.averageVisitorsPerWeek)
          .slice(0, 4);

        setPopular(ranked);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">
          Handpicked destinations
        </p>
        <h2 className="mt-2 font-serif text-3xl font-semibold">Popular Destinations</h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {popular.map((destination) => (
          <DestinationCard key={destination.id} destination={destination} />
        ))}
      </div>
    </section>
  );
}
