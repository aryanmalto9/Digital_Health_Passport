import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import api from '../services/api';
import './RecordsPage.css';

const CATEGORIES = ['all', 'lab_report', 'prescription', 'xray', 'scan', 'vaccination', 'discharge_summary', 'other'];

const CAT_ICONS = {
  lab_report: '🧪', prescription: '💊', xray: '🩻', scan: '🔬',
  vaccination: '💉', discharge_summary: '📄', other: '📎'
};

function RecordsPage() {
  const { user } = useSelector(s => s.auth);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ title: '', category: 'lab_report', description: '', doctorName: '', hospitalName: '', recordDate: '' });
  const [file, setFile] = useState(null);

  const fetchRecords = useCallback(async () => {
    try {
      const params = {};
      if (filter !== 'all') params.category = filter;
      if (search) params.search = search;
      const { data } = await api.get('/records', { params });
      setRecords(data.records);
    } catch {}
    setLoading(false);
  }, [filter, search]);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please select a file');
    setUploading(true);
    try {
      const fd = new FormData();
      Object.keys(form).forEach(k => { if (form[k]) fd.append(k, form[k]); });
      fd.append('file', file);
      await api.post('/records', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Record uploaded!');
      setShowForm(false);
      setForm({ title: '', category: 'lab_report', description: '', doctorName: '', hospitalName: '', recordDate: '' });
      setFile(null);
      fetchRecords();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    }
    setUploading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await api.delete(`/records/${id}`);
      toast.success('Record deleted');
      setRecords(r => r.filter(rec => rec._id !== id));
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div className="records-page fade-in">
      <div className="page-header">
        <div>
          <h1>Medical Records</h1>
          <p>All your health documents in one secure place.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '× Cancel' : '+ Upload Record'}
        </button>
      </div>

      {/* Upload Form */}
      {showForm && (
        <div className="upload-form card fade-in">
          <h3 style={{ marginBottom: 20 }}>Upload New Record</h3>
          <form onSubmit={handleUpload}>
            <div className="grid-2">
              <div className="input-group">
                <label>Record Title *</label>
                <input type="text" className="input-field" placeholder="e.g., Blood Test Results"
                  value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="input-group">
                <label>Category *</label>
                <select className="input-field" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.filter(c => c !== 'all').map(c => (
                    <option key={c} value={c}>{c.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label>Doctor Name</label>
                <input type="text" className="input-field" placeholder="Dr. Name"
                  value={form.doctorName} onChange={e => setForm({ ...form, doctorName: e.target.value })} />
              </div>
              <div className="input-group">
                <label>Hospital / Clinic</label>
                <input type="text" className="input-field" placeholder="Hospital name"
                  value={form.hospitalName} onChange={e => setForm({ ...form, hospitalName: e.target.value })} />
              </div>
              <div className="input-group">
                <label>Record Date</label>
                <input type="date" className="input-field"
                  value={form.recordDate} onChange={e => setForm({ ...form, recordDate: e.target.value })} />
              </div>
              <div className="input-group">
                <label>File * (PDF, Image – max 10MB)</label>
                <input type="file" className="input-field" accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
                  onChange={e => setFile(e.target.files[0])} required />
              </div>
            </div>
            <div className="input-group" style={{ marginTop: 12 }}>
              <label>Description</label>
              <textarea className="input-field" rows={2} placeholder="Optional notes"
                value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ resize: 'vertical' }} />
            </div>
            <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
              <button type="submit" className="btn btn-primary" disabled={uploading}>
                {uploading ? <><span className="spinner" /> Uploading...</> : '⬆ Upload'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="filters-bar">
        <div className="filter-tabs">
          {CATEGORIES.map(c => (
            <button key={c} className={`filter-tab ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>
              {c === 'all' ? 'All' : `${CAT_ICONS[c]} ${c.replace('_', ' ')}`}
            </button>
          ))}
        </div>
        <input type="text" className="input-field search-input" placeholder="🔍 Search records..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Records List */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" style={{ width: 36, height: 36 }} /></div>
      ) : records.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📋</div>
          <h3>No records found</h3>
          <p>Upload your first medical record to get started.</p>
        </div>
      ) : (
        <div className="records-grid">
          {records.map(r => (
            <div key={r._id} className="record-card card">
              <div className="record-card-top">
                <span className="record-cat-badge">{CAT_ICONS[r.category] || '📎'}</span>
                <span className="badge badge-blue" style={{ fontSize: 11 }}>{r.category.replace('_', ' ')}</span>
              </div>
              <div className="record-card-title">{r.title}</div>
              <div className="record-card-meta">
                {r.hospitalName && <span>🏥 {r.hospitalName}</span>}
                {r.doctorName && <span>👨‍⚕️ {r.doctorName}</span>}
                <span>📅 {new Date(r.recordDate).toLocaleDateString()}</span>
                {user?.role !== 'patient' && r.patient && <span>👤 {r.patient.name}</span>}
              </div>
              {r.description && <p className="record-card-desc">{r.description}</p>}
              <div className="record-card-actions">
                <a href={r.fileUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                  👁 View File
                </a>
                {(user?._id === r.patient?._id || user?.role === 'admin') && (
                  <button onClick={() => handleDelete(r._id)} className="btn btn-danger btn-sm">🗑 Delete</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecordsPage;
