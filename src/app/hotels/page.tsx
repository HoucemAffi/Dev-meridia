'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';

export default function HotelsResultsPage() {
  const searchParams = useSearchParams();
  
  // ÉTATS DES PARAMÈTRES DE RECHERCHE
  const [city, setCity] = useState(searchParams.get('city') || 'votre destination');
  const [dates, setDates] = useState('14 fév. — 22 fév.');
  const [guests, setGuests] = useState('2 personnes, 1 chambre');
  
  // ÉTATS D'INTERFACE
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recommended');
  const [isEditMode, setIsEditMode] = useState(false);

  // ÉTATS DE FILTRAGE FONCTIONNELS
  const [searchName, setSearchName] = useState('');
  const [maxPrice, setMaxPrice] = useState(9999);
  const [minRating, setMinRating] = useState('any');
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [selectedMeals, setSelectedMeals] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedRoomEquip, setSelectedRoomEquip] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('bootstrap/dist/js/bootstrap.bundle.min.js');
    }
  }, []);

  // Fonction utilitaire pour basculer les filtres tableaux
  const toggleFilter = (value: any, state: any[], setState: Function) => {
    setState(state.includes(value) ? state.filter(i => i !== value) : [...state, value]);
  };

  // Réinitialisation
  const resetFilters = () => {
    setSearchName('');
    setMaxPrice(9999);
    setMinRating('any');
    setSelectedStars([]);
    setSelectedMeals([]);
    setSelectedServices([]);
    setSelectedRoomEquip([]);
  };

  const fetchHotelsData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/hotels?city=${city}`);
      const data = await res.json();
      
      // On enrichit les données avec des propriétés par défaut si l'API ne les fournit pas encore
      const enrichedData = (Array.isArray(data) ? data : []).map(h => ({
        ...h,
        stars: h.stars || Math.floor(Math.random() * 5) + 1,
        meals: h.meals || ['Petit-déjeuner inclus'],
        services: h.services || ['Wi-Fi gratuit', 'Piscine'],
        roomEquip: h.roomEquip || ['Climatisation']
      }));
      setHotels(enrichedData);
    } catch (error) {
      console.error("Erreur API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (city) fetchHotelsData(); }, []);

  // LOGIQUE DE FILTRAGE RÉELLE
  const filteredHotels = useMemo(() => {
    return hotels.filter(h => {
      const matchName = h.name.toLowerCase().includes(searchName.toLowerCase());
      const matchPrice = (h.price || 0) <= maxPrice;
      const matchRating = minRating === 'any' ? true : (h.rate || 0) >= parseFloat(minRating);
      const matchStars = selectedStars.length === 0 ? true : selectedStars.includes(h.stars);
      const matchMeals = selectedMeals.length === 0 ? true : selectedMeals.some(m => h.meals.includes(m));
      const matchServices = selectedServices.length === 0 ? true : selectedServices.every(s => h.services.includes(s));
      const matchRoom = selectedRoomEquip.length === 0 ? true : selectedRoomEquip.every(re => h.roomEquip.includes(re));

      return matchName && matchPrice && matchRating && matchStars && matchMeals && matchServices && matchRoom;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'rating_desc') return (b.rate || 0) - (a.rate || 0);
      return 0;
    });
  }, [hotels, sortBy, searchName, maxPrice, minRating, selectedStars, selectedMeals, selectedServices, selectedRoomEquip]);

  const displayedHotels = filteredHotels.slice(0, visibleCount);

  // COMPOSANT FILTRES
  const FilterContent = ({ isMobile = false }) => (
    <div className={isMobile ? "" : "card border-0 shadow-sm p-3 rounded-4 bg-white"}>
      <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
        <h6 className="fw-bold mb-0">Filtrer par</h6>
        <button className="btn btn-link btn-sm p-0 text-decoration-none extra-small" onClick={resetFilters}>Tout effacer</button>
      </div>
      
      {/* NOM */}
      <div className="mb-4">
        <label className="small fw-bold mb-2">Rechercher un nom</label>
        <div className="input-group input-group-sm border rounded-2 bg-light">
          <span className="input-group-text bg-transparent border-0"><i className="bi bi-search text-muted"></i></span>
          <input type="text" className="form-control border-0 bg-transparent shadow-none" placeholder="ex: Marriott" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
        </div>
      </div>

      {/* BUDGET */}
      <div className="mb-4 border-top pt-3">
        <p className="small fw-bold mb-2">Budget max : {maxPrice} €</p>
        <input type="range" className="form-range" min="0" max="5000" step="50" value={maxPrice} onChange={(e) => setMaxPrice(parseInt(e.target.value))} />
      </div>

      {/* ÉTOILES */}
      <div className="mb-4 border-top pt-3">
        <p className="small fw-bold mb-2">Nombre d'étoiles</p>
        {[5, 4, 3, 2, 1].map(star => (
          <div className="form-check small mb-2" key={star}>
            <input className="form-check-input" type="checkbox" id={`s-${star}`} checked={selectedStars.includes(star)} onChange={() => toggleFilter(star, selectedStars, setSelectedStars)} />
            <label className="form-check-label text-muted" htmlFor={`s-${star}`}>
              {star} <i className="bi bi-star-fill text-warning extra-small"></i>
            </label>
          </div>
        ))}
      </div>

      {/* SERVICES */}
      <div className="mb-4 border-top pt-3">
        <p className="small fw-bold mb-2">Services hôtel</p>
        {['Piscine', 'Wi-Fi gratuit', 'Parking', 'Spa', 'Salle de sport'].map((s, idx) => (
          <div className="form-check small mb-2" key={idx}>
            <input className="form-check-input" type="checkbox" id={`srv-${idx}`} checked={selectedServices.includes(s)} onChange={() => toggleFilter(s, selectedServices, setSelectedServices)} />
            <label className="form-check-label text-muted" htmlFor={`srv-${idx}`}>{s}</label>
          </div>
        ))}
      </div>

      {/* CHAMBRE */}
      <div className="mb-4 border-top pt-3">
        <p className="small fw-bold mb-2">Dans la chambre</p>
        {['Climatisation', 'Baignoire', 'Cuisine', 'Vue sur mer'].map((re, idx) => (
          <div className="form-check small mb-2" key={idx}>
            <input className="form-check-input" type="checkbox" id={`rm-${idx}`} checked={selectedRoomEquip.includes(re)} onChange={() => toggleFilter(re, selectedRoomEquip, setSelectedRoomEquip)} />
            <label className="form-check-label text-muted" htmlFor={`rm-${idx}`}>{re}</label>
          </div>
        ))}
      </div>

      {/* NOTES */}
      <div className="mb-4 border-top pt-3">
        <p className="small fw-bold mb-2">Note voyageurs</p>
        {[{ id: 'any', label: "Toutes", val: 'any' }, { id: '45', label: '4,5+', val: '4.5' }, { id: '40', label: '4+', val: '4.0' }].map(r => (
          <div className="form-check small mb-1" key={r.id}>
            <input className="form-check-input" type="radio" name={isMobile ? "m-rate" : "p-rate"} id={isMobile ? `m-${r.id}` : r.id} checked={minRating === r.val} onChange={() => setMinRating(r.val)} />
            <label className="form-check-label text-muted" htmlFor={isMobile ? `m-${r.id}` : r.id}>{r.label}</label>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-light min-vh-100 text-dark">
      {/* HEADER */}
      <div className="bg-white border-bottom py-3 sticky-top shadow-sm" style={{ zIndex: 1020 }}>
        <div className="container">
          {!isEditMode ? (
            <div className="d-flex align-items-center justify-content-between bg-light border rounded-pill px-3 py-2 shadow-sm">
              <div className="d-flex align-items-center gap-3 overflow-hidden grow">
                <div className="text-truncate px-2 border-end border-secondary-subtle">
                  <i className="bi bi-geo-alt text-primary"></i> <strong className="ms-1">{city}</strong>
                </div>
                <div className="small fw-bold d-none d-md-block text-nowrap border-end pe-3 border-secondary-subtle">{dates}</div>
                <div className="small fw-bold d-none d-lg-block text-nowrap">{guests}</div>
              </div>
              <div className="d-flex gap-2 ms-2">
                <button className="btn btn-outline-primary rounded-pill px-3 py-1 fw-bold btn-sm shadow-sm" onClick={() => setIsEditMode(true)}>Modifier</button>
                <button className="btn btn-primary rounded-pill px-3 py-1 fw-bold btn-sm shadow-sm d-lg-none" data-bs-toggle="offcanvas" data-bs-target="#offcanvasFilters">Filtres</button>
              </div>
            </div>
          ) : (
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
              <div className="row g-2">
                <div className="col-12 col-md-4">
                  <div className="border rounded-3 p-2">
                    <label className="extra-small fw-bold text-muted d-block">Destination</label>
                    <input type="text" className="form-control border-0 p-0 shadow-none fw-bold" value={city} onChange={(e) => setCity(e.target.value)} />
                  </div>
                </div>
                <div className="col-12 col-md-3">
                   <div className="border rounded-3 p-2">
                    <label className="extra-small fw-bold text-muted d-block">Dates</label>
                    <input type="text" className="form-control border-0 p-0 shadow-none fw-bold small text-truncate" value={dates} onChange={(e) => setDates(e.target.value)} />
                  </div>
                </div>
                <div className="col-12 col-md-2 d-flex gap-2 ms-auto">
                  <button className="btn btn-primary w-100 rounded-3 fw-bold" onClick={() => { setIsEditMode(false); fetchHotelsData(); }}>Rechercher</button>
                  <button className="btn btn-light rounded-3 border" onClick={() => setIsEditMode(false)}><i className="bi bi-x-lg"></i></button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container py-4">
        <div className="row g-4">
          <aside className="col-lg-3 d-none d-lg-block">
            <div className="sticky-top" style={{ top: '100px' }}>
              <div className="card border-0 shadow-sm rounded-4 mb-3 overflow-hidden text-center p-4 bg-primary text-white" style={{ background: 'linear-gradient(45deg, #0d6efd, #0dcaf0)' }}>
                <i className="bi bi-map-fill fs-2 mb-2"></i>
                <button className="btn btn-light btn-sm fw-bold rounded-pill shadow-sm">Afficher sur la carte</button>
              </div>
              <FilterContent />
            </div>
          </aside>

          <main className="col-lg-9">
            <div className="d-flex justify-content-between align-items-center mb-3 px-1">
              <span className="small text-muted fw-bold">{filteredHotels.length} établissements trouvés</span>
              <select className="form-select form-select-sm w-auto border shadow-sm rounded-pill px-3 fw-bold text-primary" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="recommended">Recommandés</option>
                <option value="price_asc">Prix bas</option>
                <option value="rating_desc">Mieux notés</option>
              </select>
            </div>

            {loading ? (
              <div className="text-center py-5"><div className="spinner-border text-primary"></div><p className="mt-3 text-muted">Chargement...</p></div>
            ) : (
              <div className="d-flex flex-column gap-3 pb-5">
                {displayedHotels.map((hotel: any) => (
                  <div key={hotel.id} className="card border-0 shadow-sm overflow-hidden rounded-4 hotel-card-hover transition">
                    <div className="row g-0">
                      <div className="col-md-4 position-relative">
                        <img src={hotel.image} className="img-fluid h-100 w-100 object-fit-cover" alt="" style={{ minHeight: '230px' }} />
                      </div>
                      <div className="col-md-8 p-4 d-flex flex-column">
                        <div className="d-flex justify-content-between">
                          <h5 className="fw-bold mb-1">{hotel.name} <span className="text-warning extra-small">{hotel.stars}★</span></h5>
                          <span className="badge bg-primary px-2 py-1">{hotel.rate}</span>
                        </div>
                        <p className="small text-muted mb-2"><i className="bi bi-geo-alt me-1"></i>{hotel.city}</p>
                        <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-end">
                          <div className="extra-small text-success fw-bold">Annulation gratuite</div>
                          <div className="text-end">
                            <h3 className="fw-bold mb-1">{hotel.price} €</h3>
                            <Link href={`/hotels/${hotel.id}`} className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm">Voir l'offre</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredHotels.length === 0 && <div className="text-center py-5">Aucun hôtel ne correspond à vos critères.</div>}
              </div>
            )}
          </main>
        </div>
      </div>

      <div className="offcanvas offcanvas-bottom rounded-top-5" tabIndex={-1} id="offcanvasFilters" style={{ height: '85vh' }}>
        <div className="offcanvas-header border-bottom">
          <h5 className="offcanvas-title fw-bold">Filtres</h5>
          <button type="button" className="btn-close shadow-none" data-bs-dismiss="offcanvas"></button>
        </div>
        <div className="offcanvas-body bg-light"><FilterContent isMobile={true} /></div>
        <div className="p-3 border-top bg-white"><button className="btn btn-primary w-100 rounded-pill py-3 fw-bold" data-bs-dismiss="offcanvas">Voir les résultats</button></div>
      </div>

      <style jsx>{`
        .extra-small { font-size: 0.7rem; }
        .transition { transition: all 0.3s ease; }
        .hotel-card-hover:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(0,0,0,0.1) !important; }
        .rounded-top-5 { border-top-left-radius: 2.5rem !important; border-top-right-radius: 2.5rem !important; }
      `}</style>
    </div>
  );
}