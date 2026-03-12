import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import './Layout.css';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '◈', exact: true },
  { path: '/dashboard/profile', label: 'Health Profile', icon: '♥', roles: ['patient'] },
  { path: '/dashboard/records', label: 'Medical Records', icon: '📋', roles: ['patient', 'doctor'] },
  { path: '/dashboard/qr-card', label: 'QR Card', icon: '⬡', roles: ['patient'] },
  { path: '/dashboard/ai-chat', label: 'AI Assistant', icon: '✦' },
  { path: '/dashboard/admin', label: 'Admin Panel', icon: '⚙', roles: ['admin'] },
];

function Layout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const filteredNav = navItems.filter(item =>
    !item.roles || item.roles.includes(user?.role)
  );

  return (
    <div className="layout">
      {/* Mobile overlay */}
      {mobileOpen && <div className="overlay" onClick={() => setMobileOpen(false)} />}

      {/* Sidebar */}
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-logo">
          <span className="logo-icon">⬡</span>
          <div>
            <div className="logo-name">Health Passport</div>
            <div className="logo-sub">Digital ID</div>
          </div>
        </div>

        <div className="user-pill">
          <div className="user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <div className="user-info">
            <div className="user-name">{user?.name}</div>
            <div className={`user-role role-${user?.role}`}>{user?.role}</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {filteredNav.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <span>⊗</span> Log Out
        </button>
      </aside>

      {/* Main */}
      <main className="main-content">
        <div className="mobile-header">
          <button className="hamburger" onClick={() => setMobileOpen(true)}>☰</button>
          <span className="mobile-title">Health Passport</span>
        </div>
        <div className="content-wrapper fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;
