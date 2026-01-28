'use client';
import { useState } from 'react';
import BookingFlow from '../components/BookingFlow';

interface HotelDetailsProps {
  hotel: {
    id: string | number;
    name: string;
    city: string;
    price: number;
    rate: number;
    image: string;
    stars?: number;
    meals?: string[];
    services?: string[];
    roomEquip?: string[];
    address?: string;
  };
  onBack?: () => void;
}

export default function HotelDetails({ hotel, onBack }: HotelDetailsProps) {
  const [showBooking, setShowBooking] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const images = [
    hotel.image,
    "https://images.unsplash.com/photo-1582719478250-c89cae4df85b?auto=format&fit=crop&w=800",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800"
  ];

  return (
    <div className="bg-light min-vh-100 text-dark">
      {/* Navigation */}
      <nav className="navbar navbar-light bg-white border-bottom shadow-sm sticky-top">
        <div className="container">
          <button 
            onClick={onBack}
            className="btn btn-outline-secondary btn-sm rounded-pill px-3"
          >
            ← Retour aux résultats
          </button>
          <span className="fw-bold text-primary">OfficielVacances</span>
        </div>
      </nav>

      <div className="container py-5">
        {/* Image Gallery */}
        <div className="row g-3 mb-5">
          <div className="col-lg-8">
            <div className="rounded-4 overflow-hidden shadow-lg" style={{ height: '450px' }}>
              <img 
                src={images[selectedImage]} 
                alt={hotel.name}
                className="w-100 h-100"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
          <div className="col-lg-4">
            <div className="d-flex flex-column gap-2">
              {images.slice(1).map((img, idx) => (
                <div 
                  key={idx}
                  className="rounded-3 overflow-hidden cursor-pointer"
                  style={{
                    height: '140px',
                    cursor: 'pointer',
                    opacity: selectedImage === idx + 1 ? 1 : 0.6,
                    transition: 'opacity 0.3s ease'
                  }}
                  onClick={() => setSelectedImage(idx + 1)}
                >
                  <img 
                    src={img}
                    alt={`Vue ${idx + 2}`}
                    className="w-100 h-100"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* Left Column - Details */}
          <div className="col-lg-8">
            {/* Header Section */}
            <div className="card border-0 shadow-sm p-5 rounded-4 mb-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h1 className="fw-bold display-6 mb-2">{hotel.name}</h1>
                  <p className="text-muted mb-0">
                    <i className="bi bi-geo-alt me-2"></i>
                    {hotel.address || hotel.city}
                  </p>
                </div>
                <div className="text-center">
                  <div 
                    className="rounded-circle d-inline-flex align-items-center justify-content-center text-white fw-bold mb-2"
                    style={{
                      width: '70px',
                      height: '70px',
                      fontSize: '24px',
                      background: hotel.rate >= 9 ? '#10b981' : hotel.rate >= 8 ? '#3b82f6' : '#f59e0b',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                  >
                    {hotel.rate}
                  </div>
                  <p className="text-muted small">
                    {hotel.rate >= 9 ? 'Excellent' : hotel.rate >= 8 ? 'Très bien' : 'Bien'}
                  </p>
                </div>
              </div>

              {/* Stars */}
              {hotel.stars && (
                <div className="mb-3">
                  {Array.from({ length: hotel.stars }).map((_, i) => (
                    <i key={i} className="bi bi-star-fill text-warning me-1" style={{ fontSize: '16px' }}></i>
                  ))}
                  <span className="text-muted small ms-2">{hotel.stars} étoiles</span>
                </div>
              )}
            </div>

            {/* Services & Amenities */}
            <div className="card border-0 shadow-sm p-5 rounded-4 mb-4">
              <h4 className="fw-bold mb-4">Équipements et services</h4>
              
              <div className="row g-3 mb-5">
                {(hotel.services || []).map((service, idx) => (
                  <div key={idx} className="col-md-6">
                    <div className="d-flex gap-3 align-items-start p-3 rounded-3" style={{ backgroundColor: '#f0f9ff' }}>
                      <i className="bi bi-check-circle-fill text-success fs-5 mt-1"></i>
                      <div>
                        <p className="fw-semibold mb-0">{service}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Room Equipment */}
              {(hotel.roomEquip || []).length > 0 && (
                <>
                  <h5 className="fw-bold mb-3 mt-4">Dans votre chambre</h5>
                  <div className="row g-2">
                    {(hotel.roomEquip || []).map((equip, idx) => (
                      <div key={idx} className="col-md-4">
                        <div className="p-3 rounded-3 bg-light">
                          <p className="small mb-0">✓ {equip}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Meals */}
            {(hotel.meals || []).length > 0 && (
              <div className="card border-0 shadow-sm p-5 rounded-4">
                <h4 className="fw-bold mb-4">Options de repas</h4>
                <div className="list-group list-group-flush">
                  {(hotel.meals || []).map((meal, idx) => (
                    <div key={idx} className="list-group-item ps-0 py-2">
                      <i className="bi bi-check text-success me-2 fw-bold"></i>
                      <span>{meal}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Booking Card */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-lg p-5 rounded-4 sticky-lg-top" style={{ top: '100px' }}>
              {/* Price Section */}
              <div className="mb-4 pb-4 border-bottom">
                <p className="text-muted small mb-1">Prix par nuit</p>
                <h2 className="fw-bold text-primary mb-0">{hotel.price}€</h2>
                <p className="text-success small fw-semibold mt-2">
                  <i className="bi bi-check-circle-fill me-1"></i>
                  Annulation gratuite
                </p>
              </div>

              {/* Booking Button */}
              <button 
                onClick={() => setShowBooking(true)}
                className="btn btn-primary btn-lg w-100 rounded-pill fw-bold py-3 mb-3 shadow-sm"
                style={{
                  fontSize: '16px',
                  transition: 'all 0.3s ease'
                }}
              >
                Réserver maintenant
              </button>

              {/* Info Text */}
              <p className="text-center text-muted extra-small">
                Sans frais de réservation
              </p>

              {/* Highlights */}
              <div className="mt-5 pt-4 border-top">
                <h6 className="fw-bold mb-3">Pourquoi choisir cet hôtel?</h6>
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex gap-2">
                    <i className="bi bi-shield-check text-success"></i>
                    <span className="small">Confirmé immédiatement</span>
                  </div>
                  <div className="d-flex gap-2">
                    <i className="bi bi-person-check text-success"></i>
                    <span className="small">Support client 24/7</span>
                  </div>
                  <div className="d-flex gap-2">
                    <i className="bi bi-cash-coin text-success"></i>
                    <span className="small">Meilleur prix garanti</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <BookingFlow 
          hotel={hotel}
          onClose={() => setShowBooking(false)}
        />
      )}

      <style jsx>{`
        .object-fit-cover {
          object-fit: cover;
        }
        .extra-small {
          font-size: 0.75rem;
        }
      `}</style>
    </div>
  );
}
