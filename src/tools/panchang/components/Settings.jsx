import React from 'react';
import { MapPin, Globe, Moon, Type, Bell } from 'lucide-react';
import { LANGUAGES } from '../utils/translations';

// City presets with coordinates and timezones
const PRESETS = [
  { name: 'Delhi', nameHi: 'दिल्ली', lat: 28.6139, lon: 77.2090, tz: 5.5 },
  { name: 'Mumbai', nameHi: 'मुंबई', lat: 19.0760, lon: 72.8777, tz: 5.5 },
  { name: 'Bhilwara', nameHi: 'भीलवाड़ा', lat: 25.3484, lon: 74.6393, tz: 5.5 },
  { name: 'Bengaluru', nameHi: 'बेंगलुरु', lat: 12.9716, lon: 77.5946, tz: 5.5 },
  { name: 'Chennai', nameHi: 'चेन्नई', lat: 13.0827, lon: 80.2707, tz: 5.5 },
  { name: 'New York', nameHi: 'न्यू यॉर्क', lat: 40.7128, lon: -74.0060, tz: -5.0 },
  { name: 'London', nameHi: 'लंदन', lat: 51.5074, lon: -0.1278, tz: 1.0 },
  { name: 'Tokyo', nameHi: 'टोक्यो', lat: 35.6762, lon: 139.6503, tz: 9.0 }
];

export default function Settings({
  location,
  setLocation,
  lang,
  setLang,
  theme,
  setTheme,
  remindersEnabled,
  setRemindersEnabled,
  triggerToast,
  translations,
  detectLocation
}) {
  const t = translations[lang];

  const handlePresetSelect = (preset) => {
    setLocation({
      name: lang === 'hi' ? preset.nameHi : preset.name,
      lat: preset.lat,
      lon: preset.lon,
      tz: preset.tz
    });
    triggerToast(`${t.success}: ${lang === 'hi' ? preset.nameHi : preset.name}`);
  };

  const handleCustomInput = (field, value) => {
    setLocation(prev => ({
      ...prev,
      name: 'Custom Location',
      [field]: parseFloat(value) || 0
    }));
  };



  const testNotification = () => {
    const alerts = [t.reminderBrahma, t.reminderEkadashi, t.reminderFestival];
    const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
    // Play alert sound if possible or show standard notification toast
    triggerToast(`🔔 Notification: "${randomAlert}"`);
  };

  return (
    <div>
      <h2 className="view-title">{t.settings}</h2>

      {/* Language Setting */}
      <div id="language-section" className="glass-card">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Globe size={18} color="var(--primary-color)" />
          {t.language}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className="preset-btn"
              style={{
                background: lang === l.code ? 'var(--primary-light)' : '',
                borderColor: lang === l.code ? 'var(--primary-color)' : '',
                fontWeight: lang === l.code ? 700 : 500
              }}
            >
              {l.name}
            </button>
          ))}
        </div>
      </div>


      {/* Theme Setting */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Moon size={18} color="var(--primary-color)" />
          {t.theme}
        </h3>
        <div className="toggle-group">
          <button
            onClick={() => setTheme('light')}
            className={`toggle-group-btn ${theme === 'light' ? 'active' : ''}`}
          >
            ☀️ {t.light}
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`toggle-group-btn ${theme === 'dark' ? 'active' : ''}`}
          >
            🌙 {t.dark}
          </button>
        </div>
      </div>

      {/* Location Setting */}
      <div id="location-section" className="glass-card">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={18} color="var(--primary-color)" />
          {t.selectLocation}
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
          Active: <strong style={{ color: 'var(--text-main)' }}>{location.name}</strong> ({location.lat}°, {location.lon}°)
        </p>

        {/* Auto Detect Button */}
        <button
          onClick={detectLocation}
          className="btn-primary"
          style={{ marginBottom: '16px' }}
        >
          📍 {t.chooseLocation}
        </button>

        {/* Presets */}
        {/* <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>{t.presets}</span>
        <div className="presets-grid" style={{ marginBottom: '20px' }}>
          {PRESETS.map(preset => (
            <button
              key={preset.name}
              onClick={() => handlePresetSelect(preset)}
              className="preset-btn"
            >
              {lang === 'hi' ? preset.nameHi : preset.name}
            </button>
          ))}
        </div> */}

        {/* Manual Coordinates */}
        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>{t.customCoordinates}</span>
        <div className="coordinates-grid">
          <div className="form-group">
            <label className="form-label">{t.latitude}</label>
            <input
              type="number"
              step="0.0001"
              value={location.lat}
              onChange={(e) => handleCustomInput('lat', e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t.longitude}</label>
            <input
              type="number"
              step="0.0001"
              value={location.lon}
              onChange={(e) => handleCustomInput('lon', e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t.timezone}</label>
            <input
              type="number"
              step="0.5"
              value={location.tz}
              onChange={(e) => handleCustomInput('tz', e.target.value)}
              className="form-input"
            />
          </div>
        </div>
      </div>

      {/* Reminders / Test System */}
      {/* <div className="glass-card">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={18} color="var(--primary-color)" />
          {t.reminderSetting}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <span style={{ fontWeight: 600 }}>{t.enableReminders}</span>
          <input
            type="checkbox"
            checked={remindersEnabled}
            onChange={(e) => setRemindersEnabled(e.target.checked)}
            style={{ width: '22px', height: '22px', accentColor: 'var(--primary-color)' }}
          />
        </div>
        <button
          onClick={testNotification}
          className="btn-secondary"
        >
          🔔 {t.testReminder}
        </button>
      </div> */}
    </div>
  );
}
