import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import './style.css';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="header-container">
      <div className="container navbar-wrapper">
        {/* Logo */}
        <NavLink to="/" style={{
          fontSize: '1.4rem',
          fontWeight: 800,
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          Vijay Soni <span style={{ color: 'var(--accent-color)', fontSize: '1.6rem', lineHeight: 1 }}>.</span>
        </NavLink>

        {/* Desktop Menu */}
        <nav className="desktop-nav">
          <NavLink to="/" className={({ isActive }) => `nav-link-custom ${isActive ? 'active-link' : ''}`}>
            Home
          </NavLink>
          <NavLink to="/sidecraft" className={({ isActive }) => `nav-link-custom ${isActive ? 'active-link' : ''}`}>
            My Sidecrafts
          </NavLink>
        </nav>

        {/* Mobile menu button */}
        <div className="mobile-controls">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-dropdown">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) => `nav-link-custom ${isActive ? 'active-link' : ''}`}
            style={{ display: 'block', padding: '12px 16px' }}
          >
            Home
          </NavLink>
          <NavLink
            to="/sidecraft"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) => `nav-link-custom ${isActive ? 'active-link' : ''}`}
            style={{ display: 'block', padding: '12px 16px' }}
          >
            Sidecraft
          </NavLink>
        </div>
      )}
    </header>
  );
}
