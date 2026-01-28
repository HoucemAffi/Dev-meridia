# 🔌 Guide d'Intégration Backend

## Pour la Développeuse Backend JavaScript

Ce document explique comment intégrer votre backend avec le frontend UI Design qu'on vient de créer.

---

## 📌 Point de Connexion Principal

Le frontend appelle **une seule route API** pour récupérer les hôtels:

```
GET /api/hotels?city={destination}
```

### Localisation dans le code
**Fichier**: `src/app/api/hotels/route.ts` (ligne 70-85)

```typescript
const fetchHotelsData = async () => {
  setLoading(true);
  try {
    const res = await fetch(`/api/hotels?city=${city}`);  // ← C'est ici
    const data = await res.json();
    setHotels(data);
  } catch (error) {
    console.error("Erreur API:", error);
  } finally {
    setLoading(false);
  }
};
```

---

## 🎯 Structure Attendue

### Endpoint Backend

Votre backend doit fournir:

```
METHOD: GET
URL: http://localhost:3001/api/hotels (ou votre port)
QUERY PARAMS: city=Paris (optionnel)
RESPONSE: Array of Hotel Objects
```

### Format des Réponses

#### Succès (200 OK)
```json
[
  {
    "id": "1",
    "name": "Artemisia Resort",
    "city": "Ragusa",
    "price": 142,
    "rate": 9.8,
    "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    "address": "Via Cavalieri Malta, Ragusa, Italy",
    "stars": 5,
    "meals": ["Petit-déjeuner inclus"],
    "services": ["Wi-Fi gratuit", "Piscine", "Spa"],
    "roomEquip": ["Climatisation", "Vue sur la mer"]
  },
  {
    "id": "2",
    "name": "Terre di Himera",
    ...
  }
]
```

#### Erreur (500)
```json
{
  "error": "Failed to fetch hotels"
}
```

---

## 📊 Champs Obligatoires vs Optionnels

### ✅ Champs OBLIGATOIRES
```typescript
{
  id: string | number,         // Identifiant unique
  name: string,                // Nom de l'hôtel
  city: string,                // Ville
  price: number,               // Prix en €
  rate: number,                // Note (0-10)
  image: string                // URL image valide
}
```

### 📝 Champs OPTIONNELS (enrichissement UI)
```typescript
{
  address?: string,            // Adresse complète
  stars?: number,              // Étoiles (1-5)
  meals?: string[],            // Repas proposés
  services?: string[],         // Services disponibles
  roomEquip?: string[]         // Équipements chambre
}
```

---

## 🔄 Flux Complet Frontend → Backend

```
┌─────────────────┐
│  Frontend        │
│  SearchFilters  │
└────────┬────────┘
         │ "Paris" saisi
         ▼
    ┌─────────────────────────────────────┐
    │ Redirection vers                     │
    │ /hotels?city=Paris                  │
    └─────────────────────────────────────┘
         │
         ▼
    ┌──────────────────────────────────────┐
    │ hotels/page.tsx                       │
    │ - Récupère city du searchParams       │
    │ - Appel fetch(/api/hotels?city=Paris)│
    └────────────┬─────────────────────────┘
         │
         ▼
    ┌──────────────────────────────────────┐
    │ Route Handler                         │
    │ /src/app/api/hotels/route.ts         │
    │ - Reçoit query: ?city=Paris          │
    │ - Retourne HOTEL_DATABASE (mockées)  │
    └────────────┬─────────────────────────┘
         │
         ▼
    [À REMPLACER PAR]
    ┌──────────────────────────────────────┐
    │ Votre Backend JavaScript             │
    │ POST http://localhost:3001/api/hotels│
    │ - Requête: ?city=Paris               │
    │ - Répond: Array d'hôtels             │
    └────────────┬─────────────────────────┘
         │
         ▼
    Frontend reçoit JSON
    │
    └─► HotelCard affiche chaque hôtel
    └─► Filtres côté client s'appliquent
    └─► Tri fonctionne
```

---

## 🛠️ Modification du Route Handler

**Fichier à modifier**: `src/app/api/hotels/route.ts`

### Version Actuelle (Mockée)
```typescript
const HOTEL_DATABASE = [
  { id: "1", name: "Artemisia Resort", ... },
  ...
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cityQuery = searchParams.get('city')?.toLowerCase() || "";

  const results = cityQuery 
    ? HOTEL_DATABASE.filter(h => h.city.toLowerCase().includes(cityQuery))
    : HOTEL_DATABASE;

  return NextResponse.json(results);
}
```

### À Remplacer Par
```typescript
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cityQuery = searchParams.get('city') || '';

    // Appel à votre backend
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/api/hotels?city=${cityQuery}`);
    
    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }
    
    const hotels = await response.json();
    return NextResponse.json(hotels);
  } catch (error) {
    console.error('Error fetching from backend:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hotels' },
      { status: 500 }
    );
  }
}
```

---

## 🌍 Variable d'Environnement

Créer un fichier `.env.local`:
```
BACKEND_URL=http://localhost:3001
```

Ou en production:
```
BACKEND_URL=https://api.votredomaine.com
```

---

## 📋 Exemple de Requête Backend

### Node.js / Express
```javascript
app.get('/api/hotels', async (req, res) => {
  const { city } = req.query;
  
  // Filtrer dans votre DB
  let hotels = await Hotel.find();
  
  if (city) {
    hotels = hotels.filter(h => 
      h.city.toLowerCase().includes(city.toLowerCase())
    );
  }
  
  res.json(hotels);
});
```

### Node.js / NestJS
```typescript
@Get('hotels')
async getHotels(@Query('city') city?: string) {
  let hotels = await this.hotelService.findAll();
  
  if (city) {
    hotels = hotels.filter(h => 
      h.city.toLowerCase().includes(city.toLowerCase())
    );
  }
  
  return hotels;
}
```

---

## 🧪 Tests & Validation

### Tester Localement
1. Démarrer le backend sur le port 3001
2. Ajouter `BACKEND_URL=http://localhost:3001` dans `.env.local`
3. Redémarrer le frontend: `npm run dev`
4. Aller sur `http://localhost:3000/hotels?city=Paris`
5. Ouvrir DevTools (F12) → Network → Vérifier l'appel `/api/hotels?city=Paris`

### Erreurs Courantes

| Erreur | Cause | Solution |
|--------|-------|----------|
| CORS error | Backend refusant les requêtes cross-origin | Ajouter les headers CORS au backend |
| 404 Not Found | Backend URL incorrecte | Vérifier `BACKEND_URL` et le port |
| undefined data | Format de réponse incorrect | Vérifier la structure du JSON |
| Timeout | Backend trop lent | Augmenter le timeout ou optimiser |

---

## 🔐 CORS (Important!)

Si votre backend est sur un domaine différent, ajouter les headers:

### Express
```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
```

### NestJS
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3001);
}
bootstrap();
```

---

## 📚 Données Actuelles (à Remplacer)

12 hôtels mockés sont actuellement utilisés comme données de test:

```
1. Artemisia Resort (Ragusa) - 142€
2. Terre di Himera (Termini Imerese) - 458€
3. Hôtel Royal Victoria (Tunis) - 120€
4. Hôtel Eiffel Seine (Paris) - 310€
5. The Manhattan Hotel (New York) - 550€
6. La Badira (Tunis) - 280€
7. Golden Tulip El Mechtel (Tunis) - 909€
8. Dar Fatma (Tunis) - 862€
9. Royal Victoria - Ex British Embassy (Tunis) - 1120€
10. Radisson Hotel Tunis, City Center (Tunis) - 1242€
11. The Residence Tunis (Tunis) - 1932€
12. Royal Thalassa Monastir (Tunis) - 871€
```

Une fois le backend intégré, ces données mockées ne seront plus utilisées.

---

## 🎯 Cas d'Usage

### Recherche par Ville
```
Frontend: /hotels?city=Paris
Backend: Retourne tous les hôtels à Paris
```

### Sans Filtre
```
Frontend: /hotels
Backend: Retourne TOUS les hôtels (limite conseillée: 100)
```

### Filtres Avancés (À faire côté client)
Les filtres suivants sont appliqués côté client après la réception des données:
- Recherche par nom
- Budget max
- Note minimale
- Nombre d'étoiles
- Services spécifiques
- Équipements de chambre
- Tri (prix, note)

**Note**: Pour améliorer les performances, ces filtres pourraient être appliqués côté backend.

---

## 📞 Questions Fréquentes

### Q: Qui gère les réservations?
**A**: Actuellement en localStorage côté client. À intégrer au backend.

### Q: Comment paginer les résultats?
**A**: Ajouter `?page=1&limit=20` en paramètres de query.

### Q: Format des images?
**A**: URLs valides (Unsplash, votre CDN, etc.)

### Q: Performances?
**A**: Côté frontend, max 100 hôtels affichés avant pagination.

---

## ✅ Checklist Intégration Backend

- [ ] Endpoint GET /api/hotels créé
- [ ] Paramètre `city` supporté
- [ ] JSON retourné avec la bonne structure
- [ ] CORS activé
- [ ] Tested avec Postman/curl
- [ ] Base de données hôtels peuplée
- [ ] `BACKEND_URL` ajouté au `.env.local` du frontend
- [ ] Frontend redémarré
- [ ] Test complet: Recherche → Affichage → Détail → Réservation

---

**Date**: 28 Janvier 2026  
**Statut**: Prêt pour l'intégration backend  
**Contacts**: Frontend développé avec Next.js 16 + React 19
