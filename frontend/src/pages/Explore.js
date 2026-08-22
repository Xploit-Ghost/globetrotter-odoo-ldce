import React from 'react';
import { Search } from 'lucide-react';
import { EXPLORE_CITIES } from '../data/exploreData';
import './HomeDashboard.css';

const Explore = () => {
  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      <div className="dashboard-header" style={{ alignItems: 'center' }}>
        <div className="dashboard-header-text">
          <span className="text-secondary tracking-widest uppercase font-bold" style={{ fontSize: '0.85rem' }}>DISCOVER</span>
          <h1 className="dashboard-title">Explore Cities</h1>
        </div>
        <div className="input-with-icon" style={{ minWidth: '350px' }}>
          <Search className="input-icon" size={18} />
          <input type="text" placeholder="Search for cities, landmarks, or food..." style={{ width: '100%', padding: '14px 16px 14px 48px', borderRadius: '12px', background: 'var(--surface)' }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', overflowX: 'auto' }}>
        <button className="btn btn-primary glowing-pill">Trending</button>
        <button className="btn btn-secondary" style={{ borderRadius: '24px' }}>Budget Friendly</button>
        <button className="btn btn-secondary" style={{ borderRadius: '24px' }}>Adventure</button>
        <button className="btn btn-secondary" style={{ borderRadius: '24px' }}>Couples</button>
      </div>

      <div className="destinations-grid">
        {EXPLORE_CITIES.map(city => (
          <div key={city.id} className="dest-card" style={{ backgroundImage: `url('${city.image}')`, height: '350px' }}>
            <div className="dest-overlay">
              <span className="chip" style={{ background: 'rgba(255,255,255,0.2)', marginBottom: '8px', display: 'inline-block', backdropFilter: 'blur(4px)' }}>
                {city.tag}
              </span>
              <h4>{city.name}</h4>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginTop: '4px' }}>{city.highlights}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;
