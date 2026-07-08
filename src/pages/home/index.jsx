import {
  ArrowRight,
  Briefcase,
  ChevronDown,
  Cpu,
  Download,
  Layers,
  Mail,
  MapPin,
  Phone,
  Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaWhatsapp
} from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { portfolioData } from '../../data/portfolioData';
import profileImg from '../../images/vijay_soni.jpeg';
import { calculateYearsOfExperience, getFormattedSummary } from '../../utils/portfolioHelpers';
import { logEvent } from '../../firebase/firebase';
import './style.css';

const iconMap = {
  Cpu,
  Layers,
  Zap,
  Briefcase
};



export default function PortfolioHome() {
  const { personalInfo, about, skills, experience, projects, education } = portfolioData;
  const yearsOfExperience = calculateYearsOfExperience(personalInfo.careerStartDate);
  const summaryText = getFormattedSummary(personalInfo.summary, personalInfo.careerStartDate);
  const [scrollY, setScrollY] = useState(0);
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



  // Parallax Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for Reveal-on-Scroll Animations
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
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ position: 'relative' }}>

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

      {/* Hero Section with Parallax ambient background */}
      <section 
        className="parallax-hero" 
        style={{ background: 'var(--bg-color)', zIndex: 1 }}
      >



        <div
          className="parallax-bg"
          style={{
            transform: `translateY(${scrollY * 0.3}px)`,
            opacity: Math.max(0, 1 - scrollY / 700),
            zIndex: 0
          }}
        />

        <div className="container" style={{ textAlign: 'center', zIndex: 3 }}>

          <h1
            className="serif-font reveal"
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
              lineHeight: 1.1,
              marginBottom: '16px',
              transitionDelay: '0.2s'
            }}
          >
            {personalInfo.name}
          </h1>

          <p
            className="reveal"
            style={{
              fontSize: 'clamp(1.1rem, 3vw, 1.6rem)',
              color: 'var(--text-primary)',
              fontWeight: 500,
              marginBottom: '12px',
              transitionDelay: '0.3s'
            }}
          >
            {personalInfo.title}
          </p>

          <p
            className="reveal"
            style={{
              maxWidth: '600px',
              margin: '0 auto 36px auto',
              color: 'var(--text-muted)',
              fontSize: '1.05rem',
              transitionDelay: '0.4s'
            }}
          >
            {personalInfo.subtitle}
          </p>

          <div
            className="reveal"
            style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              transitionDelay: '0.5s'
            }}
          >
            <a
              href="#experience"
              className="glass"
              onClick={() => logEvent('view_experience_clicked')}
              style={{
                padding: '12px 24px',
                borderRadius: '30px',
                background: 'var(--text-primary)',
                color: 'var(--bg-color)',
                fontWeight: 600,
                border: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              View Experience
            </a>


            <a
              href="/Vijay_Soni_Resume.pdf"
              download
              onClick={() => logEvent('resume_downloaded', { format: 'PDF' })}
              className="glass"
              style={{
                padding: '12px 24px',
                borderRadius: '30px',
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Download size={16} /> Resume PDF
            </a>
          </div>
        </div>

        <div style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
          opacity: Math.max(0, 1 - scrollY / 200)
        }}>
          <span>Scroll Down</span>
          <ChevronDown size={16} className="bounce-animation" />
        </div>
      </section>

      {/* About Summary Section */}
      <section className="reveal" style={{ padding: '80px 0', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'flex-start' }}>
            <div className="about-avatar-container">
              <img
                src={profileImg}
                alt={personalInfo.name}
                style={{
                  width: '100%',
                  maxWidth: '300px',
                  height: 'auto',
                  borderRadius: 'var(--border-radius)',
                  objectFit: 'cover',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-md)',
                  marginBottom: '20px',

                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, background: 'var(--accent-light)', color: 'var(--accent-color)', padding: '4px 12px', borderRadius: '20px' }}>
                  Based in {personalInfo.location}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {personalInfo.name} • {personalInfo.title}
                </span>
              </div>
            </div>

            <div>
              <h2 className="serif-font" style={{ fontSize: '2.5rem', marginBottom: '24px' }}>
                {about.heading}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '16px', lineHeight: 1.7 }}>
                {summaryText}
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '32px', lineHeight: 1.7 }}>
                {about.subDescription}
              </p>

              {/* Ambient visual matrix cards */}
              <div className="about-matrix-grid">
                {about.metrics.map((card, idx) => {
                  const IconComp = iconMap[card.icon] || Cpu;
                  const cardTitle = card.title.replace('{yearsOfExperience}', yearsOfExperience);
                  return (
                    <div 
                      key={idx} 
                      className="glass reveal" 
                      style={{ 
                        padding: '24px', 
                        borderRadius: 'var(--border-radius)', 
                        transition: 'var(--transition-smooth)', 
                        transitionDelay: `${(idx + 1) * 0.1}s` 
                      }}
                    >
                      <IconComp size={32} color="var(--accent-color)" style={{ marginBottom: '12px' }} />
                      <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{cardTitle}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{card.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Timeline Section */}
      <section id="experience" className="reveal" style={{ padding: '80px 0', background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 className="serif-font" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Work History</h2>
            <p style={{ color: 'var(--text-muted)' }}>Professional software engineering experience timeline</p>
          </div>

          <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
            {/* Timeline center line */}
            <div style={{
              position: 'absolute',
              left: '20px',
              top: '8px',
              bottom: '8px',
              width: '2px',
              background: 'var(--border-color)'
            }} />

            {experience.map((exp, idx) => (
              <div key={idx} style={{
                position: 'relative',
                paddingLeft: '50px',
                marginBottom: '40px',
                transitionDelay: `${idx * 0.1}s`
              }} className="reveal">
                {/* Timeline node */}
                <div style={{
                  position: 'absolute',
                  left: '12px',
                  top: '6px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: 'var(--bg-color)',
                  border: '3px solid var(--accent-color)',
                  zIndex: 2
                }} />

                <div className="glass" style={{ padding: '24px', borderRadius: 'var(--border-radius)', transition: 'var(--transition-smooth)' }}>
                  <div className="timeline-card-header">
                    <div>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>{exp.role}</h3>
                      <p style={{ fontWeight: 600, color: 'var(--accent-color)', fontSize: '1rem' }}>{exp.company}</p>
                    </div>
                    <div className="timeline-card-right">
                      <span style={{
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        background: 'var(--accent-light)',
                        color: 'var(--accent-color)',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        display: 'inline-block'
                      }}>
                        {exp.period}
                      </span>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }} className="timeline-card-location">
                        <MapPin size={12} /> {exp.location}
                      </p>
                    </div>
                  </div>
                  <ul style={{ paddingLeft: '16px', color: 'var(--text-muted)' }}>
                    {exp.points.map((pt, pIdx) => (
                      <li key={pIdx} style={{ marginBottom: '8px', fontSize: '0.95rem' }}>{pt}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="reveal" style={{ padding: '80px 0', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 className="serif-font" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Technical Skill Matrix</h2>
            <p style={{ color: 'var(--text-muted)' }}>Categorized technologies and development competencies</p>
          </div>

          <div className="grid-3" style={{ gap: '20px' }}>
            {skills.map((group, idx) => (
              <div
                key={idx}
                className="glass reveal"
                style={{
                  padding: '24px',
                  borderRadius: 'var(--border-radius)',
                  transitionDelay: `${idx * 0.1}s`
                }}
              >
                <h3 style={{
                  fontSize: '1.15rem',
                  borderBottom: '1px solid var(--border-color)',
                  paddingBottom: '10px',
                  marginBottom: '16px',
                  color: 'var(--accent-color)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {group.category}
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {group.items.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      style={{
                        background: 'var(--bg-color)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        transition: 'var(--transition-smooth)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--accent-color)';
                        e.currentTarget.style.color = 'var(--accent-color)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-color)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid Section */}
      <section className="reveal" style={{ padding: '80px 0', background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 className="serif-font" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Key Projects</h2>
            <p style={{ color: 'var(--text-muted)' }}>Commercial mobile products successfully shipped</p>
          </div>

          <div className="projects-grid">
            {projects.map((proj, idx) => (
              <div key={idx} className="glass reveal" style={{
                padding: '24px',
                borderRadius: 'var(--border-radius)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                transitionDelay: `${idx * 0.1}s`
              }}>
                <div>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--accent-color)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    background: 'var(--accent-light)',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    display: 'inline-block',
                    marginBottom: '12px'
                  }}>
                    {proj.category}
                  </span>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '10px', fontWeight: 700 }}>{proj.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '16px' }}>
                    {proj.description}
                  </p>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {proj.highlights.map((hl, hIdx) => (
                    <span key={hIdx} style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      border: '1px dashed var(--border-color)',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      {hl}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education & Credentials Section */}
      <section className="reveal" style={{ padding: '80px 0', borderTop: '1px solid var(--border-color)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 className="serif-font" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Education</h2>
            <p style={{ color: 'var(--text-muted)' }}>Academic degrees and qualifications</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {education.map((edu, idx) => (
              <div key={idx} className="glass education-card reveal" style={{ transitionDelay: `${idx * 0.15}s` }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{edu.degree}</h3>
                  <p style={{ color: 'var(--text-muted)' }}>{edu.school}</p>
                </div>
                <div className="education-card-right">
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-color)' }}>{edu.period}</span>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }} className="education-card-location">
                    <MapPin size={12} /> {edu.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contactme" className="reveal" style={{ padding: '80px 0', borderTop: '1px solid var(--border-color)', background: 'var(--text-primary)', color: 'var(--bg-color)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '600px' }}>
          <h2 className="serif-font" style={{ fontSize: '2.5rem', marginBottom: '16px', color: 'var(--bg-color)' }}>Let's Connect</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '1.05rem' }}>
            Interested in building high-quality, scalable mobile applications together? Get in touch!
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
            <a 
              href={`mailto:${personalInfo.email}`} 
              onClick={() => logEvent('contact_clicked', { method: 'email' })}
              style={{ color: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '1.1rem' }}
            >
              <Mail size={18} color="var(--accent-color)" /> {personalInfo.email}
            </a>
            <a 
              href={`tel:${personalInfo.phone}`} 
              onClick={() => logEvent('contact_clicked', { method: 'phone' })}
              style={{ color: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '1.1rem' }}
            >
              <Phone size={18} color="var(--accent-color)" /> {personalInfo.phone}
            </a>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-muted)' }}>
              <MapPin size={18} color="var(--accent-color)" /> {personalInfo.location}
            </div>
          </div>

          {/* Social Profiles */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {[
              { href: personalInfo.linkedin, icon: FaLinkedinIn, label: 'LinkedIn' },
              { href: personalInfo.github, icon: FaGithub, label: 'GitHub' },
              { href: personalInfo.whatsapp, icon: FaWhatsapp, label: 'WhatsApp' },
              { href: personalInfo.facebook, icon: FaFacebookF, label: 'Facebook' },
              { href: personalInfo.instagram, icon: FaInstagram, label: 'Instagram' },
              { href: personalInfo.twitter, icon: FaTwitter, label: 'Twitter' }
            ]
              .filter(item => item.href)
              .map((item, idx) => {
                const Icon = item.icon;
                return (
                  <a
                    key={idx}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => logEvent('social_profile_clicked', { network: item.label })}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: 'rgba(0, 0, 0, 0.05)',
                      border: '1px solid rgba(0, 0, 0, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--bg-color)',
                      transition: 'var(--transition-smooth)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--accent-color)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)';
                      e.currentTarget.style.color = 'var(--bg-color)';
                      e.currentTarget.style.transform = 'none';
                    }}
                    aria-label={item.label}
                  >
                    <Icon size={18} />
                  </a>
                );
              })
            }
          </div>
        </div>
      </section>
    </div>
  );
}
