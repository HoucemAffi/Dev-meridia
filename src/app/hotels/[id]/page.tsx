'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation'; // Importation groupée
import Link from 'next/link';

export default function HotelDetailPage() {
  const { id } = useParams(); 
  const router = useRouter();
  const [hotel, setHotel] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // --- FONCTION DE RÉSERVATION (Déplacée ici pour être accessible) ---
  const handleBooking = () => {
    router.push('/hotels/booking-success');
  };

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
            address: `${foundHotel.city}, Centre-ville`
          };
          setHotel(formattedData);

          // --- SAUVEGARDE POUR LES RECHERCHES RÉCENTES ---
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
    <div className="bg-light min-vh-100 pb-5 text-dark">
      <nav className="navbar navbar-light bg-white border-bottom shadow-sm mb-4 sticky-top">
        <div className="container">
          <Link href="/hotels" className="btn btn-outline-secondary btn-sm rounded-pill px-3">
            ← Retour aux résultats
          </Link>
          <span className="fw-bold text-primary">OfficielVacances</span>
        </div>
      </nav>

      <div className="container">
        <div className="row g-2 mb-4">
          <div className="col-md-8">
            <img  src={hotel.imageUrl} className="img-fluid rounded-start-4 w-100 h-100 object-fit-cover shadow-sm" style={{ minHeight: '400px' }}alt={hotel.name} 
            />
          </div>
          <div className="col-md-4 d-flex flex-column gap-2">
            <img src="https://images.unsplash.com/photo-1582719478250-c89cae4df85b?auto=format&fit=crop&w=400" className="img-fluid rounded-end-4 h-50 object-fit-cover shadow-sm" alt="Chambre" />
            <img src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=400" className="img-fluid rounded-end-4 h-50 object-fit-cover shadow-sm" alt="Piscine" />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm p-4 rounded-4 mb-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h1 className="fw-bold h2 mb-1">{hotel.name}</h1>
                  <p className="text-muted small">📍 {hotel.address}</p>
                </div>
                <div className="text-end">
                  <div className="badge bg-primary fs-4 rounded-3">{hotel.rating}</div>
                  <p className="extra-small text-muted mt-1">Excellent</p>
                </div>
              </div>
              
              <hr className="my-4" />
              
              <h5 className="fw-bold mb-3 text-dark">Équipements les plus appréciés</h5>
              <div className="row g-3">
                <div className="col-md-4 small">📶 Wi-Fi gratuit</div>
                <div className="col-md-4 small">🏊 Piscine</div>
                <div className="col-md-4 small">🅿️ Parking gratuit</div>
                <div className="col-md-4 small">🧼 Service d'étage</div>
                <div className="col-md-4 small">🏋️ Centre de fitness</div>
                <div className="col-md-4 small">🍸 Bar et Restaurant</div>
              </div>
            </div>

            <div className="card border-0 shadow-sm p-4 rounded-4">
              <h5 className="fw-bold mb-3 text-dark">À propos de cet établissement</h5>
              <p className="text-muted small leading-relaxed">
                L'établissement {hotel.name} situé à {hotel.city} propose des chambres élégantes avec tout le confort moderne.
              </p>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-lg p-4 rounded-4 sticky-top" style={{ top: '80px' }}>
              <div className="d-flex align-items-baseline gap-2 mb-1">
                <h3 className="fw-bold text-primary mb-0">{hotel.price} €</h3>
                <span className="text-muted small">/ nuit</span>
              </div>
              <p className="text-success small fw-bold mb-4">Annulation gratuite disponible</p>
              
              {/* AJOUT DU ONCLICK ICI */}
              <button 
                onClick={handleBooking}
                className="btn btn-primary btn-lg w-100 rounded-pill fw-bold shadow-sm py-3 mb-3"
              >
                Réserver
              </button>
              <p className="extra-small text-center text-muted mb-0">Pas de frais de réservation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}