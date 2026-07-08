import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Sun, Moon } from 'lucide-react';
import { calculatePanchang } from '../utils/panchangEngine';
import { getFestivalsForDay } from '../utils/festivals';

export default function Calendar({ currentDate, setCurrentDate, location, lang, translations }) {
  const t = translations[lang];
  const [selectedDate, setSelectedDate] = useState(null);
  
  // Current calendar month view state
  const [viewDate, setViewDate] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1));

  const changeMonth = (offset) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay(); // 0 = Sun, 6 = Sat
  };

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

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

  // Build days list
  const days = [];
  // Empty slots for padding before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  // Days of the month
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(new Date(year, month, d));
  }

  // Pre-calculate Panchang summaries for cells
  const getDayDetails = (dayDate) => {
    if (!dayDate) return null;
    const panchang = calculatePanchang(dayDate, location.lat, location.lon, location.tz);
    const prevDate = new Date(dayDate.getTime() - 24 * 3600 * 1000);
    const prevPanchang = calculatePanchang(prevDate, location.lat, location.lon, location.tz);
    const festivals = getFestivalsForDay(panchang, prevPanchang);
    return { panchang, festivals };
  };

  // Helper to get translated names of Panchang elements
  const getTithiName = (number) => {
    return t.tithis[number - 1] || '';
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

  const handleDayClick = (dayDate) => {
    if (!dayDate) return;
    setSelectedDate(dayDate);
  };

  // Modal display details
  const renderPanchangModal = () => {
    if (!selectedDate) return null;
    const details = getDayDetails(selectedDate);
    if (!details) return null;
    const { panchang, festivals } = details;

    const formattedGregorian = selectedDate.toLocaleDateString(lang === 'en' ? 'en-US' : 'hi-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const hinduDateStr = `${t.monthNames[panchang.lunarMonth.amantaIndex]} ${panchang.tithi.paksha === 'Shukla' ? t.shukla : t.krishna} ${getTithiName(panchang.tithi.number)}`;

    return (
      <div className="modal-overlay" onClick={() => setSelectedDate(null)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{formattedGregorian}</h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--primary-color)', fontWeight: 600, marginTop: '2px' }}>{hinduDateStr}</p>
            </div>
            <button className="close-btn" onClick={() => setSelectedDate(null)} aria-label="Close">
              <X size={20} />
            </button>
          </div>
          <div className="modal-body">
            {/* Festivals */}
            {festivals.length > 0 && (
              <div className="glass-card" style={{ background: 'rgba(212, 163, 89, 0.1)', borderStyle: 'solid', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--primary-color)', marginBottom: '8px' }}>🎉 {t.festivals}</h3>
                <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                  {festivals.map(fest => (
                    <li key={fest.id} style={{ fontWeight: 700, fontSize: '1.1rem', margin: '4px 0' }}>
                      • {fest.nameKeys[lang] || fest.nameKeys['en']}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Core Panchang Elements */}
            <div className="details-grid" style={{ marginBottom: '16px' }}>
              <div className="detail-item">
                <span className="detail-label">{t.tithi}</span>
                <span className="detail-value">{getTithiName(panchang.tithi.number)}</span>
                <span className="detail-sub">{t.starts}: {panchang.tithi.start ? formatDateTime(panchang.tithi.start) : '--'}</span>
                <span className="detail-sub">{t.ends}: {panchang.tithi.end ? formatDateTime(panchang.tithi.end) : '--'}</span>
              </div>
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
            </div>

            {/* Sun/Moon Timings */}
            <div className="glass-card" style={{ padding: '16px', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '12px' }}>☀️ {t.sunrise} & {t.sunset}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sun size={18} color="#f59e0b" />
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>{t.sunrise}</span>
                    <span style={{ fontWeight: 700 }}>{formatTime(panchang.timings.sunrise)}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sun size={18} color="#d97706" />
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>{t.sunset}</span>
                    <span style={{ fontWeight: 700 }}>{formatTime(panchang.timings.sunset)}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
                  <Moon size={18} color="#64748b" />
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>{t.moonrise}</span>
                    <span style={{ fontWeight: 700 }}>{formatTime(panchang.timings.moonrise)}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
                  <Moon size={18} color="#334155" />
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>{t.moonset}</span>
                    <span style={{ fontWeight: 700 }}>{formatTime(panchang.timings.moonset)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Auspicious Timings */}
            <div className="glass-card" style={{ padding: '16px', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1rem', color: '#059669', marginBottom: '12px' }}>🟢 {t.auspicious}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 600 }}>{t.brahmaMuhurta}</span>
                  <span style={{ fontWeight: 700 }}>{formatTime(panchang.timings.brahmaStart)} - {formatTime(panchang.timings.brahmaEnd)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--border-color)', paddingTop: '8px' }}>
                  <span style={{ fontWeight: 600 }}>{t.abhijitMuhurta}</span>
                  <span style={{ fontWeight: 700 }}>{formatTime(panchang.timings.abhijitStart)} - {formatTime(panchang.timings.abhijitEnd)}</span>
                </div>
                {panchang.timings.amritStart && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--border-color)', paddingTop: '8px' }}>
                    <span style={{ fontWeight: 600 }}>{t.amritKaal}</span>
                    <span style={{ fontWeight: 700 }}>{formatTime(panchang.timings.amritStart)} - {formatTime(panchang.timings.amritEnd)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Inauspicious Timings */}
            <div className="glass-card" style={{ padding: '16px' }}>
              <h3 style={{ fontSize: '1rem', color: '#dc2626', marginBottom: '12px' }}>🔴 {t.inauspicious}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 600 }}>{t.rahuKaal}</span>
                  <span style={{ fontWeight: 700 }}>{formatTime(panchang.timings.rahuStart)} - {formatTime(panchang.timings.rahuEnd)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--border-color)', paddingTop: '8px' }}>
                  <span style={{ fontWeight: 600 }}>{t.gulika}</span>
                  <span style={{ fontWeight: 700 }}>{formatTime(panchang.timings.gulikaStart)} - {formatTime(panchang.timings.gulikaEnd)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--border-color)', paddingTop: '8px' }}>
                  <span style={{ fontWeight: 600 }}>{t.yamaganda}</span>
                  <span style={{ fontWeight: 700 }}>{formatTime(panchang.timings.yamaStart)} - {formatTime(panchang.timings.yamaEnd)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Month Navigation */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <button onClick={() => changeMonth(-1)} className="header-circle-btn" style={{ width: 40, height: 40 }} aria-label="Previous Month">
          <ChevronLeft size={24} />
        </button>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
          {viewDate.toLocaleDateString(lang === 'en' ? 'en-US' : 'hi-IN', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={() => changeMonth(1)} className="header-circle-btn" style={{ width: 40, height: 40 }} aria-label="Next Month">
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="glass-card" style={{ padding: '12px' }}>
        <div className="calendar-grid">
          {/* Weekday headers */}
          {t.weekdaysShort.map(d => (
            <div key={d} className="calendar-header-day">
              {d}
            </div>
          ))}

          {/* Day cells */}
          {days.map((dayDate, idx) => {
            if (!dayDate) {
              return <div key={`empty-${idx}`} style={{ background: 'transparent' }} />;
            }

            const details = getDayDetails(dayDate);
            const { panchang, festivals } = details;

            const isToday = dayDate.toDateString() === new Date().toDateString();
            const isSelectedActive = dayDate.toDateString() === currentDate.toDateString();

            const cellTithiName = getTithiName(panchang.tithi.number);
            const truncatedTithi = cellTithiName.slice(0, 8); // Truncate to fit card

            return (
              <div
                key={`day-${dayDate.getDate()}`}
                onClick={() => {
                  setCurrentDate(dayDate);
                  handleDayClick(dayDate);
                }}
                className={`calendar-day-cell ${isToday ? 'today-cell' : ''}`}
                style={{
                  borderColor: isSelectedActive ? 'var(--primary-color)' : 'var(--border-color)',
                  background: isSelectedActive ? 'var(--primary-light)' : ''
                }}
              >
                <span className="calendar-day-number">{dayDate.getDate()}</span>
                <span className="calendar-day-tithi">{truncatedTithi}</span>
                {festivals.length > 0 && <span className="calendar-day-festival-dot" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Render Modal if a day is clicked */}
      {renderPanchangModal()}
    </div>
  );
}
