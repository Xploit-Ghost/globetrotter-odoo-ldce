import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, MapPin, Calendar, Wallet, Users, Compass, Save, RefreshCw } from 'lucide-react';
import { useTrips } from '../context/TripsContext';
import aiService from '../services/aiPlannerService';
import './AiPlanner.css';

const VIBES_LIST = ['Foodie', 'History', 'Culture', 'Nature', 'Shopping', 'Adventure', 'Luxury', 'Nightlife', 'Relaxation'];

const AiPlanner = () => {
  const navigate = useNavigate();
  const { addTrip } = useTrips();
  
  // State
  const [step, setStep] = useState('input'); // input | generating | preview
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    currency: '₹',
    travelers: 'Couple',
    pace: 'Balanced',
    vibes: []
  });
  
  const [generatedTrip, setGeneratedTrip] = useState(null);
  const [generationPhase, setGenerationPhase] = useState('');

  const toggleVibe = (vibe) => {
    setFormData(prev => ({
      ...prev,
      vibes: prev.vibes.includes(vibe) 
        ? prev.vibes.filter(v => v !== vibe)
        : [...prev.vibes, vibe]
    }));
  };

  const handleGenerate = async () => {
    if (!formData.destination || !formData.startDate || !formData.endDate || !formData.budget) {
      alert("Please fill out all required fields.");
      return;
    }

    setStep('generating');
    
    // Animate loading text
    const phases = [
      "Analyzing destination & seasonal weather...",
      "Curating daily timeline & local gems...",
      "Optimizing budget & expense categories..."
    ];
    let currentPhase = 0;
    setGenerationPhase(phases[0]);
    
    const interval = setInterval(() => {
      currentPhase = (currentPhase + 1) % phases.length;
      setGenerationPhase(phases[currentPhase]);
    }, 2000);

    try {
      const datesString = `${formData.startDate} to ${formData.endDate}`;
      const trip = await aiService.generateFullTrip(
        formData.destination,
        datesString,
        Number(formData.budget),
        formData.currency,
        formData.travelers,
        formData.pace,
        formData.vibes
      );
      
      clearInterval(interval);
      setGeneratedTrip(trip);
      setStep('preview');
    } catch (err) {
      console.error(err);
      clearInterval(interval);
      alert("Failed to generate trip. Please try again.");
      setStep('input');
    }
  };

  const handleSaveAndEdit = () => {
    if (generatedTrip) {
      addTrip(generatedTrip);
      navigate(`/trips/${generatedTrip.id}`);
    }
  };

  if (step === 'generating') {
    return (
      <div className="container ai-loader-container">
        <div className="ai-spinner"></div>
        <h2 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '16px' }}>Crafting your perfect trip...</h2>
        <p className="ai-status-text">{generationPhase}</p>
      </div>
    );
  }

  if (step === 'preview' && generatedTrip) {
    const totalEstimated = generatedTrip.activities.reduce((sum, act) => sum + (Number(act.estimatedCost) || 0), 0);
    
    // Group activities by date
    const days = generatedTrip.activities.reduce((acc, act) => {
      if (!acc[act.date]) acc[act.date] = [];
      acc[act.date].push(act);
      return acc;
    }, {});

    return (
      <div className="container ai-planner-container">
        <div className="ai-preview-header">
          <img src={generatedTrip.image} alt={generatedTrip.title} />
          <div className="ai-preview-overlay">
            <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{generatedTrip.title}</h1>
            <div className="ai-preview-stats">
              <span className="ai-preview-badge"><Calendar size={16} /> {generatedTrip.days} Days</span>
              <span className="ai-preview-badge"><Users size={16} /> {formData.travelers}</span>
              <span className="ai-preview-badge"><Wallet size={16} /> Est. {formData.currency}{totalEstimated.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="ai-preview-actions">
          <button className="btn btn-primary glowing-pill" onClick={handleSaveAndEdit}>
            <Save size={18} /> Save to My Trips & Open Editor
          </button>
          <button className="btn btn-secondary" onClick={() => setStep('input')}>
            <RefreshCw size={18} /> Adjust Preferences
          </button>
        </div>

        <div className="ai-preview-content">
          <h2 style={{ marginBottom: '24px' }}>Itinerary Preview</h2>
          {Object.entries(days).map(([date, acts]) => (
            <div key={date} className="preview-day-card glass-panel p-6">
              <h3 className="preview-day-header">{date}</h3>
              <div className="preview-activity-list">
                {acts.map((act, idx) => (
                  <div key={idx} className="preview-activity-item">
                    <div className="preview-activity-time">{act.time}</div>
                    <div className="preview-activity-details">
                      <h5>{act.title}</h5>
                      <div className="preview-activity-meta">
                        <span>{act.category}</span>
                        <span>•</span>
                        <span style={{ color: 'var(--success)' }}>{formData.currency}{act.estimatedCost}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Input Step
  return (
    <div className="container ai-planner-container">
      <div className="ai-header text-center">
        <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '12px' }}>✨ AI Trip Planner</h1>
        <p>Let our intelligent engine craft an end-to-end itinerary based on your vibe, pace, and budget.</p>
      </div>

      <div className="ai-grid">
        <div className="ai-form-panel glass-panel">
          <h3><Sparkles size={24} color="var(--primary)" /> Trip Configuration</h3>
          
          <div className="ai-section">
            <h4 className="ai-section-title">Where & When</h4>
            <div className="form-group">
              <label className="form-label">Destination</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={18} style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--text-secondary)' }} />
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Tokyo, Kyoto & Osaka" 
                  style={{ paddingLeft: '44px' }}
                  value={formData.destination}
                  onChange={e => setFormData({...formData, destination: e.target.value})}
                />
              </div>
            </div>
            
            <div className="form-row-3">
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input type="date" className="form-input" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">End Date</label>
                <input type="date" className="form-input" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="ai-section">
            <h4 className="ai-section-title">Budget & Group</h4>
            <div className="form-row-3">
              <div className="form-group">
                <label className="form-label">Budget Target</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select className="form-input" style={{ width: '80px', padding: '14px 8px' }} value={formData.currency} onChange={e => setFormData({...formData, currency: e.target.value})}>
                    <option value="₹">₹</option>
                    <option value="$">$</option>
                    <option value="€">€</option>
                    <option value="£">£</option>
                  </select>
                  <input type="number" className="form-input" placeholder="Amount" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Travelers</label>
                <select className="form-input" value={formData.travelers} onChange={e => setFormData({...formData, travelers: e.target.value})}>
                  <option value="Solo">Solo</option>
                  <option value="Couple">Couple</option>
                  <option value="Friends Group">Friends Group</option>
                  <option value="Family with Kids">Family with Kids</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Pace</label>
                <select className="form-input" value={formData.pace} onChange={e => setFormData({...formData, pace: e.target.value})}>
                  <option value="Relaxed">Relaxed (1-2 acts/day)</option>
                  <option value="Balanced">Balanced (2-3 acts/day)</option>
                  <option value="Action-Packed">Action-Packed (4+ acts/day)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="ai-section">
            <h4 className="ai-section-title">Vibes & Interests</h4>
            <div className="vibe-pills">
              {VIBES_LIST.map(vibe => (
                <div 
                  key={vibe} 
                  className={`vibe-pill ${formData.vibes.includes(vibe) ? 'active' : ''}`}
                  onClick={() => toggleVibe(vibe)}
                >
                  {vibe}
                </div>
              ))}
            </div>
          </div>

          <button className="btn btn-primary glowing-pill" style={{ width: '100%', marginTop: '16px', fontSize: '1.1rem' }} onClick={handleGenerate}>
            ✨ Generate Custom Itinerary
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiPlanner;
