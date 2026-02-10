'use client';

import React, { useState, useRef, useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { fr } from 'date-fns/locale';
import { format, addDays, differenceInDays } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';

// Enregistrer la locale française
registerLocale('fr', fr);

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (dates: [Date | null, Date | null]) => void;
  minDate?: Date;
  placeholder?: string;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onChange,
  minDate = new Date(),
  placeholder = 'Sélectionnez vos dates'
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [flexibility, setFlexibility] = useState<'exact' | '1' | '2' | '3' | '7'>('exact');
  const containerRef = useRef<HTMLDivElement>(null);

  // Fermer le popup quand on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    onChange(dates);
    // Fermer si les deux dates sont sélectionnées
    if (dates[0] && dates[1]) {
      setIsOpen(false);
    }
  };

  const formatDisplayDate = () => {
    if (!startDate) return placeholder;
    
    const start = format(startDate, 'EEE dd MMM', { locale: fr });
    
    if (!endDate) return `${start} → ...`;
    
    const end = format(endDate, 'EEE dd MMM', { locale: fr });
    const nights = differenceInDays(endDate, startDate);
    
    return `${start}  →  ${end} (${nights} nuit${nights > 1 ? 's' : ''})`;
  };

  const flexibilityOptions = [
    { key: 'exact', label: 'Dates exactes' },
    { key: '1', label: '± 1 jour' },
    { key: '2', label: '± 2 jours' },
    { key: '3', label: '± 3 jours' },
    { key: '7', label: '± 7 jours' },
  ] as const;

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input unique affichant les deux dates */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-xl font-semibold text-slate-800 hover:bg-white focus:border-sky-500 focus:bg-white outline-none transition-all"
      >
        <div className="flex items-center gap-3">
          <i className="fa-regular fa-calendar text-slate-400 text-lg"></i>
          <span className={!startDate ? 'text-slate-400' : ''}>
            {formatDisplayDate()}
          </span>
        </div>
        <i className={`fa-solid fa-chevron-down text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>

      {/* Popup du calendrier */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 p-4 min-w-[600px]">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 mb-4">
            <button className="flex-1 pb-3 text-sky-500 font-semibold border-b-2 border-sky-500">
              Calendrier
            </button>
            <button className="flex-1 pb-3 text-slate-500 font-medium hover:text-slate-700">
              Dates flexibles
            </button>
          </div>

          {/* Double Calendrier */}
          <div className="flex justify-center">
            <DatePicker
              selected={startDate}
              onChange={handleDateChange}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              inline
              monthsShown={2}
              minDate={minDate}
              locale="fr"
              calendarClassName="custom-double-calendar"
              dayClassName={(date) => {
                if (!startDate || !endDate) return '';
                if (date >= startDate && date <= endDate) return 'in-range';
                return '';
              }}
            />
          </div>

          {/* Options de flexibilité */}
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
            {flexibilityOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setFlexibility(opt.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  flexibility === opt.key
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Bouton Valider */}
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setIsOpen(false)}
              className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl transition-colors"
            >
              Valider
            </button>
          </div>
        </div>
      )}
    </div>
  );
}