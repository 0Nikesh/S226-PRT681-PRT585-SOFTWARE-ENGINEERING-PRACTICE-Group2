"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import TripForm, { tripToForm } from "@/components/TripForm";
import { getDestination, updateDestination } from "@/lib/api";

export default function EditDestinationPage() {
  const params = useParams();
  const router = useRouter();
  const [initial, setInitial] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getDestination(params.id)
      .then((trip) => {
        if (!active) {
          return;
        }

        if (!trip) {
          setError("This trip could not be found.");
          return;
        }

        setInitial(tripToForm(trip));
      })
      .catch((err) => {
        if (active) {
          setError(err.message || "Could not load this trip.");
        }
      });

    return () => {
      active = false;
    };
  }, [params.id]);

  return (
    <AdminShell title="Edit trip">
      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      {!initial && !error ? <p className="text-sm text-slate-500">Loading trip...</p> : null}
      {initial ? (
        <TripForm
          initial={initial}
          submitLabel="Save changes"
          onSubmit={async (payload) => {
            await updateDestination(params.id, payload);
            router.push("/admin");
          }}
        />
      ) : null}
    </AdminShell>
  );
}
