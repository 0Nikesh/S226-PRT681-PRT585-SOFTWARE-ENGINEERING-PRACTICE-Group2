"use client";

import { useRouter } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import TripForm from "@/components/TripForm";
import { createDestination } from "@/lib/api";

export default function PostDestinationPage() {
  const router = useRouter();

  return (
    <AdminShell title="Add a trip">
      <p className="mb-6 max-w-2xl text-sm text-slate-500">
        Enter the trip, prices, Google Maps place, and the hotels travellers can open or book.
      </p>
      <TripForm
        submitLabel="Save trip"
        onSubmit={async (payload) => {
          await createDestination(payload);
          router.push("/admin");
        }}
      />
    </AdminShell>
  );
}
