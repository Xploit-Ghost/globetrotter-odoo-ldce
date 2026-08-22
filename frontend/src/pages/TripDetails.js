import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrips } from '../context/TripsContext';
import { 
  Wallet, Map, CreditCard, MoreVertical, Plane, Train, 
  Car, Edit2, List, Grid, Plus, Trash2, Image as ImageIcon,
  Sparkles, Activity, CheckCircle, AlertTriangle
} from 'lucide-react';
import aiPlannerService from '../services/aiPlannerService';
import './TripDetails.css';

const initialStops = [
  { id: 1, city: 'Tokyo', dates: 'Oct 12 - Oct 15', days: 3, status: 'Hotel Booked', transport: 'Plane', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80' },
  { id: 2, city: 'Kyoto', dates: 'Oct 16 - Oct 19', days: 3, status: 'Pending', transport: 'Train', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80' }
];

const initialActivities = [
  { id: 1, stopId: 1, date: 'Oct 12', time: 'MORNING', title: 'Tsukiji Outer Market', category: 'Food & Dining', estimatedCost: 4500, actualCost: 4000, bookingStatus: 'Confirmed', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80' },
  { id: 2, stopId: 1, date: 'Oct 12', time: 'AFTERNOON', title: 'Shibuya Crossing', category: 'Activities', estimatedCost: 12000, actualCost: 0, bookingStatus: 'Idea', image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=400&q=80' }
];

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { trips, updateTrip } = useTrips(); // Assume we can update trips, or just use local state for now
  const trip = trips.find(t => String(t.id) === String(id));
  
  const [activeTab, setActiveTab] = useState('itinerary');
  const [activeStopId, setActiveStopId] = useState(null);
  const [stops, setStops] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (trip) {
      setStops(trip.stops || initialStops);
      setActivities(trip.activities || initialActivities);
      if (trip.stops && trip.stops.length > 0) {
        setActiveStopId(trip.stops[0].id);
      } else {
        setActiveStopId(initialStops[0].id);
      }
    }
  }, [trip]);

  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [editExpenseId, setEditExpenseId] = useState(null);
  const [newExpense, setNewExpense] = useState({ title: '', category: 'Activities', estimatedCost: '', actualCost: '', date: '', stopId: 1, image: '', bookingStatus: 'Idea' });

  const [showAIModal, setShowAIModal] = useState(false);
  const [aiConfig, setAiConfig] = useState({ duration: 3, pace: 'Balanced', vibes: [] });
  const [isGenerating, setIsGenerating] = useState(false);

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

  const handleSaveExpense = (e) => {
    e.preventDefault();
    if (editExpenseId) {
      setActivities(activities.map(a => a.id === editExpenseId ? { ...newExpense, id: editExpenseId, estimatedCost: Number(newExpense.estimatedCost), actualCost: Number(newExpense.actualCost) } : a));
    } else {
      setActivities([...activities, { ...newExpense, id: Date.now(), estimatedCost: Number(newExpense.estimatedCost), actualCost: Number(newExpense.actualCost), time: 'ANY TIME' }]);
    }
    setShowExpenseModal(false);
  };

  const deleteExpense = (id) => setActivities(activities.filter(a => a.id !== id));
  
  const openEditExpense = (act) => {
    setNewExpense({ ...act, estimatedCost: act.estimatedCost || 0, actualCost: act.actualCost || 0 });
    setEditExpenseId(act.id);
    setShowExpenseModal(true);
  };

  const handleGenerateAI = async () => {
    if (!activeStop) return;
    setIsGenerating(true);
    const plan = await aiPlannerService.generateAIPlan(activeStop.city, aiConfig.duration, aiConfig.vibes, aiConfig.pace);
    setActivities([...activities, ...plan.activities.map(a => ({ ...a, stopId: activeStop.id }))]);
    setIsGenerating(false);
    setShowAIModal(false);
  };

  const allocated = 500000;
  const currentEstimatedTotal = activities.reduce((acc, curr) => acc + Number(curr.estimatedCost || 0), 0);
  const currentActualTotal = activities.reduce((acc, curr) => acc + Number(curr.actualCost || 0), 0);
  
  const bookedActivities = activities.filter(a => ['Booked', 'Confirmed'].includes(a.bookingStatus)).length;
  const bookingRate = activities.length > 0 ? (bookedActivities / activities.length) * 100 : 0;
  
  const budgetAdherence = currentActualTotal > allocated ? 0 : Math.max(0, 100 - ((currentActualTotal / allocated) * 100));
  const paceScore = aiConfig.pace === 'Relaxed' ? 90 : aiConfig.pace === 'Balanced' ? 95 : 85; 
  
  const healthScore = Math.round((bookingRate * 0.4) + (budgetAdherence * 0.4) + (paceScore * 0.2));
  const healthStatus = healthScore >= 90 ? 'Ready for Takeoff' : healthScore >= 70 ? 'Looking Good' : 'Needs Attention';
  const healthColor = healthScore >= 90 ? 'var(--success)' : healthScore >= 70 ? 'var(--primary)' : 'var(--danger)';

  if (!trip) {
    return <div className="trip-workspace"><h2 style={{padding: '40px'}}>Trip not found</h2></div>;
  }

  return (
    <div className="trip-workspace">
      <div className="workspace-header">
        <div>
          <div className="breadcrumb-label">EDITING TRIP</div>
          <h1 className="trip-title">{trip.title}</h1>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button className="btn btn-primary glowing-pill" onClick={() => setShowAIModal(true)}>
            <Sparkles size={18} /> AI Auto-Plan Itinerary
          </button>
          
          <div className="health-score-widget glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 16px', borderRadius: '32px' }}>
            <div className="progress-ring" style={{ width: '40px', height: '40px', borderRadius: '50%', background: `conic-gradient(${healthColor} ${healthScore}%, rgba(255,255,255,0.1) 0)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '32px', height: '32px', background: 'var(--surface)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                {healthScore}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Trip Health</div>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: healthColor }}>{healthStatus}</div>
            </div>
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
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="itinerary-content">
            {activeStop && (
              <>
                <div className="stop-hero-banner" style={{ backgroundImage: `url(${activeStop.image})` }}>
                  <div className="stop-hero-overlay">
                    <h2>{activeStop.city}</h2>
                    <p>{activeStop.dates}</p>
                  </div>
                </div>

                <div className="activities-header">
                  <div>
                    <h3>Activities</h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{bookedActivities}/{activities.length} Booked ({Math.round(bookingRate)}%)</span>
                  </div>
                  <button className="btn btn-primary glowing-pill" onClick={() => { setEditExpenseId(null); setNewExpense({ title: '', category: 'Activities', estimatedCost: '', actualCost: '', date: activeStop.dates.split(' - ')[0], stopId: activeStop.id, image: '', bookingStatus: 'Idea' }); setShowExpenseModal(true); }}>
                    <Plus size={16} /> Add Activity
                  </button>
                </div>

                <div className="timeline">
                  {stopActivities.map((act, idx) => {
                    const variance = act.actualCost ? act.estimatedCost - act.actualCost : 0;
                    return (
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
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span className="activity-category">{act.category}</span>
                            <select 
                              className="booking-status-select"
                              value={act.bookingStatus} 
                              onChange={e => setActivities(activities.map(a => a.id === act.id ? { ...a, bookingStatus: e.target.value } : a))}
                            >
                              <option value="Idea">🟡 Idea</option>
                              <option value="Planned">🔵 Planned</option>
                              <option value="Booked">🟣 Booked</option>
                              <option value="Confirmed">🟢 Confirmed</option>
                            </select>
                          </div>
                        </div>
                        <div className="activity-price" style={{ flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                          <div>Est: ₹{act.estimatedCost.toLocaleString()}</div>
                          {act.actualCost > 0 && (
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Act: ₹{act.actualCost.toLocaleString()}</div>
                          )}
                          {variance !== 0 && act.actualCost > 0 && (
                            <div className={`variance-badge ${variance >= 0 ? 'success' : 'danger'}`}>
                              {variance >= 0 ? `Saved ₹${variance}` : `Over ₹${Math.abs(variance)}`}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )})}
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
              <h4>Estimated vs Actual Cost</h4>
              <p className="value text-warning">₹{currentActualTotal.toLocaleString()} <span style={{fontSize: '1rem', color: 'var(--text-secondary)'}}>/ ₹{currentEstimatedTotal.toLocaleString()}</span></p>
              <div className="progress-container" style={{ height: '6px' }}>
                <div className="progress-bar warning" style={{ width: `${(currentActualTotal/allocated)*100}%` }}></div>
              </div>
            </div>
            <div className="budget-card glass-panel">
              <h4>Total Variance</h4>
              <p className={`value ${currentEstimatedTotal - currentActualTotal >= 0 ? 'text-success' : 'text-danger'}`}>
                {currentEstimatedTotal - currentActualTotal >= 0 ? '+' : '-'}₹{Math.abs(currentEstimatedTotal - currentActualTotal).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="budget-matrix" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3>Itemized Expenses</h3>
                <button className="btn btn-primary glowing-pill" onClick={() => { setEditExpenseId(null); setNewExpense({ title: '', category: 'Activities', estimatedCost: '', actualCost: '', date: '', stopId: 1, image: '', bookingStatus: 'Idea' }); setShowExpenseModal(true); }}>
                  <Plus size={16} /> Add Expense
                </button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--surface-border)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '12px 0' }}>Expense Name</th>
                    <th>Status</th>
                    <th>Estimated</th>
                    <th>Actual</th>
                    <th>Variance</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map(act => {
                    const variance = act.actualCost ? act.estimatedCost - act.actualCost : 0;
                    return (
                    <tr key={act.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                      <td style={{ padding: '16px 0', fontWeight: '600' }}>{act.title}</td>
                      <td>
                        <select className="booking-status-select inline" value={act.bookingStatus} onChange={e => setActivities(activities.map(a => a.id === act.id ? { ...a, bookingStatus: e.target.value } : a))}>
                          <option value="Idea">Idea</option>
                          <option value="Planned">Planned</option>
                          <option value="Booked">Booked</option>
                          <option value="Confirmed">Confirmed</option>
                        </select>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>₹{act.estimatedCost.toLocaleString()}</td>
                      <td style={{ color: 'var(--primary)', fontWeight: '700' }}>₹{(act.actualCost || 0).toLocaleString()}</td>
                      <td>
                        {act.actualCost > 0 && (
                          <span style={{ color: variance >= 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold' }}>
                            {variance >= 0 ? '+' : '-'}₹{Math.abs(variance).toLocaleString()}
                          </span>
                        )}
                      </td>
                      <td>
                        <button className="btn-icon" onClick={() => openEditExpense(act)}><Edit2 size={16}/></button>
                        <button className="btn-icon" style={{ color: 'var(--danger)' }} onClick={() => deleteExpense(act.id)}><Trash2 size={16}/></button>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Expense Modal */}
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
                  <label>Est. Cost (₹)</label>
                  <input type="number" className="form-input" value={newExpense.estimatedCost} onChange={e => setNewExpense({...newExpense, estimatedCost: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Actual Cost (₹)</label>
                  <input type="number" className="form-input" value={newExpense.actualCost} onChange={e => setNewExpense({...newExpense, actualCost: e.target.value})} />
                </div>
              </div>
              <div className="form-row">
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
                <div className="form-group">
                  <label>Status</label>
                  <select className="form-input" value={newExpense.bookingStatus} onChange={e => setNewExpense({...newExpense, bookingStatus: e.target.value})}>
                    <option value="Idea">Idea</option>
                    <option value="Planned">Planned</option>
                    <option value="Booked">Booked</option>
                    <option value="Confirmed">Confirmed</option>
                  </select>
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

      {/* AI Modal */}
      {showAIModal && (
        <div className="modal-overlay" style={{ zIndex: 100 }}>
          <div className="modal-content glass-panel" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2>✨ AI Auto-Plan Itinerary</h2>
              <button className="btn-close" onClick={() => setShowAIModal(false)}>×</button>
            </div>
            <div className="form-group">
              <label>Duration (Days)</label>
              <input type="number" className="form-input" value={aiConfig.duration} onChange={e => setAiConfig({...aiConfig, duration: Number(e.target.value)})} />
            </div>
            <div className="form-group">
              <label>Pace</label>
              <select className="form-input" value={aiConfig.pace} onChange={e => setAiConfig({...aiConfig, pace: e.target.value})}>
                <option value="Relaxed">Relaxed</option>
                <option value="Balanced">Balanced</option>
                <option value="Packed">Packed</option>
              </select>
            </div>
            <div className="form-group">
              <label>Vibe / Interests</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                {['Foodie', 'Culture', 'Nature', 'Nightlife', 'Adventure', 'Luxury'].map(v => (
                  <span 
                    key={v} 
                    onClick={() => {
                      if (aiConfig.vibes.includes(v)) setAiConfig({ ...aiConfig, vibes: aiConfig.vibes.filter(x => x !== v) });
                      else setAiConfig({ ...aiConfig, vibes: [...aiConfig.vibes, v] });
                    }}
                    style={{ 
                      padding: '6px 12px', borderRadius: '16px', fontSize: '0.85rem', cursor: 'pointer',
                      background: aiConfig.vibes.includes(v) ? 'var(--primary)' : 'var(--surface-hover)',
                      color: aiConfig.vibes.includes(v) ? '#fff' : 'var(--text-primary)',
                      border: `1px solid ${aiConfig.vibes.includes(v) ? 'var(--primary)' : 'var(--surface-border)'}`
                    }}
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
            <div className="form-actions mt-4">
              <button type="button" className="btn btn-secondary" onClick={() => setShowAIModal(false)}>Cancel</button>
              <button type="button" className="btn btn-primary glowing-pill" onClick={handleGenerateAI} disabled={isGenerating}>
                {isGenerating ? 'Generating...' : 'Generate Plan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripDetails;
