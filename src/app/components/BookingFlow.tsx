'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BookingFlow({ hotel, onClose }: { hotel: any, onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // État pour les informations client
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Générer un numéro de confirmation unique
      const confirmationNumber = `TRP-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      
      // Créer l'objet de réservation
      const booking = {
        confirmationNumber,
        hotelId: hotel.id.toString(),
        hotelName: hotel.name,
        hotelPrice: hotel.price,
        hotelCity: hotel.city,
        ...formData,
        paymentOption: "now",
        totalPrice: hotel.price,
        bookingDate: new Date().toISOString(),
      };

      // Sauvegarder dans localStorage
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      bookings.push(booking);
      localStorage.setItem('bookings', JSON.stringify(bookings));

      // Redirection vers la page de succès
      onClose();
      router.push(
        `/hotels/booking-success?conf=${confirmationNumber}&hotelName=${encodeURIComponent(hotel.name)}&city=${encodeURIComponent(hotel.city)}`
      );
    } catch (error) {
      console.error("Erreur lors de la réservation :", error);
      alert("Une erreur est survenue lors de la réservation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal d-block bg-dark bg-opacity-50" style={{ zIndex: 1050 }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content rounded-4 border-0 shadow">
          <div className="modal-header border-0 p-4 pb-0">
            <h5 className="fw-bold m-0">Finaliser votre réservation</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          
          <form onSubmit={handleBookingSubmit}>
            <div className="modal-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-light rounded-3">
                <div>
                  <h6 className="fw-bold mb-1 text-primary">{hotel.name}</h6>
                  <p className="text-muted small mb-0">Total à payer</p>
                </div>
                <div className="text-end">
                  <span className="h4 fw-bold text-dark">{hotel.price}€</span>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Prénom</label>
                  <input type="text" name="firstName" className="form-control rounded-3" required onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Nom</label>
                  <input type="text" name="lastName" className="form-control rounded-3" required onChange={handleChange} />
                </div>
                <div className="col-md-12">
                  <label className="form-label small fw-bold">Email</label>
                  <input type="email" name="email" className="form-control rounded-3" required onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="p-4 border-top">
              <button 
                type="submit"
                disabled={loading}
                className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm"
              >
                {loading ? (
                  <><span className="spinner-border spinner-border-sm me-2"></span>Traitement...</>
                ) : (
                  `Payer ${hotel.price}€`
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

  return (
    <div className="modal d-block bg-dark bg-opacity-50" style={{ zIndex: 1050 }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content rounded-4 border-0 shadow">
          <div className="modal-header border-0 p-4 pb-0">
            <h5 className="fw-bold m-0">Finaliser votre réservation</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          
          <form onSubmit={handleBookingSubmit}>
            <div className="modal-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-light rounded-3">
                <div>
                  <h6 className="fw-bold mb-1 text-primary">{hotel.name}</h6>
                  <p className="text-muted small mb-0">Total à payer</p>
                </div>
                <div className="text-end">
                  <span className="h4 fw-bold text-dark">{hotel.price}€</span>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Prénom</label>
                  <input type="text" name="firstName" className="form-control rounded-3" required onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Nom</label>
                  <input type="text" name="lastName" className="form-control rounded-3" required onChange={handleChange} />
                </div>
                <div className="col-md-12">
                  <label className="form-label small fw-bold">Email</label>
                  <input type="email" name="email" className="form-control rounded-3" required onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="p-4 border-top">
              <button 
                type="submit"
                disabled={loading}
                className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm"
              >
                {loading ? (
                  <><span className="spinner-border spinner-border-sm me-2"></span>Paiement...</>
                ) : (
                  `Payer ${hotel.price}€`
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}