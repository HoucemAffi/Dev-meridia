'use client';

import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';

interface HeaderProps {
  onSectionChange?: (section: string) => void;
  currentSection?: string;
}

export default function Header({ onSectionChange, currentSection = 'home' }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Accueil', href: '/' },
    { id: 'destinations', label: 'Destinations', href: '#destinations' },
    { id: 'hotels', label: 'Hôtels', href: '/hotels' },
    { id: 'avis', label: 'Avis', href: '#avis' },
  ];

  return (
    <nav className="nav-glass fixed w-full z-100 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Logo */}
       {/* <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-sky-600 rounded-xl flex items-center justify-center shadow-lg shadow-sky-200">
            <i className="fa-solid fa-paper-plane text-white text-sm sm:text-base"></i>
          </div>
          <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
            OfficielVacances<span className="text-sky-600">.</span>
          </span>
        </Link>*/}
        <div className="flex items-center">
          <Image 
            src="/Meridia-Voyages.png" 
            alt="Meridia Voyages" 
            width={200} 
            height={50} 
            className="h-12 w-auto"
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 lg:gap-10 font-semibold text-slate-600">
          {navItems.map((item) => (
            item.href.startsWith('#') ? (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  if (onSectionChange && item.id !== 'destinations' && item.id !== 'avis') {
                    e.preventDefault();
                    onSectionChange(item.id);
                  }
                }}
                className={`hover:text-sky-600 transition-colors ${
                  currentSection === item.id ? 'text-sky-600' : ''
                }`}
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.id}
                href={item.href}
                className={`hover:text-sky-600 transition-colors ${
                  currentSection === item.id ? 'text-sky-600' : ''
                }`}
              >
                {item.label}
              </Link>
            )
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Language & Help - Hidden on mobile */}
          <div className="hidden lg:flex items-center gap-4 text-sm font-semibold text-slate-600">
            <button className="hover:text-sky-600 transition-colors">
              <i className="fas fa-globe mr-1"></i>
              Français
            </button>
            <button className="hover:text-sky-600 transition-colors">
              Assistance
            </button>
          </div>

          {/* My Trips */}
          <Link
            href="/trips"
            className="hidden sm:flex text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors"
          >
            Mes voyages
          </Link>

          {/* Login Button */}
          <button className="bg-slate-900 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-sm hover:bg-sky-600 transition-all shadow-lg shadow-slate-200">
            Se connecter
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center text-slate-600"
          >
            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-lg">
          <div className="px-6 py-4 space-y-4">
            {navItems.map((item) => (
              item.href.startsWith('#') ? (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => {
                    setIsMobileMenuOpen(false);
                    if (onSectionChange && item.id !== 'destinations' && item.id !== 'avis') {
                      e.preventDefault();
                      onSectionChange(item.id);
                    }
                  }}
                  className="block py-2 font-semibold text-slate-600 hover:text-sky-600 transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 font-semibold text-slate-600 hover:text-sky-600 transition-colors"
                >
                  {item.label}
                </Link>
              )
            ))}
            <div className="pt-4 border-t border-slate-100">
              <Link
                href="/trips"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 font-semibold text-slate-600 hover:text-sky-600 transition-colors"
              >
                Mes voyages
              </Link>
              <button className="block py-2 font-semibold text-slate-600 hover:text-sky-600 transition-colors">
                <i className="fas fa-globe mr-2"></i>
                Français
              </button>
              <button className="block py-2 font-semibold text-slate-600 hover:text-sky-600 transition-colors">
                <i className="fas fa-headset mr-2"></i>
                Assistance
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
