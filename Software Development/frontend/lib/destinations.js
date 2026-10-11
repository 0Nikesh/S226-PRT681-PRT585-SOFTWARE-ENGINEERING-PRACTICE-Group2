export const destinations = [
  {
    id: 1,
    name: "Sydney",
    country: "Australia",
    continent: "Oceania",
    destinationTime: 5,
    minPrice: 160,
    maxPrice: 280,
    averagePricePerDay: 220,
    averageVisitorsPerWeek: 42000,
    bestSeason: "Summer",
    description: "Harbour walks, beaches, and city neighbourhoods.",
    overview:
      "Sydney is a harbour city built around coves, headlands, and easy ferry rides. A typical trip mixes the foreshore, a beach day, and one neighbourhood that is better on foot than from a bus. Summer is the busiest season, so book harbour viewpoints early and keep one afternoon free for the coast.",
    places: [
      {
        name: "Sydney Opera House and Circular Quay",
        description:
          "Start on the forecourt, then walk the quay for ferries, street performers, and the bridge view. Early morning is the quietest time to photograph the shells.",
      },
      {
        name: "The Rocks",
        description:
          "Cobblestone lanes, weekend markets, and pubs sit just west of the quay. It is the easiest historic neighbourhood to pair with a harbour walk.",
      },
      {
        name: "Bondi to Bronte coastal walk",
        description:
          "A cliff path between two beaches, with swims, lookouts, and cafes along the way. Go on a clear morning and allow about two hours at an easy pace.",
      },
      {
        name: "Royal Botanic Garden",
        description:
          "Lawns and harbour lookouts beside the Opera House. A good pause between the quay and a ferry to Taronga or Manly.",
      },
    ],
  },
  {
    id: 2,
    name: "Melbourne",
    country: "Australia",
    continent: "Oceania",
    destinationTime: 4,
    minPrice: 140,
    maxPrice: 240,
    averagePricePerDay: 190,
    averageVisitorsPerWeek: 31000,
    bestSeason: "Autumn",
    description: "Laneways, food, and coastal day trips.",
    overview:
      "Melbourne is a walking city of laneways, galleries, and tram lines, with the bay a short ride south. Autumn is the most comfortable season for being outside. Plan one day in the centre, one along the beach, and one further down the coast if you have a car.",
    places: [
      {
        name: "Federation Square and the laneways",
        description:
          "The square is the meeting point for Flinders Street, the river, and the covered lanes behind it. Degraves Street and Centre Place are the densest stretches for coffee and small restaurants.",
      },
      {
        name: "Queen Victoria Market",
        description:
          "A large produce and goods market on the north edge of the centre. Go before lunch for food stalls, then walk back through the Queen Victoria night-market streets if you are there on the right evening.",
      },
      {
        name: "Brighton Beach bathing boxes",
        description:
          "A row of colourful beach huts on Port Phillip Bay. It is an easy half-day from the city by train and a short walk from the station.",
      },
      {
        name: "Royal Botanic Gardens Victoria",
        description:
          "A calm loop of lakes and lawns next to the Shrine of Remembrance. Useful on a warm afternoon when the laneways feel crowded.",
      },
    ],
  },
  {
    id: 3,
    name: "Cairns",
    country: "Australia",
    continent: "Oceania",
    destinationTime: 6,
    minPrice: 120,
    maxPrice: 220,
    averagePricePerDay: 170,
    averageVisitorsPerWeek: 18000,
    bestSeason: "Winter",
    description: "Reef trips and rainforest escapes in the dry season.",
    overview:
      "Cairns is the base for the reef and the wet tropics, not a city you only walk around. The dry winter months are the best time for boat days and rainforest tracks. Keep a spare day in case a reef tour is moved by weather.",
    places: [
      {
        name: "Great Barrier Reef",
        description:
          "Day boats leave from the reef fleet terminal for snorkelling and pontoon stops. Choose a tour that includes a marine guide if this is your first time on the reef.",
      },
      {
        name: "Cairns Esplanade Lagoon",
        description:
          "A free swimming lagoon on the waterfront, with a long boardwalk for mudflat views at low tide. It is the easiest swim in town because the sea here is not a swimming beach.",
      },
      {
        name: "Kuranda",
        description:
          "A village in the rainforest above Cairns, reached by the scenic railway or the skyrail. Markets, short walks, and the Barron Falls lookout fill a day.",
      },
      {
        name: "Fitzroy Island",
        description:
          "A closer island trip than the outer reef, with a turtle rehabilitation centre and a walk to a summit lookout. Good if you want a shorter boat day.",
      },
    ],
  },
  {
    id: 4,
    name: "Perth",
    country: "Australia",
    continent: "Oceania",
    destinationTime: 4,
    minPrice: 130,
    maxPrice: 230,
    averagePricePerDay: 180,
    averageVisitorsPerWeek: 15000,
    bestSeason: "Spring",
    description: "Beaches, parks, and sunny spring weather.",
    overview:
      "Perth spreads between the Swan River and a long line of Indian Ocean beaches. Spring brings mild days and wildflowers in the parks. The city centre is compact, and the best of the trip is the river, Kings Park, and one day on the coast or on Rottnest.",
    places: [
      {
        name: "Kings Park and Botanic Garden",
        description:
          "A large park on the escarpment above the river, with lookouts over the skyline. The spring wildflower displays are the reason this season stands out.",
      },
      {
        name: "Cottesloe Beach",
        description:
          "The classic city beach, with a lawn, a jetty, and sunset over the ocean. Trains and buses make it a simple afternoon from the centre.",
      },
      {
        name: "Fremantle",
        description:
          "A port town of warehouses, the maritime museum, and the Cappuccino Strip. The prison tour is the strongest single historic stop.",
      },
      {
        name: "Rottnest Island",
        description:
          "A ferry ride from Fremantle or Perth for bays, quokkas, and bike loops. Book the ferry and a bike before you go in school holidays.",
      },
    ],
  },
  {
    id: 5,
    name: "Gold Coast",
    country: "Australia",
    continent: "Oceania",
    destinationTime: 5,
    minPrice: 110,
    maxPrice: 210,
    averagePricePerDay: 160,
    averageVisitorsPerWeek: 27000,
    bestSeason: "Summer",
    description: "Surf beaches and theme parks along the coast.",
    overview:
      "The Gold Coast is a string of beaches rather than one downtown. Summer is warm, busy, and the season for surf and long evenings outside. Base yourself in Surfers Paradise for the skyline, or further south in Burleigh if you want a smaller beach town.",
    places: [
      {
        name: "Surfers Paradise",
        description:
          "The main beach and high-rise strip. Swim between the flags, and use the skyline only as a landmark for meeting points.",
      },
      {
        name: "Burleigh Heads",
        description:
          "A national park headland with a short walk above the point and a beach that is calmer than Surfers. The village has the better casual food.",
      },
      {
        name: "Currumbin Wildlife Sanctuary",
        description:
          "A riverside sanctuary for Australian animals, including lorikeet feeding and a small train. It suits a half-day between beach mornings.",
      },
      {
        name: "Tamborine Mountain",
        description:
          "Rainforest walks and lookouts in the hinterland, about an hour from the coast. Go on a day when the beach wind is strong.",
      },
    ],
  },
  {
    id: 6,
    name: "Hobart",
    country: "Australia",
    continent: "Oceania",
    destinationTime: 4,
    minPrice: 100,
    maxPrice: 190,
    averagePricePerDay: 145,
    averageVisitorsPerWeek: 8000,
    bestSeason: "Summer",
    description: "Harbour views, markets, and nearby wilderness.",
    overview:
      "Hobart is a small harbour city with the mountain behind it and wilderness within a day trip. Summer is the reliable season for the mountain road and for being outside at the waterfront. The centre is walkable, so save the car for kunanyi and the peninsula.",
    places: [
      {
        name: "Salamanca Place",
        description:
          "Sandstone warehouses along the waterfront, with the Saturday market in the square. Battery Point’s lanes start at the top of the nearby steps.",
      },
      {
        name: "Museum of Old and New Art",
        description:
          "A ferry ride up the Derwent to a gallery built into a peninsula. Book a timed entry and allow half a day.",
      },
      {
        name: "kunanyi / Mount Wellington",
        description:
          "The mountain above the city. The summit can be in cloud and much colder than the harbour, so check the road before you drive up.",
      },
      {
        name: "Battery Point",
        description:
          "A historic neighbourhood of cottages and short streets between Salamanca and the water. It is the best evening walk if you are staying in the centre.",
      },
    ],
  },
];

export function getDestinationById(id) {
  return destinations.find((destination) => destination.id === Number(id)) ?? null;
}

export function localDetailsFor(name) {
  return destinations.find((destination) => destination.name.toLowerCase() === String(name || "").toLowerCase()) ?? null;
}

export function mergeCatalog(posted) {
  if (!Array.isArray(posted)) {
    return [];
  }

  const localByName = new Map(
    destinations.map((destination) => [destination.name.toLowerCase(), destination])
  );

  return posted.map((item) => {
    const local = localByName.get(String(item.name || "").toLowerCase());

    return {
      ...(local || {}),
      ...item,
      imageUrl: item.imageUrl || local?.imageUrl || "",
      overview: local?.overview || item.description || "",
      places: local?.places || [],
    };
  });
}

export function formatMoney(value) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "AUD $0";
  }

  return `AUD $${amount.toLocaleString("en-AU", {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}
