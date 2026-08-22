import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, LogOut, Plus, Settings, Sun, Moon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('token');
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  return (
    <nav className="navbar frosted-glass-nav">
      <div className="container nav-container">
        <Link to="/" className="nav-logo">
          <Compass className="logo-icon glow-icon animate-spin-slow" size={32} />
          <span className="logo-text gradient-text font-bold tracking-tight">Globe Trotter</span>
        </Link>
        
        <div className="nav-links">
          {isAuthenticated ? (
            <>
              <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>{t('dashboard')}</Link>
              <Link to="/my-trips" className={`nav-link ${location.pathname === '/my-trips' ? 'active' : ''}`}>My Trips</Link>
              <Link to="/explore" className={`nav-link ${location.pathname === '/explore' ? 'active' : ''}`}>Explore</Link>
              <Link to="/estimate" className={`nav-link ${location.pathname === '/estimate' ? 'active' : ''}`}>{t('estimateExplore')}</Link>
              <Link to="/profile" className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center' }}>
                <Settings size={20} />
              </Link>
              
              <button onClick={toggleTheme} className="btn-icon" style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              <div className="nav-divider"></div>
              
              <div className="user-profile-badge">
                <span className="user-email">{localStorage.getItem('userEmail')}</span>
              </div>
              
              <button onClick={handleLogout} className="btn-logout" title={t('logout')}>
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">{t('login')}</Link>
              <Link to="/register" className="btn btn-primary glowing-pill">{t('signUp')}</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
