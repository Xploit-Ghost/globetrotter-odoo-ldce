import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, MapPin, DollarSign, ArrowRight, Search, Filter, Luggage } from 'lucide-react';
import { useTrips } from '../context/TripsContext';
import './Dashboard.css';

const Dashboard = () => {
  const { trips, addTrip } = useTrips();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const bannerInputRef = useRef(null);
  
  const [newTrip, setNewTrip] = useState({
    title: '',
    start_date: '',
    end_date: '',
    description: '',
    cost: '',
    currency: 'INR',
    image: ''
  });

  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewTrip({...newTrip, image: reader.result});
      reader.readAsDataURL(file);
    }
  };

  const filteredTrips = trips.filter(trip => 
    trip.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    trip.destination?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateTrip = (e) => {
    e.preventDefault();
    const created = {
      id: `trip-${Date.now()}`,
      title: newTrip.title,
      destination: newTrip.description || 'Custom Destination',
      dates: `${newTrip.start_date} - ${newTrip.end_date}`,
      status: 'Upcoming',
      cost: `${newTrip.currency === 'INR' ? '₹' : '$'}${newTrip.cost}`,
      image: newTrip.image || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=600&auto=format&fit=crop',
      collaborators: [],
      category: 'Custom'
    };
    addTrip(created);
    setShowModal(false);
  };

  return (
    <div className="container">
      <div className="dashboard-header" style={{ alignItems: 'center' }}>
        <div className="dashboard-header-text">
          <span className="text-secondary tracking-widest uppercase font-bold" style={{ fontSize: '0.85rem' }}>MY JOURNEYS</span>
          <h1 className="dashboard-title">Your Trips</h1>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div className="input-with-icon" style={{ minWidth: '250px' }}>
            <Search className="input-icon" size={18} />
            <input 
              type="text" 
              placeholder="Search destinations..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%' }} 
            />
          </div>
          <button className="btn btn-secondary btn-icon" style={{ borderRadius: '12px', padding: '12px' }}>
            <Filter size={20} />
          </button>
          <button className="btn btn-primary glowing-pill btn-icon" onClick={() => setShowModal(true)} style={{ borderRadius: '50%', width: '48px', height: '48px', padding: 0 }}>
            <Plus size={24} />
          </button>
        </div>
      </div>

      {filteredTrips.length === 0 ? (
        <div className="empty-state-layered glass-panel">
          <div className="illuminated-badge animate-pulse-slow">
            <Luggage size={48} className="empty-icon-glow" />
          </div>
          <h3 className="empty-title">No adventures plotted yet</h3>
          <p className="empty-subtitle">The world is waiting. Create your first beautifully crafted multi-city itinerary.</p>
          <button className="btn btn-primary glowing-pill mt-6" onClick={() => setShowModal(true)}>
            Start Planning
          </button>
        </div>
      ) : (
        <div className="trip-grid-rich">
          {filteredTrips.map((trip) => (
            <Link to={`/trips/${trip.id}`} key={trip.id} className="trip-card-rich glass">
              <div className="trip-card-hero">
                <div 
                  className="trip-card-img" 
                  style={{ backgroundImage: `url('${trip.image || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=600'}')` }}
                ></div>
                <div className="trip-card-overlay">
                  <div className="trip-badge date-badge">
                    <Calendar size={14} /> {trip.dates}
                  </div>
                </div>
              </div>
              <div className="trip-card-content">
                <h3 className="trip-card-title">{trip.title}</h3>
                <p className="trip-card-desc">{trip.destination}</p>
                <div className="trip-card-meta">
                  <span className="cost-chip">
                    {trip.cost}
                  </span>
                  <div className={`status-indicator ${trip.status === 'Upcoming' ? 'active' : ''}`}>
                    <span className="dot" style={{ background: trip.status === 'Completed' ? '#10b981' : trip.status === 'Upcoming' ? '#f59e0b' : '#6b7280' }}></span> {trip.status}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2>Plan New Trip</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreateTrip}>
              <div className="form-group">
                <label>Trip Title</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={newTrip.title}
                  onChange={(e) => setNewTrip({...newTrip, title: e.target.value})}
                  required 
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={newTrip.start_date}
                    onChange={(e) => setNewTrip({...newTrip, start_date: e.target.value})}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={newTrip.end_date}
                    onChange={(e) => setNewTrip({...newTrip, end_date: e.target.value})}
                    required 
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Total Budget</label>
                  <input 
                    type="number" 
                    className="form-input"
                    value={newTrip.cost}
                    onChange={(e) => setNewTrip({...newTrip, cost: e.target.value})}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Currency</label>
                  <select 
                    className="form-input"
                    value={newTrip.currency}
                    onChange={(e) => setNewTrip({...newTrip, currency: e.target.value})}
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Cover Photo</label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  {newTrip.image && <img src={newTrip.image} alt="preview" style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />}
                  <input type="file" hidden ref={bannerInputRef} onChange={handleBannerUpload} accept="image/*" />
                  <button type="button" className="btn btn-secondary" onClick={() => bannerInputRef.current.click()}>Upload Image</button>
                </div>
              </div>
              <div className="form-actions mt-4">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary glowing-pill">Create Itinerary</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
