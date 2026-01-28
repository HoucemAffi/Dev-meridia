'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessDetails() {
  const searchParams = useSearchParams();
  
  // Récupération sécurisée des paramètres
  const confNumber = searchParams.get('conf') || 'NON DISPONIBLE';
  const hotelName = searchParams.get('hotelName') || 'votre hôtel';

  return (
    <div className="card border-0 shadow-lg p-5 text-center rounded-4" style={{ maxWidth: '550px' }}>
      <div className="mb-4">
        <div className="display-1 bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '100px', height: '100px' }}>
          ✓
        </div>
      </div>
      
      <h1 className="fw-bold mb-3 text-dark">Réservation Confirmée !</h1>
      <p className="text-muted mb-4 px-3">
        Félicitations, votre séjour à <span className="text-dark fw-bold">{hotelName}</span> a été enregistré. Un email récapitulatif vous a été envoyé.
      </p>
      
      <div className="bg-light p-4 rounded-4 mb-4 border-dashed border-2">
        <span className="small text-uppercase tracking-wider text-muted d-block mb-1">Code de confirmation</span>
        <span className="fw-bold fs-3 text-primary" style={{ letterSpacing: '2px' }}>{confNumber}</span>
      </div>

      <div className="d-grid gap-3">
        <Link href="/" className="btn btn-primary rounded-pill py-3 fw-bold shadow-sm transition-all hover-lift">
          Retour à l'accueil
        </Link>
        <Link href="/hotels/results" className="btn btn-outline-light text-muted border-0 py-2">
          Chercher un autre établissement
        </Link>
      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center" 
         style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
      <Suspense fallback={
        <div className="text-center">
          <div className="spinner-border text-primary mb-2"></div>
          <p className="text-muted">Finalisation de votre confirmation...</p>
        </div>
      }>
        <SuccessDetails />
      </Suspense>
    </div>
  );
}