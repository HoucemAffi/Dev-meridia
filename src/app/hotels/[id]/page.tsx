'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import HotelDetails from '../components/HotelDetails';

export default function HotelDetailPage() {
  const { id } = useParams(); 
  const router = useRouter();
  const [hotel, setHotel] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotelDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/hotels`);
        const allHotels = await res.json();
        
        const foundHotel = allHotels.find((h: any) => h.id.toString() === id);

        if (foundHotel) {
          const formattedData = {
            ...foundHotel,
            imageUrl: foundHotel.image,
            rating: foundHotel.rate,
            address: foundHotel.address || `${foundHotel.city}, Centre-ville`
          };
          setHotel(formattedData);

          // Sauvegarde pour les recherches récentes
          const recentSearches = JSON.parse(localStorage.getItem('recentHotels') || '[]');
          const hotelToSave = {
            id: id,
            name: foundHotel.name,
            imageUrl: foundHotel.image,
            city: foundHotel.city || 'Destination'
          };

          const updatedSearches = [
            hotelToSave, 
            ...recentSearches.filter((h: any) => h.id !== id)
          ].slice(0, 4);

          localStorage.setItem('recentHotels', JSON.stringify(updatedSearches));
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des détails :", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchHotelDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return <div className="container py-5 text-center">Hôtel introuvable.</div>;
  }

  return (
    <HotelDetails 
      hotel={hotel}
      onBack={() => router.back()}
    />
  );
}