import React, { useState, useEffect } from 'react';
import { Home as HomeIcon, Calendar as CalendarIcon, Clock, Sparkles, Settings as SettingsIcon, Globe, MapPin, Bell } from 'lucide-react';
import { translations } from './utils/translations';

// Import Tabs
import Home from './components/Home';
import Calendar from './components/Calendar';
import Muhurtas from './components/Muhurtas';
import FestivalsTab from './components/FestivalsTab';
import Settings from './components/Settings';

import './PanchangApp.css';
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // App settings states
  const [location, setLocation] = useState(() => {
    const saved = localStorage.getItem('kalachakra_location');
    return saved ? JSON.parse(saved) : {
      name: 'Bhilwara, Rajasthan',
      lat: 25.3484,
      lon: 74.6393,
      tz: 5.5
    };
  });
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('kalachakra_lang') || 'hi';
  });
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('kalachakra_theme') || 'light';
  });
  const [remindersEnabled, setRemindersEnabled] = useState(() => {
    const saved = localStorage.getItem('kalachakra_reminders');
    return saved !== null ? saved === 'true' : true;
  });
  
  // Toast notifications state
  const [toast, setToast] = useState(null);

  const t = translations[lang];

  // Apply theme & font settings dynamically to HTML body element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('kalachakra_theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-font-size', 'normal');
  }, []);

  useEffect(() => {
    localStorage.setItem('kalachakra_location', JSON.stringify(location));
  }, [location]);

  useEffect(() => {
    localStorage.setItem('kalachakra_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('kalachakra_reminders', remindersEnabled.toString());
  }, [remindersEnabled]);

  const detectLocation = (showMuted = false) => {
    if (!navigator.geolocation) {
      if (!showMuted) triggerToast(t.error ? `${t.error}: Geolocation not supported` : "Geolocation not supported");
      return;
    }
    if (!showMuted) triggerToast(lang === 'hi' ? "स्थान खोजा जा रहा है..." : "Detecting location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = parseFloat(position.coords.latitude.toFixed(4));
        const lon = parseFloat(position.coords.longitude.toFixed(4));
        const tz = Math.round((lon / 15) * 2) / 2;
        setLocation({
          name: 'Detected Location',
          lat,
          lon,
          tz
        });
        triggerToast(lang === 'hi' ? "सफलतापूर्वक स्थान प्राप्त किया!" : "Location detected successfully!");
      },
      (error) => {
        if (!showMuted) triggerToast(t.error ? `${t.error}: Permission denied / failed` : "Permission denied / failed");
      }
    );
  };

  useEffect(() => {
    // Auto-detect user coordinates on page load
    detectLocation(true);
  }, []);

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Quick Language Toggle in header
  const toggleLanguage = () => {
    setLang(prev => (prev === 'hi' ? 'en' : 'hi'));
  };

  // Tab rendering helper
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <Home
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            location={location}
            lang={lang}
            translations={translations}
          />
        );
      case 'calendar':
        return (
          <Calendar
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            location={location}
            lang={lang}
            translations={translations}
          />
        );
      case 'muhurtas':
        return (
          <Muhurtas
            currentDate={currentDate}
            location={location}
            lang={lang}
            translations={translations}
          />
        );
      case 'festivals':
        return (
          <FestivalsTab
            currentDate={currentDate}
            location={location}
            lang={lang}
            translations={translations}
          />
        );
      case 'settings':
        return (
          <Settings
            location={location}
            setLocation={setLocation}
            lang={lang}
            setLang={setLang}
            theme={theme}
            setTheme={setTheme}
            remindersEnabled={remindersEnabled}
            setRemindersEnabled={setRemindersEnabled}
            triggerToast={triggerToast}
            translations={translations}
            detectLocation={detectLocation}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="panchang-theme-scope">
      <div className="app-container">
      <Analytics />
      {/* Dynamic Toast Alerts */}
      {toast && (
        <div className="notification-banner">
          <Bell size={18} />
          <span>{toast}</span>
        </div>
      )}

      {/* Persistent Header */}
      <header className="app-header">
        <div className="header-title-container">
          <h1 className="header-logo">{t.appTitle}</h1>
        </div>
        <div className="header-controls">
          {/* Quick Location Badge */}
          <button
            onClick={() => {
              setActiveTab('settings');
              setTimeout(() => {
                const element = document.getElementById('location-section');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }, 100);
            }}
            className="header-location-btn"
            style={{ cursor: 'pointer', border: '1px solid var(--border-color)', outline: 'none' }}
            title="Go to Location Settings"
          >
            <MapPin size={16} color="var(--primary-color)" />
            <span>{t.changeLocation}</span>
          </button>

          {/* Quick Language Toggle (English / Hindi) */}
          <button
            onClick={() => {
              setActiveTab('settings');
              setTimeout(() => {
                const element = document.getElementById('language-section');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }, 100);
            }}
            className="header-circle-btn"
            style={{ fontWeight: 800, fontSize: '0.95rem' }}
            title="Switch Language"
          >
            {lang === 'hi' ? 'EN' : 'हिं'}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="app-content">
        {renderContent()}
      </main>

      {/* Accessible Bottom Tab Bar */}
      <nav className="app-tabbar">
        <button
          onClick={() => setActiveTab('home')}
          className={`tab-btn ${activeTab === 'home' ? 'active' : ''}`}
        >
          <HomeIcon />
          <span>{t.home}</span>
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={`tab-btn ${activeTab === 'calendar' ? 'active' : ''}`}
        >
          <CalendarIcon />
          <span>{t.calendar}</span>
        </button>
        {/* Hide Muhurtas for now, we will see later to release them */}
        {/*
        <button
          onClick={() => setActiveTab('muhurtas')}
          className={`tab-btn ${activeTab === 'muhurtas' ? 'active' : ''}`}
        >
          <Clock />
          <span>{t.muhurtas}</span>
        </button>
        */}
        <button
          onClick={() => setActiveTab('festivals')}
          className={`tab-btn ${activeTab === 'festivals' ? 'active' : ''}`}
        >
          <Sparkles />
          <span>{t.festivals}</span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
        >
          <SettingsIcon />
          <span>{t.settings}</span>
        </button>
      </nav>
      </div>
    </div>
  );
}
