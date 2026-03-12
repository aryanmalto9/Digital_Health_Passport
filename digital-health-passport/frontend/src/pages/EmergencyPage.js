import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import './EmergencyPage.css';

function EmergencyPage() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/profile/public/${token}`)
      .then(res => setData(res.data.emergency))
      .catch(err => setError(err.response?.data?.message || 'Profile not found'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return (
    <div className="emergency-page loading">
      <div className="spinner" style={{ width: 44, height: 44, borderWidth: 3 }} />
      <p>Loading emergency data...</p>
    </div>
  );

  if (error) return (
    <div className="emergency-page error-state">
      <div className="error-icon">⚠️</div>
      <h2>Profile Not Found</h2>
      <p>{error}</p>
      <Link to="/" className="btn btn-secondary" style={{ marginTop: 16 }}>Go to Health Passport</Link>
    </div>
  );

  const { name, bloodType, allergies, medicalConditions, currentMedications, emergencyContact } = data;

  return (
    <div className="emergency-page">
      <div className="emergency-header">
        <div className="emergency-banner">
          <span className="emergency-symbol">🚨</span>
          <div>
            <h1>EMERGENCY HEALTH INFORMATION</h1>
            <p>This data is for emergency medical use only</p>
          </div>
        </div>
      </div>

      <div className="emergency-content">
        <div className="patient-name-card">
          <span className="name-label">Patient Name</span>
          <span className="patient-name">{name}</span>
        </div>

        <div className="emergency-grid">
          {/* Blood Type — most critical */}
          <div className="emergency-block blood-type">
            <div className="block-label">BLOOD TYPE</div>
            <div className="blood-type-value">{bloodType || 'Unknown'}</div>
          </div>

          {/* Allergies */}
          <div className="emergency-block allergies">
            <div className="block-label">⚠️ ALLERGIES</div>
            {allergies && allergies.length > 0 ? (
              <div className="emergency-tags">
                {allergies.map((a, i) => <span key={i} className="emergency-tag allergy-tag">{a}</span>)}
              </div>
            ) : <div className="no-data">None reported</div>}
          </div>

          {/* Conditions */}
          <div className="emergency-block conditions">
            <div className="block-label">🩺 MEDICAL CONDITIONS</div>
            {medicalConditions && medicalConditions.length > 0 ? (
              <div className="emergency-tags">
                {medicalConditions.map((c, i) => <span key={i} className="emergency-tag condition-tag">{c}</span>)}
              </div>
            ) : <div className="no-data">None reported</div>}
          </div>

          {/* Medications */}
          <div className="emergency-block medications">
            <div className="block-label">💊 CURRENT MEDICATIONS</div>
            {currentMedications && currentMedications.length > 0 ? (
              <div className="emergency-tags">
                {currentMedications.map((m, i) => (
                  <span key={i} className="emergency-tag med-tag">
                    {m.name}{m.dosage ? ` — ${m.dosage}` : ''}
                  </span>
                ))}
              </div>
            ) : <div className="no-data">None reported</div>}
          </div>
        </div>

        {/* Emergency Contact */}
        {emergencyContact?.phone && (
          <div className="contact-block">
            <div className="contact-header">📞 EMERGENCY CONTACT</div>
            <div className="contact-info">
              <span className="contact-name">{emergencyContact.name}</span>
              {emergencyContact.relationship && (
                <span className="contact-rel">({emergencyContact.relationship})</span>
              )}
              <a href={`tel:${emergencyContact.phone}`} className="contact-phone">
                📞 {emergencyContact.phone}
              </a>
            </div>
          </div>
        )}

        <div className="emergency-footer">
          <p>⬡ Digital Health Passport · This information was provided by the patient and may not be fully up to date.</p>
        </div>
      </div>
    </div>
  );
}

export default EmergencyPage;
