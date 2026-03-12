import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import './AdminPage.css';

function AdminPage() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users')
      ]);
      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
    } catch { toast.error('Failed to load admin data'); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const toggleUser = async (id) => {
    try {
      const { data } = await api.patch(`/admin/users/${id}/toggle`);
      setUsers(us => us.map(u => u._id === id ? { ...u, isActive: data.user.isActive } : u));
    } catch { toast.error('Failed'); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user and all their data? This cannot be undone.')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(us => us.filter(u => u._id !== id));
      toast.success('User deleted');
    } catch { toast.error('Delete failed'); }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div className="spinner" style={{ width: 36, height: 36 }} /></div>;

  return (
    <div className="admin-page fade-in">
      <div className="page-header">
        <h1>⚙ Admin Panel</h1>
        <p>Manage users and system data.</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="admin-stats">
          {[
            { label: 'Total Users', value: stats.totalUsers, icon: '👥' },
            { label: 'Patients', value: stats.patients, icon: '🧑‍⚕️' },
            { label: 'Doctors', value: stats.doctors, icon: '👨‍⚕️' },
            { label: 'Total Records', value: stats.totalRecords, icon: '📋' },
          ].map(s => (
            <div key={s.label} className="admin-stat-card card">
              <span style={{ fontSize: 24 }}>{s.icon}</span>
              <div className="stat-value" style={{ fontSize: 28, fontFamily: 'var(--mono)', fontWeight: 700 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Users Table */}
      <div className="card" style={{ marginTop: 24, overflowX: 'auto' }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>All Users</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td className="user-cell">
                  <div className="user-avatar-sm">{u.name[0]?.toUpperCase()}</div>
                  {u.name}
                </td>
                <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{u.email}</td>
                <td>
                  <span className={`badge ${u.role === 'admin' ? 'badge-yellow' : u.role === 'doctor' ? 'badge-green' : 'badge-blue'}`}>
                    {u.role}
                  </span>
                </td>
                <td>
                  <span className={`badge ${u.isActive ? 'badge-green' : 'badge-red'}`}>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {u.role !== 'admin' && (
                      <>
                        <button className="btn btn-secondary btn-sm" onClick={() => toggleUser(u._id)}>
                          {u.isActive ? 'Disable' : 'Enable'}
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => deleteUser(u._id)}>Delete</button>
                      </>
                    )}
                    {u.role === 'admin' && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Protected</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPage;
