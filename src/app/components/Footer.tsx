'use client';

import Link from 'next/link';

export default function Footer() {
  const footerLinks = {
    societe: [
      { label: 'À propos', href: '/about' },
      { label: 'Notre équipe', href: '/team' },
      { label: 'Carrières', href: '/careers' },
      { label: 'Partenaires', href: '/partners' },
    ],
    services: [
      { label: 'Sur mesure', href: '/custom' },
      { label: 'Croisières', href: '/cruises' },
      { label: 'Séjours luxe', href: '/luxury' },
      { label: 'Assurance voyage', href: '/insurance' },
    ],
    contact: {
      phone: '+33 (0)1 23 45 67 89',
      email: 'contact@officielvacances.com',
      address: '7 Place du Sextant, Paris',
    },
  };

  const socialLinks = [
    { icon: 'fa-instagram', href: 'https://instagram.com' },
    { icon: 'fa-tiktok', href: 'https://tiktok.com' },
    { icon: 'fa-facebook-f', href: 'https://facebook.com' },
    { icon: 'fa-twitter', href: 'https://twitter.com' },
  ];

  return (
    <footer className="footer-modern pt-16 sm:pt-24 pb-8 sm:pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-16 mb-16 sm:mb-20">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-paper-plane text-white"></i>
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-900">
                OfficielVacances<span className="text-sky-600">.</span>
              </span>
            </Link>
            <p className="text-slate-500 leading-relaxed font-medium">
              Créateur d'expériences uniques à travers le monde. Nous transformons vos rêves en itinéraires inoubliables.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                >
                  <i className={`fa-brands ${social.icon} text-lg`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Société Column */}
          <div>
            <h4 className="text-lg font-black mb-6 sm:mb-8 italic text-slate-900">Société</h4>
            <ul className="space-y-3 sm:space-y-4 text-slate-500 font-semibold">
              {footerLinks.societe.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="hover:text-sky-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="text-lg font-black mb-6 sm:mb-8 italic text-slate-900">Services</h4>
            <ul className="space-y-3 sm:space-y-4 text-slate-500 font-semibold">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="hover:text-sky-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-lg font-black mb-6 sm:mb-8 italic text-slate-900">Contact</h4>
            <ul className="space-y-3 sm:space-y-4 text-slate-500 font-semibold">
              <li className="flex items-center gap-3">
                <i className="fa-solid fa-phone text-sky-500"></i>
                <span>{footerLinks.contact.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fa-solid fa-envelope text-sky-500"></i>
                <a
                  href={`mailto:${footerLinks.contact.email}`}
                  className="hover:text-sky-600 transition-colors"
                >
                  {footerLinks.contact.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <i className="fa-solid fa-location-dot text-sky-500"></i>
                <span>{footerLinks.contact.address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 sm:pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 text-slate-400 font-bold text-xs sm:text-sm uppercase tracking-widest">
          <p>© 2025 OfficielVacances. Tous droits réservés.</p>
          <div className="flex gap-6 sm:gap-8">
            <Link href="/legal" className="hover:text-slate-900 transition-colors">
              Mentions légales
            </Link>
            <Link href="/privacy" className="hover:text-slate-900 transition-colors">
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
