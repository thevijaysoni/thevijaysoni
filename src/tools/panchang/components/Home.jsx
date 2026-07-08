import React from 'react';
import { Sun, Sunset, Moon, Sunrise, ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import { calculatePanchang } from '../utils/panchangEngine';
import { getFestivalsForDay } from '../utils/festivals';

export default function Home({ currentDate, setCurrentDate, location, lang, translations }) {
  const panchang = calculatePanchang(currentDate, location.lat, location.lon, location.tz);
  const t = translations[lang];

  // Get previous panchang to detect transitions/crossovers
  const prevDate = new Date(currentDate.getTime() - 24 * 3600 * 1000);
  const prevPanchang = calculatePanchang(prevDate, location.lat, location.lon, location.tz);
  const dayFestivals = getFestivalsForDay(panchang, prevPanchang);

  // Format date for header
  const formatDate = (date) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString(lang === 'en' ? 'en-US' : 'hi-IN', options);
  };

  const changeDay = (days) => {
    const nextDate = new Date(currentDate.getTime() + days * 24 * 3600 * 1000);
    setCurrentDate(nextDate);
  };

  // Helper to format time safely
  const formatTime = (dateObj) => {
    if (!dateObj) return '--:--';
    return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  // Helper to format date and time safely
  const formatDateTime = (dateObj) => {
    if (!dateObj) return '--';
    const weekdayLong = dateObj.toLocaleDateString(lang === 'en' ? 'en-US' : 'hi-IN', { weekday: 'long' });
    const day = dateObj.getDate();
    const monthLong = dateObj.toLocaleDateString(lang === 'en' ? 'en-US' : 'hi-IN', { month: 'long' });
    const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    return `${weekdayLong}, ${day} ${monthLong}, ${time}`;
  };

  // Helper to get translated names of Panchang elements
  const getTithiName = (number, paksha) => {
    // index is number - 1 for Shukla, or number - 16 + 15 for Krishna
    const idx = number - 1;
    return t.tithis[idx] || '';
  };

  const getNakshatraName = (number) => {
    return t.nakshatras[number - 1] || '';
  };

  const getYogaName = (number) => {
    return t.yogas[number - 1] || '';
  };

  const getKaranaName = (number) => {
    return t.karanas[number - 1] || '';
  };

  return (
    <div>
      {/* Date Navigation */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <button onClick={() => changeDay(-1)} className="header-circle-btn" style={{ width: 40, height: 40 }} aria-label="Previous Day">
          <ArrowLeft size={20} />
        </button>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{formatDate(currentDate)}</h2>
          {currentDate.toDateString() !== new Date().toDateString() && (
            <button
              onClick={() => setCurrentDate(new Date())}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary-color)',
                fontSize: '0.85rem',
                fontWeight: 700,
                marginTop: '4px',
                padding: '2px 8px',
                textDecoration: 'underline',
                cursor: 'pointer'
              }}
            >
              {t.today}
            </button>
          )}
        </div>
        <button onClick={() => changeDay(1)} className="header-circle-btn" style={{ width: 40, height: 40 }} aria-label="Next Day">
          <ArrowRight size={20} />
        </button>
      </div>

      {/* Main Tithi Banner */}
      <div className="glass-card" style={{ textAlign: 'center', padding: '24px 20px' }}>
        <div style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
          {t.tithi}
        </div>
        <div className="big-tithi-title" style={{ marginTop: '4px' }}>
          {panchang.tithi.paksha === 'Shukla' ? t.shukla : t.krishna} - {getTithiName(panchang.tithi.number, panchang.tithi.paksha)}
        </div>
        <div style={{ fontSize: '1rem', color: 'var(--text-muted)', marginTop: '8px', fontWeight: 500 }}>
          {t.starts}: {panchang.tithi.start ? formatDateTime(panchang.tithi.start) : '--'} | {t.ends}: {panchang.tithi.end ? formatDateTime(panchang.tithi.end) : '--'}
        </div>

        {/* Tithi Completion Progress Bar */}
        <div className="progress-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>
            <span>{t.completed}</span>
            <span>{panchang.tithi.completion}%</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${panchang.tithi.completion}%` }}></div>
          </div>
        </div>

        {/* Dynamic Festivals for Today */}
        {dayFestivals.length > 0 && (
          <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {dayFestivals.map(fest => (
              <span key={fest.id} className="badge-auspicious" style={{ padding: '6px 12px', fontSize: '0.95rem', borderRadius: '30px', border: '1px solid var(--primary-color)' }}>
                🎉 {fest.nameKeys[lang] || fest.nameKeys['en']}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Sunrise / Sunset & Moonrise / Moonset */}
      <div className="timings-row" style={{ marginBottom: '10px' }}>
        <div className="timing-card">
          <div className="timing-card-icon" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
            <Sun size={20} />
          </div>
          <div className="timing-card-text">
            <h4>{t.sunrise}</h4>
            <p>{formatTime(panchang.timings.sunrise)}</p>
          </div>
        </div>
        <div className="timing-card">
          <div className="timing-card-icon" style={{ background: 'linear-gradient(135deg, #475569 0%, #1e293b 100%)' }}>
            <Sunset size={20} />
          </div>
          <div className="timing-card-text">
            <h4>{t.sunset}</h4>
            <p>{formatTime(panchang.timings.sunset)}</p>
          </div>
        </div>
      </div>

      <div className="timings-row" style={{ marginBottom: '20px' }}>
        <div className="timing-card">
          <div className="timing-card-icon" style={{ background: 'linear-gradient(135deg, #c084fc 0%, #a855f7 100%)' }}>
            <Moon size={20} />
          </div>
          <div className="timing-card-text">
            <h4>{t.moonrise}</h4>
            <p>{formatTime(panchang.timings.moonrise)}</p>
          </div>
        </div>
        <div className="timing-card">
          <div className="timing-card-icon" style={{ background: 'linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)' }}>
            <Moon size={20} style={{ transform: 'rotate(180deg)' }} />
          </div>
          <div className="timing-card-text">
            <h4>{t.moonset}</h4>
            <p>{formatTime(panchang.timings.moonset)}</p>
          </div>
        </div>
      </div>

      {/* Astro Details Grid */}
      <div className="details-grid" style={{ marginBottom: '20px' }}>
        <div className="detail-item">
          <span className="detail-label">{t.nakshatra}</span>
          <span className="detail-value">{getNakshatraName(panchang.nakshatra.number)}</span>
          <span className="detail-sub">{t.ends}: {formatTime(panchang.nakshatra.end)}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">{t.yoga}</span>
          <span className="detail-value">{getYogaName(panchang.yoga.number)}</span>
          <span className="detail-sub">{t.ends}: {formatTime(panchang.yoga.end)}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">{t.karana}</span>
          <span className="detail-value">{getKaranaName(panchang.karana.number)}</span>
          <span className="detail-sub">{t.ends}: {formatTime(panchang.karana.end)}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">{t.lunarMonth}</span>
          <span className="detail-value">{t.monthNames[panchang.lunarMonth.amantaIndex]}</span>
          <span className="detail-sub">{panchang.samvat.vikram} {t.vikramSamvat}</span>
        </div>
      </div>

      {/* Brahma Muhurta & Rahu Kaal Quick Overview */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
          🕒 {t.muhurtas}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontWeight: 700 }}>{t.brahmaMuhurta}</span>
              <span className="badge-auspicious" style={{ marginLeft: '8px', fontSize: '0.75rem' }}>{t.auspicious}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 600 }}>
              <Clock size={14} color="var(--primary-color)" />
              <span>{formatTime(panchang.timings.brahmaStart)} - {formatTime(panchang.timings.brahmaEnd)}</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontWeight: 700 }}>{t.rahuKaal}</span>
              <span className="badge-inauspicious" style={{ marginLeft: '8px', fontSize: '0.75rem' }}>{t.inauspicious}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 600 }}>
              <Clock size={14} color="var(--primary-color)" />
              <span>{formatTime(panchang.timings.rahuStart)} - {formatTime(panchang.timings.rahuEnd)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
