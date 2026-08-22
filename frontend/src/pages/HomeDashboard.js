import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plane, TrendingUp, Calendar, MapPin, ArrowRight, Edit2 } from 'lucide-react';
import { useTrips } from '../context/TripsContext';
import { useLanguage } from '../context/LanguageContext';
import './HomeDashboard.css';

const HomeDashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const user = localStorage.getItem('userEmail')?.split('@')[0] || 'Explorer';
  const { trips } = useTrips();
  const recentTrips = trips.slice(0, 2);

  const [budgetData, setBudgetData] = useState(() => {
    const saved = localStorage.getItem('annualBudget');
    return saved ? JSON.parse(saved) : { spent: 230400, goal: 200000, currency: '₹' };
  });
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [editBudget, setEditBudget] = useState(budgetData);

  useEffect(() => {
    localStorage.setItem('annualBudget', JSON.stringify(budgetData));
  }, [budgetData]);

  const handleBudgetSave = (e) => {
    e.preventDefault();
    setBudgetData(editBudget);
    setShowBudgetModal(false);
  };

  const progressPct = Math.min(Math.round((budgetData.spent / budgetData.goal) * 100), 200);
  const progressStatus = progressPct < 80 ? 'success' : progressPct <= 100 ? 'warning' : 'danger';
  const remainingText = budgetData.spent > budgetData.goal ? 'Over budget' : `${Math.floor((budgetData.goal - budgetData.spent) / 50000)} trips left`;

  return (
    <div className="container dashboard-container">
      {/* Hero & Budget Widget Row */}
      <div className="dashboard-top-row">
        
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">{t('wanderlustGreeting')} <span className="gradient-text">{user}</span>!</h1>
            <p className="hero-subtitle">The world is vast. Where to next?</p>
            <button className="btn btn-primary glowing-pill mt-4" onClick={() => navigate('/my-trips')}>
              <Plane size={18} /> {t('planNewTrip')}
            </button>
          </div>
        </div>

        <div className="budget-widget glass-panel relative">
          <div className="widget-header">
            <h3>{t('annualBudget')}</h3>
            <button className="btn-icon" onClick={() => setShowBudgetModal(true)} style={{ color: 'var(--text-secondary)' }}>
              <Edit2 size={16} />
            </button>
          </div>
          <div className="widget-amount">
            <h2>{budgetData.currency}{budgetData.spent.toLocaleString()}</h2>
            <span className="goal-text">{t('goal')}: {budgetData.currency}{budgetData.goal.toLocaleString()}</span>
          </div>
          
          <div className="widget-progress">
            <div className="progress-container" style={{ height: '10px' }}>
              <div className={`progress-bar ${progressStatus}`} style={{ width: `${progressPct}%` }}></div>
            </div>
            <div className="progress-meta">
              <span className={`text-${progressStatus}`}>{progressPct}% {t('spent')}</span>
              <span>{budgetData.spent > budgetData.goal ? t('overBudget') : `${Math.floor((budgetData.goal - budgetData.spent) / 50000)} ${t('tripsLeft')}`}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Trips */}
      <div className="section-header">
        <h2>{t('recentTrips')}</h2>
        <Link to="/my-trips" className="view-all-link">{t('viewAll')} <ArrowRight size={16} /></Link>
      </div>

      <div className="trip-grid-rich">
        {recentTrips.map(trip => (
          <Link to={`/trips/${trip.id}`} key={trip.id} className="trip-card-rich glass">
            <div className="trip-card-hero">
              <div className="trip-card-img" style={{ backgroundImage: `url('${trip.image}')` }}></div>
              <div className="trip-card-overlay">
                <div className="trip-badge date-badge"><Calendar size={14} /> {trip.dates}</div>
              </div>
            </div>
            <div className="trip-card-content">
              <h3 className="trip-card-title">{trip.title}</h3>
              <div className="trip-card-meta">
                <span className="cost-chip">{trip.cost}</span>
                <div className={`status-indicator ${trip.status === 'Upcoming' ? 'active' : ''}`}>
                  <span className="dot" style={{ background: trip.status === 'Completed' ? '#10b981' : trip.status === 'Upcoming' ? '#f59e0b' : '#6b7280' }}></span> {trip.status}
                </div>
              </div>
            </div>
          </Link>
        ))}

        <div className="trip-card-placeholder glass" onClick={() => navigate('/my-trips')}>
          <div className="placeholder-content">
            <div className="placeholder-icon"><Plane size={32} /></div>
            <h3>Start Planning</h3>
            <p>Create your next itinerary</p>
          </div>
        </div>
      </div>

      {/* Recommended Destinations */}
      <div className="section-header" style={{ marginTop: '48px' }}>
        <h2>{t('curatedDestinations')}</h2>
      </div>
      <div className="destinations-grid">
        <div className="dest-card" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80')` }}>
          <div className="dest-overlay">
            <h4>Paris, France</h4>
          </div>
        </div>
        <div className="dest-card" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=600&q=80')` }}>
          <div className="dest-overlay">
            <h4>Bali, Indonesia</h4>
          </div>
        </div>
        <div className="dest-card" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?auto=format&fit=crop&w=600&q=80')` }}>
          <div className="dest-overlay">
            <h4>Kyoto, Japan</h4>
          </div>
        </div>
      </div>

      {showBudgetModal && (
        <div className="modal-overlay" style={{ zIndex: 100 }}>
          <div className="modal-content glass-panel" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h2>Edit Annual Budget</h2>
              <button className="btn-close" onClick={() => setShowBudgetModal(false)}>×</button>
            </div>
            <form onSubmit={handleBudgetSave}>
              <div className="form-group">
                <label>Current Spent Amount</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={editBudget.spent}
                  onChange={e => setEditBudget({...editBudget, spent: Number(e.target.value)})}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Target Goal</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={editBudget.goal}
                  onChange={e => setEditBudget({...editBudget, goal: Number(e.target.value)})}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Currency</label>
                <select 
                  className="form-input" 
                  value={editBudget.currency}
                  onChange={e => setEditBudget({...editBudget, currency: e.target.value})}
                >
                  <option value="₹">INR (₹)</option>
                  <option value="$">USD ($)</option>
                  <option value="€">EUR (€)</option>
                  <option value="£">GBP (£)</option>
                </select>
              </div>
              <div className="form-actions mt-4">
                <button type="button" className="btn btn-secondary" onClick={() => setShowBudgetModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary glowing-pill">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default HomeDashboard;
