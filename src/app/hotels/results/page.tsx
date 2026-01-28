'use client'; // Indispensable pour utiliser useState
import { useState, useEffect } from 'react';
import BookingFlow from '../../components/BookingFlow';
// @ts-ignore
import('bootstrap/dist/js/bootstrap.bundle.min.js');

export default function HotelsResultsPage() {
  // 1. Déclaration des états
  const [selectedBookingHotel, setSelectedBookingHotel] = useState<any | null>(null);
  const [hotels, setHotels] = useState<any[]>([]); // Simulation de votre liste d'hôtels

  // ... Votre logique de récupération de données (useEffect, etc.) existante

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Résultats de recherche</h2>
      
      <div className="row g-4">
        {/* Exemple de boucle sur vos hôtels */}
        {hotels.map((hotel) => (
          <div key={hotel.id} className="col-md-12">
            <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="fw-bold mb-1">{hotel.name}</h5>
                  <p className="text-muted small mb-0">{hotel.location}</p>
                </div>
                
                {/* 2. BOUTON DE RÉSERVATION (CORRIGÉ) */}
                <button 
                  onClick={() => setSelectedBookingHotel(hotel)} 
                  className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm"
                >
                  Voir l'offre
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. TUNNEL DE RÉSERVATION (DANS LA MODALE) */}
      {selectedBookingHotel && (
        <BookingFlow 
          hotel={selectedBookingHotel} 
          onClose={() => setSelectedBookingHotel(null)} 
        />
      )}
    </div>
  );
}