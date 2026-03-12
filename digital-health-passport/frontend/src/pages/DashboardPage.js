import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../services/api';
import './DashboardPage.css';

function StatCard({ icon, label, value, color }) {
  return (
    <div className="stat-card card">
      <div className="stat-icon" style={{ background: `${color}20`, color }}>{icon}</div>
      <div className="stat-info">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}

function DashboardPage() {
  const { user } = useSelector(s => s.auth);
  const [records, setRecords] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.role === 'patient') {
          const [recRes, profRes] = await Promise.all([
            api.get('/records'),
            api.get('/profile')
          ]);
          setRecords(recRes.data.records || []);
          setProfile(profRes.data.profile);
        } else if (user?.role === 'doctor') {
          const recRes = await api.get('/records');
          setRecords(recRes.data.records || []);
        }
      } catch {}
      setLoading(false);
    };
    if (user) fetchData();
  }, [user]);

  const categoryCount = records.reduce((acc, r) => {
    acc[r.category] = (acc[r.category] || 0) + 1;
    return acc;
  }, {});

  if (loading) return <div className="loading-center"><div className="spinner" style={{ width: 36, height: 36 }} /></div>;

  const profileComplete = profile && profile.bloodType && profile.emergencyContact?.phone;

  return (
    <div className="dashboard fade-in">
      {/* Welcome */}
      <div className="welcome-banner">
        <div>
          <h1>Good {getTimeOfDay()}, {user?.name?.split(' ')[0]} 👋</h1>
          <p>Here's an overview of your health passport.</p>
        </div>
        <span className={`badge ${user?.role === 'doctor' ? 'badge-green' : 'badge-blue'}`}>
          {user?.role}
        </span>
      </div>

      {/* Profile completion warning */}
      {user?.role === 'patient' && !profileComplete && (
        <div className="alert-banner">
          <span>⚠️</span>
          <div>
            <strong>Complete your health profile</strong> — Your emergency QR card needs blood type, allergies, and emergency contact info.
          </div>
          <Link to="/dashboard/profile" className="btn btn-primary btn-sm">Complete Now</Link>
        </div>
      )}

      {/* Stats */}
      {user?.role === 'patient' && (
        <div className="stats-grid">
          <StatCard icon="📋" label="Total Records" value={records.length} color="var(--accent)" />
          <StatCard icon="🧪" label="Lab Reports" value={categoryCount['lab_report'] || 0} color="var(--green)" />
          <StatCard icon="💊" label="Prescriptions" value={categoryCount['prescription'] || 0} color="var(--yellow)" />
          <StatCard icon="🩻" label="Scans & X-Rays" value={(categoryCount['xray'] || 0) + (categoryCount['scan'] || 0)} color="#c678dd" />
        </div>
      )}

      {/* Quick Actions */}
      <div className="section-header"><h2>Quick Actions</h2></div>
      <div className="quick-actions">
        {user?.role === 'patient' && <>
          <Link to="/dashboard/profile" className="action-card card">
            <span className="action-icon">♥</span>
            <span className="action-label">Update Profile</span>
            <span className="action-arrow">→</span>
          </Link>
          <Link to="/dashboard/qr-card" className="action-card card">
            <span className="action-icon">⬡</span>
            <span className="action-label">My QR Card</span>
            <span className="action-arrow">→</span>
          </Link>
        </>}
        <Link to="/dashboard/records" className="action-card card">
          <span className="action-icon">📋</span>
          <span className="action-label">Medical Records</span>
          <span className="action-arrow">→</span>
        </Link>
        <Link to="/dashboard/ai-chat" className="action-card card">
          <span className="action-icon">🤖</span>
          <span className="action-label">AI Assistant</span>
          <span className="action-arrow">→</span>
        </Link>
      </div>

      {/* Recent Records */}
      {records.length > 0 && (
        <>
          <div className="section-header" style={{ marginTop: 32 }}>
            <h2>Recent Records</h2>
            <Link to="/dashboard/records" className="btn btn-secondary btn-sm">View All</Link>
          </div>
          <div className="recent-records">
            {records.slice(0, 5).map(r => (
              <div key={r._id} className="record-row card">
                <span className="record-cat-icon">{getCategoryIcon(r.category)}</span>
                <div className="record-info">
                  <div className="record-title">{r.title}</div>
                  <div className="record-meta">{r.hospitalName || r.doctorName || 'Personal upload'} · {new Date(r.recordDate).toLocaleDateString()}</div>
                </div>
                <span className="badge badge-blue" style={{ fontSize: 11, textTransform: 'capitalize' }}>
                  {r.category.replace('_', ' ')}
                </span>
                <a href={r.fileUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">View</a>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  return 'Evening';
}

function getCategoryIcon(cat) {
  const icons = { lab_report: '🧪', prescription: '💊', xray: '🩻', scan: '🔬', vaccination: '💉', discharge_summary: '📄', other: '📎' };
  return icons[cat] || '📎';
}

export default DashboardPage;
