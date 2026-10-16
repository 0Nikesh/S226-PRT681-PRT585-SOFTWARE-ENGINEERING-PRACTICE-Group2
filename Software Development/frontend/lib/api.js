import { getSession, sessionExpired, tokenIsCurrent } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function readError(response) {
  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!data) {
    if (response.status === 401) {
      return "Your session expired. Sign in again as an admin.";
    }

    return "Something went wrong. Please try again.";
  }

  if (typeof data.message === "string") {
    return data.message;
  }

  if (Array.isArray(data.errors)) {
    return data.errors.join(" ");
  }

  if (data.errors && typeof data.errors === "object") {
    return Object.values(data.errors).flat().join(" ");
  }

  if (response.status === 401) {
    return "Your session expired. Sign in again as an admin.";
  }

  if (typeof data.title === "string") {
    return data.title;
  }

  return "Something went wrong. Please try again.";
}

function requireToken() {
  const session = getSession();

  if (!session?.token || !tokenIsCurrent(session.token)) {
    sessionExpired();
    throw new Error("Your session expired. Sign in again as an admin.");
  }

  return session.token;
}

export function normalizeDestination(item) {
  const minPrice = Number(item.minPrice ?? item.MinPrice ?? 0);
  const maxPrice = Number(item.maxPrice ?? item.MaxPrice ?? 0);
  const average = Number(item.averagePricePerDay ?? item.AveragePricePerDay);

  return {
    id: item.id ?? item.Id,
    name: item.name ?? item.Name ?? "",
    country: item.country ?? item.Country ?? "",
    continent: item.continent ?? item.Continent ?? "",
    destinationTime: Number(item.destinationTime ?? item.DestinationTime ?? 0),
    minPrice,
    maxPrice,
    averagePricePerDay: Number.isFinite(average) ? average : Math.round(((minPrice + maxPrice) / 2) * 100) / 100,
    averageVisitorsPerWeek: Number(item.averageVisitorsPerWeek ?? item.AverageVisitorsPerWeek ?? 0),
    bestSeason: item.bestSeason ?? item.BestSeason ?? "",
    description: item.description ?? item.Description ?? "",
    imageUrl: item.imageUrl ?? item.ImageUrl ?? "",
    mapsQuery: item.mapsQuery ?? item.MapsQuery ?? "",
    hotels: Array.isArray(item.hotels ?? item.Hotels)
      ? (item.hotels ?? item.Hotels).map((hotel) => ({
          id: hotel.id ?? hotel.Id,
          name: hotel.name ?? hotel.Name ?? "",
          area: hotel.area ?? hotel.Area ?? "",
          pricePerNight: Number(hotel.pricePerNight ?? hotel.PricePerNight ?? 0),
          description: hotel.description ?? hotel.Description ?? "",
          mapsQuery: hotel.mapsQuery ?? hotel.MapsQuery ?? "",
        }))
      : [],
    overview: item.description ?? item.Description ?? "",
    places: [],
  };
}

export async function getDestinations() {
  let response;

  try {
    response = await fetch(`${API_URL}/api/destinations`, { cache: "no-store" });
  } catch {
    throw new Error("Could not reach the server. Check that the API is running.");
  }

  if (!response.ok) {
    if (response.status === 401) {
      sessionExpired();
    }

    throw new Error(await readError(response));
  }

  const data = await response.json();
  return Array.isArray(data) ? data.map(normalizeDestination) : [];
}

export async function getDestination(id) {
  let response;

  try {
    response = await fetch(`${API_URL}/api/destinations/${id}`, { cache: "no-store" });
  } catch {
    throw new Error("Could not reach the server. Check that the API is running.");
  }

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    if (response.status === 401) {
      sessionExpired();
    }

    throw new Error(await readError(response));
  }

  return normalizeDestination(await response.json());
}

export async function createDestination(payload) {
  const token = requireToken();

  let response;

  try {
    response = await fetch(`${API_URL}/api/destinations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("Could not reach the server. Check that the API is running.");
  }

  if (!response.ok) {
    if (response.status === 401) {
      sessionExpired();
    }

    throw new Error(await readError(response));
  }

  return normalizeDestination(await response.json());
}

export async function updateDestination(id, payload) {
  const token = requireToken();

  let response;

  try {
    response = await fetch(`${API_URL}/api/destinations/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("Could not reach the server. Check that the API is running.");
  }

  if (!response.ok) {
    if (response.status === 401) {
      sessionExpired();
    }

    throw new Error(await readError(response));
  }

  return normalizeDestination(await response.json());
}

export async function uploadTripImage(file) {
  const token = requireToken();

  const body = new FormData();
  body.append("image", file);

  let response;

  try {
    response = await fetch(`${API_URL}/api/uploads/trip-image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body,
    });
  } catch {
    throw new Error("Could not reach the server. Check that the API is running.");
  }

  if (!response.ok) {
    if (response.status === 401) {
      sessionExpired();
    }

    throw new Error(await readError(response));
  }

  const data = await response.json();
  return data.imageUrl ?? data.ImageUrl ?? "";
}

export async function deleteDestination(id) {
  const token = requireToken();

  let response;

  try {
    response = await fetch(`${API_URL}/api/destinations/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    throw new Error("Could not reach the server. Check that the API is running.");
  }

  if (!response.ok && response.status !== 204) {
    if (response.status === 401) {
      sessionExpired();
    }

    throw new Error(await readError(response));
  }
}
