export const hotels = [
  {
    id: "sydney-park-hyatt",
    destinationId: 1,
    name: "Park Hyatt Sydney",
    area: "The Rocks",
    pricePerNight: 890,
    rating: 4.8,
    description: "Harbour rooms beside Circular Quay, a short walk from the Opera House.",
    mapsQuery: "Park Hyatt Sydney",
  },
  {
    id: "sydney-qt",
    destinationId: 1,
    name: "QT Sydney",
    area: "CBD",
    pricePerNight: 320,
    rating: 4.5,
    description: "Central stay between the town hall and the harbour walks.",
    mapsQuery: "QT Sydney",
  },
  {
    id: "sydney-grace",
    destinationId: 1,
    name: "The Grace Hotel",
    area: "CBD",
    pricePerNight: 240,
    rating: 4.4,
    description: "Heritage hotel a few blocks from Circular Quay and the Rocks.",
    mapsQuery: "The Grace Hotel Sydney",
  },
  {
    id: "melbourne-langham",
    destinationId: 2,
    name: "The Langham Melbourne",
    area: "Southbank",
    pricePerNight: 420,
    rating: 4.7,
    description: "Riverfront hotel opposite the arts precinct, close to Federation Square.",
    mapsQuery: "The Langham Melbourne",
  },
  {
    id: "melbourne-qt",
    destinationId: 2,
    name: "QT Melbourne",
    area: "CBD",
    pricePerNight: 280,
    rating: 4.5,
    description: "Laneway location for walking to coffee streets and Queen Victoria Market.",
    mapsQuery: "QT Melbourne",
  },
  {
    id: "melbourne-ovolo",
    destinationId: 2,
    name: "Ovolo Laneways",
    area: "CBD",
    pricePerNight: 210,
    rating: 4.4,
    description: "Smaller stay inside the central lanes, useful for a short city trip.",
    mapsQuery: "Ovolo Laneways Melbourne",
  },
  {
    id: "cairns-pullman",
    destinationId: 3,
    name: "Pullman Cairns International",
    area: "Cairns CBD",
    pricePerNight: 230,
    rating: 4.4,
    description: "Near the reef fleet terminal, so boat mornings start close to the hotel.",
    mapsQuery: "Pullman Cairns International",
  },
  {
    id: "cairns-crystalbrook",
    destinationId: 3,
    name: "Crystalbrook Riley",
    area: "Waterfront",
    pricePerNight: 310,
    rating: 4.6,
    description: "Waterfront rooms a short walk from the esplanade lagoon.",
    mapsQuery: "Crystalbrook Riley Cairns",
  },
  {
    id: "cairns-shangri-la",
    destinationId: 3,
    name: "Shangri-La The Marina",
    area: "Marina",
    pricePerNight: 340,
    rating: 4.6,
    description: "Marina location beside the pier, handy for island ferries.",
    mapsQuery: "Shangri-La The Marina Cairns",
  },
  {
    id: "perth-como",
    destinationId: 4,
    name: "COMO The Treasury",
    area: "CBD",
    pricePerNight: 480,
    rating: 4.7,
    description: "Heritage buildings in the centre, with Kings Park a short ride away.",
    mapsQuery: "COMO The Treasury Perth",
  },
  {
    id: "perth-ritz",
    destinationId: 4,
    name: "The Ritz-Carlton Perth",
    area: "Elizabeth Quay",
    pricePerNight: 520,
    rating: 4.7,
    description: "On the river quay, between the city and the Swan River walks.",
    mapsQuery: "The Ritz-Carlton Perth",
  },
  {
    id: "perth-qt",
    destinationId: 4,
    name: "QT Perth",
    area: "CBD",
    pricePerNight: 260,
    rating: 4.4,
    description: "Central base for trains out to Cottesloe and Fremantle.",
    mapsQuery: "QT Perth",
  },
  {
    id: "gold-coast-star",
    destinationId: 5,
    name: "The Star Grand",
    area: "Broadbeach",
    pricePerNight: 290,
    rating: 4.4,
    description: "Broadbeach stay between Surfers Paradise and the southern beaches.",
    mapsQuery: "The Star Grand Gold Coast",
  },
  {
    id: "gold-coast-sheraton",
    destinationId: 5,
    name: "Sheraton Grand Mirage Resort",
    area: "Main Beach",
    pricePerNight: 410,
    rating: 4.5,
    description: "Resort grounds at Main Beach, north of the Surfers strip.",
    mapsQuery: "Sheraton Grand Mirage Resort Gold Coast",
  },
  {
    id: "gold-coast-peppers",
    destinationId: 5,
    name: "Peppers Soul",
    area: "Surfers Paradise",
    pricePerNight: 360,
    rating: 4.5,
    description: "High-rise on the Surfers beachfront, close to the flagged swimming area.",
    mapsQuery: "Peppers Soul Surfers Paradise",
  },
  {
    id: "hobart-tasman",
    destinationId: 6,
    name: "The Tasman",
    area: "Hobart waterfront",
    pricePerNight: 340,
    rating: 4.6,
    description: "Waterfront hotel beside Salamanca, with the MONA ferry nearby.",
    mapsQuery: "The Tasman a Luxury Collection Hotel Hobart",
  },
  {
    id: "hobart-macq",
    destinationId: 6,
    name: "MACq 01 Hotel",
    area: "Hunter Street",
    pricePerNight: 280,
    rating: 4.5,
    description: "Wharf hotel on Hunter Street, a short walk into Battery Point.",
    mapsQuery: "MACq 01 Hotel Hobart",
  },
  {
    id: "hobart-chancellor",
    destinationId: 6,
    name: "Hotel Grand Chancellor",
    area: "Hobart CBD",
    pricePerNight: 190,
    rating: 4.2,
    description: "City hotel above the waterfront, useful for the mountain road and the centre.",
    mapsQuery: "Hotel Grand Chancellor Hobart",
  },
];

const BOOKINGS_KEY = "tripmate_hotel_bookings";

export function mapsUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function getHotelsForDestination(destinationId) {
  return hotels.filter((hotel) => hotel.destinationId === Number(destinationId));
}

export function getHotel(destinationId, hotelId) {
  return (
    hotels.find(
      (hotel) => hotel.destinationId === Number(destinationId) && hotel.id === hotelId
    ) ?? null
  );
}

export function getBookings() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = localStorage.getItem(BOOKINGS_KEY);
    const items = raw ? JSON.parse(raw) : [];
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

export function saveBooking(booking) {
  const next = [booking, ...getBookings()];
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(next));
  return next;
}

export function cancelBooking(id) {
  const next = getBookings().filter((booking) => booking.id !== id);
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(next));
  return next;
}

export function daysUntil(dateValue, now = new Date()) {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(target.getTime())) {
    return null;
  }

  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

export function canCancelBooking(booking, now = new Date()) {
  const days = daysUntil(booking?.checkOut, now);
  return days !== null && days >= 3;
}

export function nightsBetween(checkIn, checkOut) {
  const start = new Date(`${checkIn}T00:00:00`);
  const end = new Date(`${checkOut}T00:00:00`);
  const nights = Math.round((end - start) / 86400000);
  return Number.isFinite(nights) ? nights : 0;
}
