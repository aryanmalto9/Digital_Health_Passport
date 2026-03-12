import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  return (
    <div className="landing">
      {/* Header */}
      <header className="landing-header">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="brand">
            <span className="brand-icon">⬡</span>
            <span className="brand-name">Health Passport</span>
          </div>
          <div className="header-actions">
            <Link to="/login" className="btn btn-secondary">Log In</Link>
            <Link to="/register" className="btn btn-primary">Get Started</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="container">
          <div className="hero-badge">🔒 Secure · Private · Always With You</div>
          <h1 className="hero-title">
            Your Health Data,<br />
            <span className="accent-text">Always Ready.</span>
          </h1>
          <p className="hero-desc">
            A secure digital health passport that puts you in control. Emergency QR cards, 
            centralized medical records, and AI-powered health guidance — in one place.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg">Create Your Passport</Link>
            <Link to="/login" className="btn btn-secondary btn-lg">Sign In</Link>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="problems">
        <div className="container">
          <h2 className="section-title">Two Scenarios That Happen Every Day</h2>
          <div className="problem-grid">
            <div className="problem-card emergency">
              <div className="problem-icon">🚑</div>
              <h3>The Emergency</h3>
              <p>A college student is unconscious after an accident. Doctors don't know his blood type, allergies, or medications. Every second of guessing puts his life at risk.</p>
            </div>
            <div className="problem-card confusion">
              <div className="problem-icon">📁</div>
              <h3>The Confusion</h3>
              <p>At a new doctor's office, you can't remember what tests you've already done. The doctor starts from zero — ordering the same expensive tests again. Wasted time, money, and delayed treatment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Everything You Need</h2>
          <div className="features-grid">
            {[
              { icon: '📱', title: 'Emergency QR Card', desc: 'Generate a QR code with your critical health info. One scan gives doctors everything they need in an emergency.' },
              { icon: '☁️', title: 'Centralized Records', desc: 'Upload and organize all your medical records — lab reports, X-rays, prescriptions — securely in the cloud.' },
              { icon: '🔒', title: 'Role-Based Security', desc: 'JWT authentication with patient, doctor, and admin roles. Your data is yours alone.' },
              { icon: '🤖', title: 'AI Health Assistant', desc: 'Ask general health questions, understand medical terms, and get guidance with our built-in AI chatbot.' },
            ].map(f => (
              <div key={f.title} className="feature-card card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="tech">
        <div className="container">
          <h2 className="section-title">Built With</h2>
          <div className="tech-pills">
            {['MongoDB', 'Express.js', 'React', 'Node.js', 'Redux Toolkit', 'JWT Auth', 'Cloudinary', 'OpenAI API', 'QRCode'].map(t => (
              <span key={t} className="tech-pill">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container">
          <h2>Be Ready for Any Situation</h2>
          <p>Join the Digital Health Passport — free, secure, and always accessible.</p>
          <Link to="/register" className="btn btn-primary btn-lg">Create Your Free Passport</Link>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="container">
          <p>⬡ Digital Health Passport · MERN Stack Project</p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>For educational purposes. Not a substitute for professional medical advice.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
