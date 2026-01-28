'use client';
import { useEffect, useState, useRef } from 'react'; // useRef ajouté
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import { registerLocale } from "react-datepicker";
import fr from 'date-fns/locale/fr';
import "react-datepicker/dist/react-datepicker.css";

registerLocale('fr', fr);

export default function HomePage() {
  const [recent, setRecent] = useState<any[]>([]);
  const [city, setCity] = useState('');
  const [activeTab, setActiveTab] = useState('stays');
  const [showTravelers, setShowTravelers] = useState(false);
  const [travelers, setTravelers] = useState({ adults: 2, children: 0, rooms: 1 });
  
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

  const router = useRouter();

  // --- ÉTAPE 1 : RÉFÉRENCE ET LOGIQUE DE CLIC EXTÉRIEUR ---
  const travelerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (travelerRef.current && !travelerRef.current.contains(event.target as Node)) {
        setShowTravelers(false);
      }
    }
    // Écoute les clics sur tout le document
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Nettoie l'écouteur quand le composant est détruit
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('recentHotels') || '[]');
    setRecent(saved);
  }, []);

  const updateTravelers = (type: 'adults' | 'children' | 'rooms', operation: 'add' | 'sub') => {
    setTravelers(prev => ({
      ...prev,
      [type]: operation === 'add' ? prev[type] + 1 : Math.max(type === 'children' ? 0 : 1, prev[type] - 1)
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      const path = activeTab === 'flights' ? '/flights' : '/hotels';
      const start = startDate?.toISOString().split('T')[0];
      const end = endDate?.toISOString().split('T')[0];
      const params = `city=${encodeURIComponent(city)}&adults=${travelers.adults}&start=${start}&end=${end}`;
      router.push(`${path}?${params}`);
    }
  };

  return (
    <main className="bg-light min-vh-100 pb-5">
      {/* --- SECTION RECHERCHE (HEADER) --- */}
      <section className="bg-white border-bottom py-5 shadow-sm">
        <div className="container text-center">
          <h1 className="fw-bold text-dark mb-4 mt-2">Où souhaitez-vous aller ?</h1>
          
          <div className="card border shadow-sm rounded-4 mx-auto text-start bg-white" style={{ maxWidth: '1050px' }}>
            <div className="d-flex justify-content-center border-bottom bg-white pt-3">
              {[
                { id: 'stays', label: 'Séjours', icon: '🏨' },
                { id: 'flights', label: 'Vols', icon: '✈️' },
                { id: 'cars', label: 'Voitures', icon: '🚗' },
                { id: 'activities', label: 'Activités', icon: '🎟️' }
              ].map((tab) => (
                <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
                  className={`btn border-0 pb-2 px-4 rounded-0 transition ${activeTab === tab.id ? 'border-bottom border-primary border-3 text-primary fw-bold' : 'text-muted'}`}>
                  <div className="fs-3 mb-1">{tab.icon}</div>
                  <span className="small">{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="p-4">
              <form onSubmit={handleSearch}>
                {activeTab === 'stays' && (
                <div className="bg-white border rounded-pill p-2 shadow-sm d-flex align-items-center flex-wrap flex-md-nowrap">
                  <div className="d-flex align-items-center w-100 flex-wrap flex-md-nowrap">
                    
                    {/* DESTINATION */}
                    <div className="d-flex align-items-center px-4 py-1 grow border-end border-2 border-light">
                      <i className="bi bi-geo-alt fs-5 text-muted me-3"></i>
                      <div className="w-100">
                        <label className="d-block fw-bold text-dark mb-0" style={{ fontSize: '0.75rem' }}>Où allez-vous ?</label>
                        <input 
                          type="text" 
                          className="form-control border-0 p-0 shadow-none fw-normal text-muted bg-transparent" 
                          placeholder="Saisissez une ville" 
                          value={city} 
                          onChange={(e) => setCity(e.target.value)} 
                          required 
                        />
                      </div>
                    </div>

                    {/* DATES */}
                    <div className="d-flex align-items-center px-4 py-1 grow border-end border-2 border-light">
                      <i className="bi bi-calendar3 fs-5 text-muted me-3"></i>
                      <div className="w-100 custom-datepicker">
                        <label className="d-block fw-bold text-dark mb-0" style={{ fontSize: '0.75rem' }}>Dates</label>
                        <DatePicker 
                          selected={startDate} 
                          onChange={(dates) => { const [s, e] = dates as [Date | null, Date | null]; setStartDate(s); setEndDate(e); }}
                          startDate={startDate} 
                          endDate={endDate} 
                          selectsRange 
                          locale="fr" 
                          dateFormat="eee d MMM" 
                          placeholderText="Ajouter des dates"
                          className="form-control border-0 p-0 shadow-none fw-normal text-muted bg-transparent cursor-pointer w-100"
                        />
                      </div>
                    </div>

                    {/* VOYAGEURS */}
                    <div className="d-flex align-items-center px-4 py-1 grow position-relative" ref={travelerRef}>
                      <div className="d-flex align-items-center w-100 cursor-pointer" onClick={() => setShowTravelers(!showTravelers)}>
                        <i className="bi bi-person fs-4 text-muted me-3"></i>
                        <div className="w-100">
                          <label className="d-block fw-bold text-dark mb-0" style={{ fontSize: '0.75rem' }}>Voyageurs</label>
                          <div className="fw-normal text-muted small">
                            {travelers.adults + travelers.children} pers, {travelers.rooms} ch.
                          </div>
                        </div>
                      </div>

                      {showTravelers && (
                        <div className="position-absolute bg-white border shadow-lg rounded-4 p-3 mt-3 traveler-popup" style={{ zIndex: 9999, top: '100%', left: 0, minWidth: '280px' }}>
                          {['adults', 'children', 'rooms'].map((id) => (
                            <div key={id} className="d-flex justify-content-between align-items-center mb-3 text-dark">
                              <span className="fw-bold small">{id === 'adults' ? 'Adultes' : id === 'children' ? 'Enfants' : 'Chambres'}</span>
                              <div className="d-flex align-items-center gap-2">
                                <button type="button" className="btn btn-outline-primary btn-sm rounded-circle px-2" onClick={() => updateTravelers(id as any, 'sub')}>-</button>
                                <span className="fw-bold">{(travelers as any)[id]}</span>
                                <button type="button" className="btn btn-outline-primary btn-sm rounded-circle px-2" onClick={() => updateTravelers(id as any, 'add')}>+</button>
                              </div>
                            </div>
                          ))}
                          <button type="button" className="btn btn-primary btn-sm w-100 rounded-pill fw-bold" onClick={() => setShowTravelers(false)}>Terminé</button>
                        </div>
                      )}
                    </div>

                   {/* BOUTON RECHERCHER */}
                  <div className="ps-2 pe-1">
                    <button 
                      type="submit" 
                      className="btn btn-primary rounded-pill px-4 py-3 fw-bold shadow-sm"
                      style={{ minWidth: '140px' }}
                    >
                      Rechercher
                    </button>
                  </div>
                  </div>
                </div>
              )}
                {activeTab !== 'stays' && <div className="py-3 text-center text-muted">Formulaire {activeTab} en cours de développement...</div>}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION : Vos recherches récentes --- */}
      {recent.length > 0 && (
        <section className="container mt-5">
          <h4 className="fw-bold mb-3 text-dark">Vos recherches récentes</h4>
          <div className="row g-3">
            {recent.map((hotel) => (
              <div key={hotel.id} className="col-md-3 col-6">
                <Link href={`/hotels/${hotel.id}`} className="text-decoration-none text-dark">
                  <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 shadow-hover transition">
                    <img src={hotel.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'} className="card-img-top object-fit-cover" height="150" alt={hotel.name} />
                    <div className="card-body p-3 text-truncate">
                      <h6 className="fw-bold mb-1">{hotel.name}</h6>
                      <p className="extra-small text-muted mb-0">{hotel.city}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- SECTION : Vols vers destinations populaires --- */}
      <section className="container mt-5">
        <h4 className="fw-bold mb-3 text-dark">Découvrez des vols vers des destinations populaires</h4>
        <div className="row g-3 text-center text-dark">
          {['Paris', 'Londres', 'Rome', 'New York'].map((dest) => (
            <div key={dest} className="col-md-3 col-6">
              <div className="p-4 bg-white border rounded-4 shadow-sm shadow-hover cursor-pointer transition">
                <div className="fs-2">✈️</div>
                <div className="fw-bold mt-2">{dest}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- SECTION : Hébergement préféré & Types de voyages --- */}
      <section className="container mt-5">
        <h4 className="fw-bold mb-3 text-dark">Découvrez votre nouvel hébergement préféré</h4>
        <div className="row g-4 text-dark">
          <div className="col-md-4">
            <div className="card rounded-4 border-0 shadow-sm overflow-hidden h-100 shadow-hover transition">
              <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb" height="200" className="object-fit-cover" alt="Luxe" />
              <div className="card-body">
                <h6 className="fw-bold">Séjours de Luxe</h6>
                <p className="small text-muted">Évadez-vous dans le confort absolu.</p>
              </div>
            </div>
          </div>
          <div className="col-md-8">
             <div className="bg-warning p-4 rounded-4 h-100 d-flex flex-column justify-content-center">
                <h3 className="fw-bold">Des hébergements pour tout type de voyage</h3>
                <p>Que ce soit pour le travail ou le plaisir, nous avons ce qu'il vous faut.</p>
                <button className="btn btn-dark w-fit rounded-pill px-4">En savoir plus</button>
             </div>
          </div>
        </div>
      </section>

      {/* --- SECTION : Formules vacances --- */}
      <section className="container mt-5">
        <h4 className="fw-bold mb-3 text-dark">Découvrez les formules vacances</h4>
        <div className="row g-3">
          {['Plage', 'Ski', 'Aventure', 'Croisière'].map((f) => (
            <div key={f} className="col-md-3">
               <div className="card rounded-4 border-0 shadow-sm overflow-hidden text-white shadow-hover transition">
                 <img src={`https://images.unsplash.com/photo-1507525428034-b723cf961d3e`} height="120" className="object-fit-cover brightness-50" alt={f} />
                 <div className="card-img-overlay d-flex align-items-center justify-content-center">
                    <h5 className="fw-bold">{f}</h5>
                 </div>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- SECTION : FORMULES VACANCES DESTINATIONS POPULAIRES --- */}
      <section className="container mt-5">
        <h4 className="fw-bold mb-3 text-dark">Découvrez les formules vacances pour les destinations populaires</h4>
        <div className="d-flex gap-4 border-bottom mb-4 overflow-x-auto hide-scrollbar text-dark">
          {['Antalya', 'Istanbul', 'Paris', 'Phuket', 'Bogotá'].map((city, i) => (
            <span key={city} className={`pb-2 cursor-pointer small ${i === 0 ? 'border-bottom border-primary border-3 fw-bold text-primary' : 'text-muted'}`}>{city}</span>
          ))}
        </div>
        <div className="row g-3">
          {[
            { hotel: "Swandor Hotels & Resort", loc: "Antalya", price: 1350, old: 2716, img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d" },
            { hotel: "Concorde De Luxe Resort", loc: "Antalya", price: 1528, old: 1837, img: "https://images.unsplash.com/photo-1561501900-3701fa6a0864" }
          ].map((item, i) => (
            <div key={i} className="col-md-6 col-12 text-dark">
              <div className="card border-0 rounded-4 overflow-hidden shadow-sm d-flex flex-row h-100 shadow-hover transition">
                <img src={item.img} width="40%" className="object-fit-cover" alt={item.hotel} />
                <div className="card-body p-3">
                  <div className="badge bg-dark text-white mb-2">VIP Access</div>
                  <h6 className="fw-bold small">{item.hotel}</h6>
                  <p className="extra-small text-muted mb-2">{item.loc}</p>
                  <div className="text-decoration-line-through text-muted extra-small">{item.old} €</div>
                  <div className="fw-bold h5 text-primary">{item.price} €</div>
                  <div className="extra-small text-muted">par personne</div>
                  <div className="badge bg-success mt-2">Réduction appliquée</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- SECTION : EXPLOREZ CES SÉJOURS UNIQUES --- */}
      <section className="container mt-5">
        <h4 className="fw-bold mb-1 text-dark">Explorez ces séjours uniques</h4>
        <p className="text-muted small mb-3">Offres affichées : du 16 janv. au 18 janv.</p>
        <div className="row g-3 overflow-x-auto flex-nowrap pb-2 hide-scrollbar">
          {[
            { name: "Artemisia Resort", loc: "Ragusa", price: 142, rate: 9.8, img: "https://images.unsplash.com/photo-1566073771259-6a8506099945" },
            { name: "Terre di Himera", loc: "Termini Imerese", price: 458, rate: 9.6, img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4" },
            { name: "Agriturismo Il Granaio", loc: "Modica", price: 251, rate: 9.4, img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb" },
            { name: "Relais Chiaramonte", loc: "Ragusa", price: 142, rate: 9.4, img: "https://images.unsplash.com/photo-1564501049412-61c2a3083791" }
          ].map((item, i) => (
            <div key={i} className="col-md-3 col-10">
              <div className="card border-0 rounded-4 overflow-hidden shadow-sm h-100 text-dark shadow-hover transition">
                <img src={item.img} height="180" className="object-fit-cover" alt={item.name} />
                <div className="card-body p-3">
                  <div className="d-flex align-items-center mb-1">
                    <span className="badge bg-success me-2">{item.rate}</span>
                    <span className="small fw-bold">Exceptionnel</span>
                  </div>
                  <h6 className="fw-bold mb-0">{item.name}</h6>
                  <p className="small text-muted mb-2">{item.loc}</p>
                  <div className="fw-bold h5 mb-0">{item.price} €</div>
                  <div className="extra-small text-muted">par nuit</div>
                  <div className="badge bg-success-subtle text-success mt-2">-10%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* --- FOOTER / TEXTE DE FIN --- */}
      <section className="container mt-5 mb-5 text-dark text-center">
        <h4 className="fw-bold">Explorez un monde de voyages avec OfficielVacances</h4>
        <p className="text-muted small mx-auto" style={{maxWidth: '700px'}}>Réservez vos hébergements, vols et voitures partout dans le monde avec les meilleures offres garanties.</p>
      </section>

      <style jsx global>{`
        .custom-datepicker .react-datepicker-wrapper { width: 100%; }
        .react-datepicker__header { background-color: white; border-bottom: none; }
        .react-datepicker__day--selected, .react-datepicker__day--in-range { background-color: #0d6efd !important; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .shadow-hover:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important; }
        @media (max-width: 768px) {
          .traveler-popup { position: fixed !important; bottom: 0; left: 0 !important; right: 0 !important; top: auto !important; width: 100% !important; border-radius: 20px 20px 0 0 !important; padding: 2rem !important; }
        }
        @media (min-width: 769px) { .traveler-popup { min-width: 260px; right: 0; } }
      `}</style>
    </main>
  );
}