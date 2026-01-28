import { NextResponse } from 'next/server';
import axios from 'axios';

// Données de base avec informations enrichies pour TripAdvisor
const HOTEL_DATABASE = [
  { 
    id: "1", 
    name: "Artemisia Resort", 
    city: "Ragusa", 
    price: 142, 
    rate: 9.8, 
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    address: "Via Cavalieri Malta, Ragusa, Italy",
    stars: 5,
    meals: ["Petit-déjeuner inclus"],
    services: ["Wi-Fi gratuit", "Piscine", "Spa"],
    roomEquip: ["Climatisation", "Vue sur la mer"]
  },
  { 
    id: "2", 
    name: "Terre di Himera", 
    city: "Termini Imerese", 
    price: 458, 
    rate: 9.6, 
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
    address: "Termini Imerese, Sicily, Italy",
    stars: 5,
    meals: ["Petit-déjeuner", "Demi-pension"],
    services: ["Wi-Fi gratuit", "Restaurant", "Bar"],
    roomEquip: ["Climatisation", "Baignoire"]
  },
  { 
    id: "3", 
    name: "Hôtel Royal Victoria", 
    city: "Tunis", 
    price: 120, 
    rate: 8.9, 
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
    address: "Place de l'Indépendance, Tunis, Tunisia",
    stars: 4,
    meals: ["Petit-déjeuner inclus"],
    services: ["Wi-Fi gratuit", "Parking", "Salle de sport"],
    roomEquip: ["Climatisation", "TV"]
  },
  { 
    id: "4", 
    name: "Hôtel Eiffel Seine", 
    city: "Paris", 
    price: 310, 
    rate: 9.2, 
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
    address: "7 Avenue Anatole France, Paris, France",
    stars: 5,
    meals: ["Petit-déjeuner inclus"],
    services: ["Wi-Fi gratuit", "Concierge 24/24", "Restaurant"],
    roomEquip: ["Climatisation", "Vue sur la Tour Eiffel"]
  },
  { 
    id: "5", 
    name: "The Manhattan Hotel", 
    city: "New York", 
    price: 550, 
    rate: 9.5, 
    image: "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a",
    address: "350 Fifth Avenue, New York, USA",
    stars: 5,
    meals: ["Petit-déjeuner", "Business center"],
    services: ["Wi-Fi gratuit", "Piscine", "Salle de sport"],
    roomEquip: ["Climatisation", "Vue sur Central Park"]
  },
  { 
    id: "6", 
    name: "La Badira", 
    city: "Tunis", 
    price: 280, 
    rate: 9.4, 
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4df85b",
    address: "Tunis Presqu'île, Tunisia",
    stars: 4,
    meals: ["Petit-déjeuner", "Demi-pension"],
    services: ["Wi-Fi gratuit", "Piscine", "Plage privée"],
    roomEquip: ["Climatisation", "Vue sur la mer"]
  },
  { 
    id: "7", 
    name: "Golden Tulip El Mechtel", 
    city: "Tunis", 
    price: 909, 
    rate: 7.2, 
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
    address: "Tunis City Center, Tunisia",
    stars: 4,
    meals: ["Petit-déjeuner inclus"],
    services: ["Wi-Fi gratuit", "Restaurant", "Parking"],
    roomEquip: ["Climatisation", "Minibar"]
  },
  { 
    id: "8", 
    name: "Dar Fatma", 
    city: "Tunis", 
    price: 862, 
    rate: 6.2, 
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
    address: "Medina, Tunis, Tunisia",
    stars: 3,
    meals: ["Petit-déjeuner inclus"],
    services: ["Wi-Fi", "Restaurant"],
    roomEquip: ["Climatisation", "TV"]
  },
  { 
    id: "9", 
    name: "Royal Victoria - Ex British Embassy", 
    city: "Tunis", 
    price: 1120, 
    rate: 9.0, 
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
    address: "Place de la Kasbah, Tunis, Tunisia",
    stars: 5,
    meals: ["Petit-déjeuner", "Demi-pension", "Pension complète"],
    services: ["Wi-Fi gratuit", "Concierge", "Parking", "Restaurant gastronomique"],
    roomEquip: ["Climatisation", "Baignoire", "Vue historique"]
  },
  { 
    id: "10", 
    name: "Radisson Hotel Tunis, City Center", 
    city: "Tunis", 
    price: 1242, 
    rate: 9.2, 
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
    address: "Tunis Downtown, Tunisia",
    stars: 5,
    meals: ["Petit-déjeuner inclus"],
    services: ["Wi-Fi gratuit", "Salle de sport", "Restaurant", "Bar"],
    roomEquip: ["Climatisation", "Baignoire", "Vue sur la ville"]
  },
  { 
    id: "11", 
    name: "The Residence Tunis", 
    city: "Tunis", 
    price: 1932, 
    rate: 9.0, 
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
    address: "Tunis La Marsa, Tunisia",
    stars: 5,
    meals: ["Petit-déjeuner", "Demi-pension"],
    services: ["Wi-Fi gratuit", "Plage privée", "Spa", "Restaurant"],
    roomEquip: ["Climatisation", "Baignoire", "Vue sur la mer"]
  },
  { 
    id: "12", 
    name: "Royal Thalassa Monastir", 
    city: "Tunis", 
    price: 871, 
    rate: 7.0, 
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
    address: "Monastir Beach, Tunisia",
    stars: 4,
    meals: ["All-inclusive"],
    services: ["Wi-Fi gratuit", "Plage privée", "Piscine", "Spa", "Restaurant"],
    roomEquip: ["Climatisation", "Vue sur la plage"]
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cityQuery = searchParams.get('city')?.toLowerCase() || "";

    // Filtrer les hôtels par ville
    const results = cityQuery 
      ? HOTEL_DATABASE.filter(h => h.city.toLowerCase().includes(cityQuery))
      : HOTEL_DATABASE;

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching hotels from TripAdvisor:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hotels' },
      { status: 500 }
    );
  }
}