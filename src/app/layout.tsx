import './globals.css';
import 'nprogress/nprogress.css';
import { Suspense } from 'react';
import NavigationEvents from './components/navigation-events';
import Script from 'next/script';

export const metadata = {
  title: 'OfficielVacances | Réservez vos voyages de rêve',
  description: 'Réservez hôtels, vols et voitures pour vos prochaines vacances.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased">
        <Suspense fallback={null}>
          <NavigationEvents />
        </Suspense>

        {children}

        <Script 
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}