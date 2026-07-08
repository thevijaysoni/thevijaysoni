import React, { useState, useMemo } from 'react';
import { Search, Calendar } from 'lucide-react';
import { getFestivalsForYear } from '../utils/festivals';

export default function FestivalsTab({ currentDate, location, lang, translations }) {
  const t = translations[lang];
  const [searchQuery, setSearchQuery] = useState('');
  
  // Calculate all festivals for the current year
  const currentYear = currentDate.getFullYear();
  const allFestivals = useMemo(() => {
    return getFestivalsForYear(currentYear, location.lat, location.lon, location.tz);
  }, [currentYear, location.lat, location.lon, location.tz]);

  // Filter festivals based on search and sort chronologically
  const filteredFestivals = useMemo(() => {
    return allFestivals
      .filter(fest => {
        const name = (fest.nameKeys[lang] || fest.nameKeys['en'] || '').toLowerCase();
        const search = searchQuery.toLowerCase();
        return name.includes(search);
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [allFestivals, searchQuery, lang]);

  // Format date display
  const formatDate = (dateObj) => {
    return dateObj.toLocaleDateString(lang === 'en' ? 'en-US' : 'hi-IN', {
      day: 'numeric',
      month: 'long',
      weekday: 'short'
    });
  };

  return (
    <div>
      <h2 className="view-title">
        <span>{t.upcomingFestivals} ({currentYear})</span>
      </h2>

      {/* Large accessible search input */}
      <div className="glass-card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <Search size={22} color="var(--text-muted)" />
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-input"
          style={{ border: 'none', background: 'transparent', padding: 0, fontSize: '1.1rem' }}
        />
      </div>

      {/* Festivals List */}
      <div className="glass-card" style={{ padding: 0 }}>
        {filteredFestivals.length > 0 ? (
          filteredFestivals.map((fest, idx) => {
            const isToday = fest.date.toDateString() === currentDate.toDateString();
            const isPast = fest.date.getTime() < new Date().setHours(0,0,0,0);
            return (
              <div
                key={`${fest.id}-${idx}`}
                className="list-item"
                style={{
                  background: isToday ? 'var(--primary-light)' : '',
                  borderLeft: isToday ? '4px solid var(--primary-color)' : '',
                  opacity: isPast ? 0.6 : 1
                }}
              >
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                    {fest.nameKeys[lang] || fest.nameKeys['en']}
                  </h4>
                  {isToday && (
                    <span className="badge-auspicious" style={{ fontSize: '0.7rem', display: 'inline-block', marginTop: '4px' }}>
                      {t.today}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 600 }}>
                  <Calendar size={16} />
                  <span>{formatDate(fest.date)}</span>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
            {t.noFestivalsFound}
          </div>
        )}
      </div>
    </div>
  );
}
