const STORAGE_KEY = "tripmate_shared_experiences";

export const sampleExperiences = [
  {
    id: "sample-sydney",
    destinationId: 1,
    destinationName: "Sydney",
    country: "Australia",
    authorName: "Maya Chen",
    description:
      "We walked from Circular Quay to the Opera House at sunrise, then spent the afternoon on the Bondi to Bronte path. The harbour is the part of the trip I would book again first.",
    rating: 5,
    createdAt: "2026-08-12T00:00:00.000Z",
  },
  {
    id: "sample-melbourne",
    destinationId: 2,
    destinationName: "Melbourne",
    country: "Australia",
    authorName: "Liam Patel",
    description:
      "Autumn was easy for walking the laneways and the botanic gardens. Queen Victoria Market in the morning and Brighton Beach later made a full day without feeling rushed.",
    rating: 5,
    createdAt: "2026-07-03T00:00:00.000Z",
  },
  {
    id: "sample-cairns",
    destinationId: 3,
    destinationName: "Cairns",
    country: "Australia",
    authorName: "Sofia Rossi",
    description:
      "The reef boat was the highlight, and the esplanade lagoon was the easy swim afterwards. Keep a spare day. Our first boat time moved because of wind.",
    rating: 4,
    createdAt: "2026-06-18T00:00:00.000Z",
  },
  {
    id: "sample-hobart",
    destinationId: 6,
    destinationName: "Hobart",
    country: "Australia",
    authorName: "Noah Williams",
    description:
      "Salamanca in the morning and MONA by ferry filled one day. The mountain road was open, but the summit was much colder than the harbour, so take a jacket.",
    rating: 4,
    createdAt: "2026-05-22T00:00:00.000Z",
  },
  {
    id: "sample-gold-coast",
    destinationId: 5,
    destinationName: "Gold Coast",
    country: "Australia",
    authorName: "Aisha Rahman",
    description:
      "Surfers Paradise was busy. Burleigh Heads was the better beach, and the headland walk was short enough to do before lunch. I would stay further south next time.",
    rating: 3,
    createdAt: "2026-04-09T00:00:00.000Z",
  },
];

export function getSharedExperiences() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const items = raw ? JSON.parse(raw) : [];
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

export function saveSharedExperience(experience) {
  const next = [experience, ...getSharedExperiences()];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}
