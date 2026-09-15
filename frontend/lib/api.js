const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getDestinations() {
  const response = await fetch(`${API_URL}/destinations`);

  if (!response.ok) {
    throw new Error("Failed to fetch destinations");
  }

  return response.json();
}