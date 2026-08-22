import React, { useState, useRef } from 'react';
import { 
  Wallet, Map, CreditCard, MoreVertical, Plane, Train, 
  Car, Edit2, List, Grid, Plus, Trash2, Image as ImageIcon
} from 'lucide-react';
import './TripDetails.css';

const initialStops = [
  { id: 1, city: 'Tokyo', dates: 'Oct 12 - Oct 15', days: 3, status: 'Hotel Booked', transport: 'Plane', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80' },
  { id: 2, city: 'Kyoto', dates: 'Oct 16 - Oct 19', days: 3, status: 'Pending', transport: 'Train', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80' }
];

const initialActivities = [
  { id: 1, stopId: 1, date: 'Oct 12', time: 'MORNING', title: 'Tsukiji Outer Market', category: 'Food & Dining', price: 4500, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80' },
  { id: 2, stopId: 1, date: 'Oct 12', time: 'AFTERNOON', title: 'Shibuya Crossing', category: 'Activities', price: 12000, image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=400&q=80' }
];

const TripDetails = () => {
  const [activeTab, setActiveTab] = useState('itinerary');
  const [activeStopId, setActiveStopId] = useState(1);
  const [viewMode, setViewMode] = useState('list');
  const [stops, setStops] = useState(initialStops);
  const [activities, setActivities] = useState(initialActivities);

  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [editExpenseId, setEditExpenseId] = useState(null);
  const [newExpense, setNewExpense] = useState({ title: '', category: 'Activities', price: '', date: '', stopId: 1, image: '' });

  const bannerInputRef = useRef(null);
  const expenseImageRef = useRef(null);

  const activeStop = stops.find(s => s.id === activeStopId);
  const stopActivities = activities.filter(a => a.stopId === activeStopId);

  const renderIcon = (type) => {
    switch (type) {
      case 'Plane': return <Plane size={20} />;
      case 'Train': return <Train size={20} />;
      case 'Car': return <Car size={20} />;
      default: return <Map size={20} />;
    }
  };

  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStops(stops.map(s => s.id === activeStopId ? { ...s, image: reader.result } : s));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExpenseImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewExpense({ ...newExpense, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSaveExpense = (e) => {
    e.preventDefault();
    if (editExpenseId) {
      setActivities(activities.map(a => a.id === editExpenseId ? { ...newExpense, id: editExpenseId, price: Number(newExpense.price) } : a));
    } else {
      setActivities([...activities, { ...newExpense, id: Date.now(), price: Number(newExpense.price), time: 'ANY TIME' }]);
    }
    setShowExpenseModal(false);
  };

  const deleteExpense = (id) => {
    setActivities(activities.filter(a => a.id !== id));
  };

  const openEditExpense = (act) => {
    setNewExpense(act);
    setEditExpenseId(act.id);
    setShowExpenseModal(true);
  };

  const currentTotal = activities.reduce((acc, curr) => acc + Number(curr.price), 0);
  const allocated = 500000;
  
  const categoryTotals = activities.reduce((acc, act) => {
    acc[act.category] = (acc[act.category] || 0) + Number(act.price);
    return acc;
  }, { 'Accommodation': 0, 'Transportation': 0, 'Food & Dining': 0, 'Activities': 0, 'Miscellaneous': 0 });

  return (
    <div className="trip-workspace">
      <div className="workspace-header">
        <div>
          <div className="breadcrumb-label">EDITING TRIP</div>
          <h1 className="trip-title">Japan Adventure</h1>
        </div>
        <div className="live-cost-pill">
          <div className="live-cost-info">
            <span className="live-cost-label">Estimated Total</span>
            <span className="live-cost-value">₹{currentTotal.toLocaleString()}</span>
          </div>
          <div className="live-cost-icon">
            <Wallet size={20} />
          </div>
        </div>
      </div>

      <div className="workspace-tabs">
        <button className={`workspace-tab ${activeTab === 'itinerary' ? 'active' : ''}`} onClick={() => setActiveTab('itinerary')}>
          🗺️ Itinerary & Schedule
        </button>
        <button className={`workspace-tab ${activeTab === 'budget' ? 'active' : ''}`} onClick={() => setActiveTab('budget')}>
          💳 Live Trip Budget
        </button>
      </div>

      {activeTab === 'itinerary' ? (
        <div className="itinerary-layout">
          <div className="itinerary-sidebar">
            <div className="sidebar-header">
              <h3>Itinerary Stops</h3>
              <span className="stop-count-badge">{stops.length} Stops</span>
            </div>
            <div className="stop-cards-stack">
              {stops.map(stop => (
                <div key={stop.id} className={`stop-card ${activeStopId === stop.id ? 'active' : ''}`} onClick={() => setActiveStopId(stop.id)}>
                  <div className="transport-icon">{renderIcon(stop.transport)}</div>
                  <div className="stop-details">
                    <h4>{stop.city}</h4>
                    <p className="stop-dates">{stop.dates}</p>
                    <div className="stop-chips">
                      <span className="stop-chip chip-activities">{activities.filter(a => a.stopId === stop.id).length} Activities</span>
                      {stop.status !== 'Pending' && <span className="stop-chip chip-status">{stop.status}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-add-stop"><Plus size={18} /> Add New Stop</button>
          </div>

          <div className="itinerary-content">
            {activeStop && (
              <>
                <div className="stop-hero-banner" style={{ backgroundImage: `url(${activeStop.image})` }}>
                  <div className="stop-hero-overlay">
                    <span className="hero-pill">Selected Stop</span>
                    <h2>{activeStop.city}</h2>
                    <p>{activeStop.dates}</p>
                    <input type="file" hidden ref={bannerInputRef} onChange={handleBannerUpload} accept="image/*" />
                    <button className="btn-edit-banner" onClick={() => bannerInputRef.current.click()}><ImageIcon size={18} /></button>
                  </div>
                </div>

                <div className="activities-header">
                  <h3>Activities</h3>
                  <button className="btn btn-primary glowing-pill" onClick={() => { setEditExpenseId(null); setNewExpense({ title: '', category: 'Activities', price: '', date: activeStop.dates.split(' - ')[0], stopId: activeStop.id, image: '' }); setShowExpenseModal(true); }}>
                    <Plus size={16} /> Add Activity
                  </button>
                </div>

                <div className="timeline">
                  {stopActivities.map((act, idx) => (
                    <div key={act.id} className="timeline-slot">
                      <div className="day-node">
                        <div className="circle"></div>
                        <span className="label">Day<br/>{idx + 1}</span>
                      </div>
                      <div className="slot-time">{act.date} - {act.time}</div>
                      
                      <div className="activity-card">
                        <div className="activity-img" style={{ backgroundImage: `url(${act.image || 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=400'})` }}></div>
                        <div className="activity-content">
                          <h4 className="activity-title">{act.title}</h4>
                          <p className="activity-subtitle">{act.category} • custom</p>
                        </div>
                        <div className="activity-price">₹{act.price.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="budget-view">
          <div className="budget-summary-cards">
            <div className="budget-card glass-panel">
              <h4>Allocated Trip Budget</h4>
              <p className="value text-primary">₹{allocated.toLocaleString()}</p>
            </div>
            <div className="budget-card glass-panel">
              <h4>Current Estimated Cost</h4>
              <p className="value text-warning">₹{currentTotal.toLocaleString()}</p>
              <div className="progress-container" style={{ height: '6px' }}>
                <div className="progress-bar warning" style={{ width: `${(currentTotal/allocated)*100}%` }}></div>
              </div>
            </div>
            <div className="budget-card glass-panel">
              <h4>Remaining Funds</h4>
              <p className="value text-success">₹{(allocated - currentTotal).toLocaleString()}</p>
            </div>
          </div>

          <div className="budget-matrix" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ marginBottom: '24px' }}>Category Breakdown</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {Object.entries(categoryTotals).map(([cat, total]) => (
                  <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--surface-border)' }}>
                    <span>{cat}</span>
                    <strong>₹{total.toLocaleString()}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3>Itemized Expenses</h3>
                <button className="btn btn-primary glowing-pill" onClick={() => { setEditExpenseId(null); setNewExpense({ title: '', category: 'Activities', price: '', date: '', stopId: 1, image: '' }); setShowExpenseModal(true); }}>
                  <Plus size={16} /> Add Expense
                </button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--surface-border)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '12px 0' }}>Expense Name</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map(act => (
                    <tr key={act.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                      <td style={{ padding: '16px 0', fontWeight: '600' }}>{act.title}</td>
                      <td><span className="stop-chip chip-activities">{act.category}</span></td>
                      <td style={{ color: 'var(--primary)', fontWeight: '700' }}>₹{act.price.toLocaleString()}</td>
                      <td>
                        <button className="btn-icon" onClick={() => openEditExpense(act)}><Edit2 size={16}/></button>
                        <button className="btn-icon" style={{ color: 'var(--danger)' }} onClick={() => deleteExpense(act.id)}><Trash2 size={16}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Expense / Activity Modal */}
      {showExpenseModal && (
        <div className="modal-overlay" style={{ zIndex: 100 }}>
          <div className="modal-content glass-panel" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2>{editExpenseId ? 'Edit' : 'Add'} Expense / Activity</h2>
              <button className="btn-close" onClick={() => setShowExpenseModal(false)}>×</button>
            </div>
            <form onSubmit={handleSaveExpense}>
              <div className="form-group">
                <label>Title</label>
                <input type="text" className="form-input" value={newExpense.title} onChange={e => setNewExpense({...newExpense, title: e.target.value})} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Amount (₹)</label>
                  <input type="number" className="form-input" value={newExpense.price} onChange={e => setNewExpense({...newExpense, price: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select className="form-input" value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value})}>
                    <option value="Accommodation">Accommodation</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Food & Dining">Food & Dining</option>
                    <option value="Activities">Activities</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Linked Stop</label>
                <select className="form-input" value={newExpense.stopId} onChange={e => setNewExpense({...newExpense, stopId: Number(e.target.value)})}>
                  {stops.map(s => <option key={s.id} value={s.id}>{s.city}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Photo / Receipt</label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  {newExpense.image && <img src={newExpense.image} alt="preview" style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />}
                  <input type="file" hidden ref={expenseImageRef} onChange={handleExpenseImageUpload} accept="image/*" />
                  <button type="button" className="btn btn-secondary" onClick={() => expenseImageRef.current.click()}>Upload Image</button>
                </div>
              </div>
              <div className="form-actions mt-4">
                <button type="button" className="btn btn-secondary" onClick={() => setShowExpenseModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary glowing-pill">Save Details</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripDetails;
