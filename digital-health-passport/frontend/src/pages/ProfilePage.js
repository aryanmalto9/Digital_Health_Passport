import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import './ProfilePage.css';

const BLOOD_TYPES = ['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [allergyInput, setAllergyInput] = useState('');
  const [conditionInput, setConditionInput] = useState('');

  useEffect(() => {
    api.get('/profile').then(res => {
      const p = res.data.profile;
      setProfile({
        dateOfBirth: p.dateOfBirth ? p.dateOfBirth.substring(0, 10) : '',
        gender: p.gender || '',
        phone: p.phone || '',
        address: p.address || '',
        bloodType: p.bloodType || '',
        allergies: p.allergies || [],
        medicalConditions: p.medicalConditions || [],
        currentMedications: p.currentMedications || [],
        emergencyContact: p.emergencyContact || { name: '', relationship: '', phone: '' }
      });
    }).catch(() => toast.error('Failed to load profile'));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/profile', profile);
      toast.success('Profile saved successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    }
    setSaving(false);
  };

  const addItem = (field, value, setInput) => {
    if (!value.trim()) return;
    setProfile(p => ({ ...p, [field]: [...p[field], value.trim()] }));
    setInput('');
  };

  const removeItem = (field, idx) => {
    setProfile(p => ({ ...p, [field]: p[field].filter((_, i) => i !== idx) }));
  };

  if (!profile) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" style={{ width: 36, height: 36 }} /></div>;

  return (
    <div className="profile-page fade-in">
      <div className="page-header">
        <h1>Health Profile</h1>
        <p>This information powers your Emergency QR Card. Keep it accurate.</p>
      </div>

      <form onSubmit={handleSave} className="profile-form">
        {/* Personal Info */}
        <div className="profile-section card">
          <h2 className="section-title-sm">Personal Information</h2>
          <div className="grid-2">
            <div className="input-group">
              <label>Date of Birth</label>
              <input type="date" className="input-field" value={profile.dateOfBirth}
                onChange={e => setProfile({ ...profile, dateOfBirth: e.target.value })} />
            </div>
            <div className="input-group">
              <label>Gender</label>
              <select className="input-field" value={profile.gender} onChange={e => setProfile({ ...profile, gender: e.target.value })}>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="input-group">
              <label>Phone</label>
              <input type="tel" className="input-field" placeholder="+91 98765 43210" value={profile.phone}
                onChange={e => setProfile({ ...profile, phone: e.target.value })} />
            </div>
            <div className="input-group">
              <label>Blood Type</label>
              <select className="input-field" value={profile.bloodType} onChange={e => setProfile({ ...profile, bloodType: e.target.value })}>
                {BLOOD_TYPES.map(b => <option key={b} value={b}>{b || 'Select blood type'}</option>)}
              </select>
            </div>
          </div>
          <div className="input-group" style={{ marginTop: 16 }}>
            <label>Address</label>
            <input type="text" className="input-field" placeholder="Your address" value={profile.address}
              onChange={e => setProfile({ ...profile, address: e.target.value })} />
          </div>
        </div>

        {/* Allergies */}
        <div className="profile-section card">
          <h2 className="section-title-sm">⚠️ Allergies</h2>
          <p className="section-note">List all known allergies (medications, food, environmental)</p>
          <div className="tags-container">
            {profile.allergies.map((a, i) => (
              <span key={i} className="tag tag-red">
                {a} <button type="button" onClick={() => removeItem('allergies', i)}>×</button>
              </span>
            ))}
          </div>
          <div className="tag-input-row">
            <input type="text" className="input-field" placeholder="e.g., Penicillin, Peanuts"
              value={allergyInput} onChange={e => setAllergyInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addItem('allergies', allergyInput, setAllergyInput); } }} />
            <button type="button" className="btn btn-secondary" onClick={() => addItem('allergies', allergyInput, setAllergyInput)}>Add</button>
          </div>
        </div>

        {/* Medical Conditions */}
        <div className="profile-section card">
          <h2 className="section-title-sm">🩺 Medical Conditions</h2>
          <p className="section-note">Chronic conditions, past surgeries, ongoing issues</p>
          <div className="tags-container">
            {profile.medicalConditions.map((c, i) => (
              <span key={i} className="tag tag-yellow">
                {c} <button type="button" onClick={() => removeItem('medicalConditions', i)}>×</button>
              </span>
            ))}
          </div>
          <div className="tag-input-row">
            <input type="text" className="input-field" placeholder="e.g., Diabetes Type 2, Hypertension"
              value={conditionInput} onChange={e => setConditionInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addItem('medicalConditions', conditionInput, setConditionInput); } }} />
            <button type="button" className="btn btn-secondary" onClick={() => addItem('medicalConditions', conditionInput, setConditionInput)}>Add</button>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="profile-section card">
          <h2 className="section-title-sm">🚨 Emergency Contact</h2>
          <div className="grid-3">
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" className="input-field" placeholder="Jane Doe"
                value={profile.emergencyContact.name}
                onChange={e => setProfile({ ...profile, emergencyContact: { ...profile.emergencyContact, name: e.target.value } })} />
            </div>
            <div className="input-group">
              <label>Relationship</label>
              <input type="text" className="input-field" placeholder="Mother, Father, Spouse"
                value={profile.emergencyContact.relationship}
                onChange={e => setProfile({ ...profile, emergencyContact: { ...profile.emergencyContact, relationship: e.target.value } })} />
            </div>
            <div className="input-group">
              <label>Phone Number</label>
              <input type="tel" className="input-field" placeholder="+91 98765 43210"
                value={profile.emergencyContact.phone}
                onChange={e => setProfile({ ...profile, emergencyContact: { ...profile.emergencyContact, phone: e.target.value } })} />
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-lg" disabled={saving} style={{ alignSelf: 'flex-start' }}>
          {saving ? <><span className="spinner" /> Saving...</> : '💾 Save Profile'}
        </button>
      </form>
    </div>
  );
}

export default ProfilePage;
