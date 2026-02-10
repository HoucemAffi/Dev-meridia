// Configuration de l'API Expedia
const EXPEDIA_API_BASE = 'https://api.expedia.com/v3';
const API_KEY = process.env.NEXT_PUBLIC_EXPEDIA_API_KEY;

interface SearchHotelsParams {
  city?: string;
  checkIn: string; // Format: YYYY-MM-DD
  checkOut: string; // Format: YYYY-MM-DD
  adults: number;
  children?: number;
  rooms?: number;
  priceMin?: number;
  priceMax?: number;
}

export async function searchHotels(params: SearchHotelsParams) {
  const queryParams = new URLSearchParams({
    ...(params.city && { city: params.city }),
    checkIn: params.checkIn,
    checkOut: params.checkOut,
    adults: params.adults.toString(),
    ...(params.children && { children: params.children.toString() }),
    ...(params.rooms && { rooms: params.rooms.toString() }),
    ...(params.priceMin && { priceMin: params.priceMin.toString() }),
    ...(params.priceMax && { priceMax: params.priceMax.toString() }),
  });

  const response = await fetch(
    `${EXPEDIA_API_BASE}/hotels/search?${queryParams}`,
    {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Erreur lors de la recherche d\'hôtels');
  }

  return response.json();
}

export async function getHotelDetails(hotelId: string) {
  const response = await fetch(
    `${EXPEDIA_API_BASE}/hotels/${hotelId}`,
    {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des détails');
  }

  return response.json();
}