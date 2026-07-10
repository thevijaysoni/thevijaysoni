import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { toolsData } from '../../data/toolsData';
import './style.css';

export default function ToolsCatalog() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mouseActive, setMouseActive] = useState(false);

  // Global Viewport Cursor Tracking
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (!mouseActive) setMouseActive(true);
    };
    const handleMouseLeave = () => setMouseActive(false);
    const handleMouseEnter = () => setMouseActive(true);

    window.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [mouseActive]);

  // Intersection Observer for animations
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );
    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ position: 'relative', padding: '60px 0', minHeight: '85vh', background: 'var(--bg-color)' }}>
      {/* Global Viewport Cursor Spotlight Overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: mouseActive 
            ? `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(234, 179, 8, 0.04), transparent 80%)`
            : 'transparent',
          pointerEvents: 'none',
          zIndex: 999,
          transition: 'background 0.1s ease'
        }}
      />
      <div className="container">

        {/* Header */}
        <div className="tools-title-container reveal">
          <span style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            color: 'var(--accent-color)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            background: 'var(--accent-light)',
            padding: '4px 12px',
            borderRadius: '20px',
            display: 'inline-block',
            marginBottom: '12px'
          }}>
            Labs
          </span>
          <h1 className="serif-font" style={{ fontSize: '3rem', marginBottom: '16px' }}>Experimental Labs</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
            A collection of interactive utilities, and active side projects.
          </p>
        </div>

        {/* Dynamic Tools Grid */}
        <div className="tools-grid">
          {toolsData.map((tool) => {
            // Dynamically resolve icon from lucide-react Icons export
            const IconComponent = Icons[tool.icon] || Icons.Compass;

            return (
              <div
                key={tool.id}
                className="glass reveal"
                style={{
                  padding: '30px',
                  borderRadius: 'var(--border-radius)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  opacity: tool.active ? 1 : 0.7,
                  transition: 'var(--transition-smooth)'
                }}
              >
                <div>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '16px',
                    background: tool.active ? 'var(--accent-light)' : 'rgba(156, 163, 175, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: tool.active ? 'var(--accent-color)' : 'var(--text-muted)',
                    marginBottom: '24px'
                  }}>
                    <IconComponent size={30} />
                  </div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px' }}>{tool.name}</h2>
                  <p style={{
                    fontSize: '0.9rem',
                    color: tool.active ? 'var(--accent-color)' : 'var(--text-muted)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '12px'
                  }}>
                    {tool.category}
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
                    {tool.description}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                  <span style={{ fontSize: '0.8rem', background: 'var(--border-color)', padding: '4px 10px', borderRadius: '4px', fontWeight: 600 }}>
                    {tool.active ? 'Active & Live' : 'In Development'}
                  </span>

                  {tool.active ? (
                    <Link
                      to={tool.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        fontSize: '1rem'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-color)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                    >
                      Launch Tool <Icons.ArrowUpRight size={18} />
                    </Link>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.95rem' }}>
                      Coming Soon
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
