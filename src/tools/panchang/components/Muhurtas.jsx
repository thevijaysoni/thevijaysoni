import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { calculatePanchang } from '../utils/panchangEngine';

export default function Muhurtas({ currentDate, location, lang, translations }) {
  const t = translations[lang];
  const panchang = calculatePanchang(currentDate, location.lat, location.lon, location.tz);

  // Clock time to show active slot in real-time
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (dateObj) => {
    if (!dateObj) return '--:--';
    return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  // Helper to check if now is within a time slot
  const isTimeActive = (start, end) => {
    if (!start || !end) return false;
    const current = now.getTime();
    return current >= start.getTime() && current <= end.getTime();
  };

  const renderTimeSlotCard = (name, start, end, type) => {
    const active = isTimeActive(start, end);
    const badgeStyle = type === 'auspicious' ? 'badge-auspicious' : 'badge-inauspicious';
    const activeBorderColor = type === 'auspicious' ? '#10b981' : '#ef4444';

    return (
      <div
        className="glass-card"
        style={{
          border: active ? `2px solid ${activeBorderColor}` : '',
          background: active ? (type === 'auspicious' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)') : '',
          padding: '16px',
          marginBottom: '12px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
          <div>
            <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{name}</span>
            <span className={badgeStyle} style={{ marginLeft: '8px', fontSize: '0.75rem' }}>
              {type === 'auspicious' ? t.auspicious : t.inauspicious}
            </span>
          </div>
          {active && (
            <span style={{
              background: activeBorderColor,
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '20px',
              textTransform: 'uppercase'
            }}>
              Active Now
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1rem', color: 'var(--text-main)', fontWeight: 600 }}>
          <Clock size={16} />
          <span>{formatTime(start)} - {formatTime(end)}</span>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2 className="view-title">
        <span>{t.muhurtas}</span>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          🕒 Live Clock: {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </h2>

      {/* Auspicious Timings Section */}
      <h3 style={{ margin: '16px 0 12px 0', fontSize: '1.15rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <CheckCircle size={20} />
        {t.auspicious}
      </h3>
      
      {renderTimeSlotCard(t.brahmaMuhurta, panchang.timings.brahmaStart, panchang.timings.brahmaEnd, 'auspicious')}
      {renderTimeSlotCard(t.abhijitMuhurta, panchang.timings.abhijitStart, panchang.timings.abhijitEnd, 'auspicious')}
      {panchang.timings.amritStart && renderTimeSlotCard(t.amritKaal, panchang.timings.amritStart, panchang.timings.amritEnd, 'auspicious')}

      {/* Inauspicious Timings Section */}
      <h3 style={{ margin: '24px 0 12px 0', fontSize: '1.15rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <AlertTriangle size={20} />
        {t.inauspicious}
      </h3>

      {renderTimeSlotCard(t.rahuKaal, panchang.timings.rahuStart, panchang.timings.rahuEnd, 'inauspicious')}
      {renderTimeSlotCard(t.gulika, panchang.timings.gulikaStart, panchang.timings.gulikaEnd, 'inauspicious')}
      {renderTimeSlotCard(t.yamaganda, panchang.timings.yamaStart, panchang.timings.yamaEnd, 'inauspicious')}

      {/* Dur Muhurtas */}
      {panchang.timings.durMuhurtas.map((dur, idx) => 
        renderTimeSlotCard(`${t.durMuhurta} ${panchang.timings.durMuhurtas.length > 1 ? idx + 1 : ''}`, dur.start, dur.end, 'inauspicious')
      )}
    </div>
  );
}
