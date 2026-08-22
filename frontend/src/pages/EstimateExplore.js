import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Train, Car, Users, Map as MapIcon, ArrowRight, Check } from 'lucide-react';
import api from '../services/api';
import './EstimateExplore.css';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const EstimateExplore = () => {
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [fromCityId, setFromCityId] = useState('');
  const [toCityId, setToCityId] = useState('');
  const [travelMode, setTravelMode] = useState('flight');
  const [travelers, setTravelers] = useState(1);
  
  const [showMapModal, setShowMapModal] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await api.get('/cities');
        setCities(response.data);
      } catch (err) {
        console.error('Failed to fetch cities', err);
      }
    };
    fetchCities();
  }, []);

  const fromCity = cities.find(c => c.id === Number(fromCityId));
  const toCity = cities.find(c => c.id === Number(toCityId));
  const isInternational = fromCity && toCity && fromCity.country !== toCity.country;

  // Auto-switch mode if international
  useEffect(() => {
    if (isInternational && travelMode !== 'flight') {
      setTravelMode('flight');
    }
  }, [isInternational, travelMode]);

  const totalDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 0;
  }, [startDate, endDate]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
  };

  const estimate = useMemo(() => {
    if (!fromCity || !toCity || totalDays <= 0) return null;
    
    const distanceKm = calculateDistance(fromCity.lat, fromCity.lng, toCity.lat, toCity.lng);
    
    let transitCost = 0;
    if (travelMode === 'flight') {
      transitCost = (4500 + (distanceKm * 5.5)) * travelers;
    } else if (travelMode === 'train') {
      transitCost = (350 + (distanceKm * 1.8)) * travelers;
    } else if (travelMode === 'car') {
      transitCost = distanceKm * 12; // Flat cost
    }

    const avgCostIndex = (fromCity.cost_index + toCity.cost_index) / 2;
    const stayCost = (totalDays * avgCostIndex * 2200) * Math.ceil(travelers / 2);
    const foodCost = (totalDays * avgCostIndex * 1000) * travelers;
    
    const total = transitCost + stayCost + foodCost;

    return {
      distanceKm,
      transitCost,
      stayCost,
      foodCost,
      total,
      perPerson: total / travelers,
      travelTimeHrs: travelMode === 'flight' ? (distanceKm/500)+1.5 : (travelMode === 'train' ? distanceKm/60 : distanceKm/50)
    };
  }, [fromCity, toCity, totalDays, travelMode, travelers]);

  const handleCreateTrip = async () => {
    if (!estimate) return;
    try {
      const payload = {
        user_email: localStorage.getItem('userEmail'),
        trip_name: `${fromCity.name} to ${toCity.name} Getaway`,
        start_date: startDate,
        end_date: endDate,
        total_budget: Math.round(estimate.total),
        currency: 'INR',
        description: `Estimated trip for ${travelers} people traveling via ${travelMode}.`
      };
      
      const response = await api.post('/trips', payload);
      const tripId = response.data.id;
      
      // Optionally auto-add stops
      await api.post(`/trips/${tripId}/stops`, {
        city_id: fromCity.id,
        city_name: fromCity.name,
        day_number: 1,
        arrival_date: startDate,
        departure_date: startDate
      });
      
      await api.post(`/trips/${tripId}/stops`, {
        city_id: toCity.id,
        city_name: toCity.name,
        day_number: totalDays,
        arrival_date: endDate,
        departure_date: endDate
      });

      // Update budget breakdown
      await api.put(`/trips/${tripId}/budget-update`, {
        travel_cost: Math.round(estimate.transitCost),
        stay_cost: Math.round(estimate.stayCost),
        food_cost: Math.round(estimate.foodCost)
      });

      navigate(`/trips/${tripId}`);
    } catch (err) {
      console.error('Failed to create trip from estimate', err);
    }
  };

  return (
    <div className="container estimate-container">
      <div className="estimate-header text-center">
        <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '12px' }}>Estimate & Explore</h1>
        <p>Instantly calculate costs, visualize routes, and build your perfect itinerary.</p>
      </div>

      <div className="estimate-grid">
        <div className="estimate-form-panel glass-panel">
          <h3>Trip Details</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input type="date" className="form-input" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">End Date</label>
              <input type="date" className="form-input" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
          </div>
          {totalDays > 0 && <div className="total-days-badge mb-4">Total Days: {totalDays} days</div>}

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Origin City</label>
              <select className="form-input" value={fromCityId} onChange={e => setFromCityId(e.target.value)}>
                <option value="">Select Origin...</option>
                {cities.map(c => (
                  <option key={c.id} value={c.id} disabled={Number(toCityId) === c.id}>{c.name}, {c.country}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Destination City</label>
              <select className="form-input" value={toCityId} onChange={e => setToCityId(e.target.value)}>
                <option value="">Select Destination...</option>
                {cities.map(c => (
                  <option key={c.id} value={c.id} disabled={Number(fromCityId) === c.id}>{c.name}, {c.country}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Travelers</label>
            <div style={{ position: 'relative' }}>
              <Users size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-secondary)' }} />
              <input 
                type="number" 
                min="1" 
                className="form-input pl-10" 
                value={travelers}
                onChange={e => setTravelers(Math.max(1, Number(e.target.value)))}
                style={{ paddingLeft: '44px' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Mode of Transport</label>
            {isInternational && <div className="warning-pill mb-2">⚠️ International transit: Flights only</div>}
            <div className="travel-modes">
              <button 
                className={`mode-btn ${travelMode === 'flight' ? 'active' : ''}`}
                onClick={() => setTravelMode('flight')}
              >
                <Plane size={20} /> Flight
              </button>
              <button 
                className={`mode-btn ${travelMode === 'train' ? 'active' : ''}`}
                onClick={() => setTravelMode('train')}
                disabled={isInternational}
              >
                <Train size={20} /> Train
              </button>
              <button 
                className={`mode-btn ${travelMode === 'car' ? 'active' : ''}`}
                onClick={() => setTravelMode('car')}
                disabled={isInternational}
              >
                <Car size={20} /> Car
              </button>
            </div>
          </div>
        </div>

        <div className="estimate-result-panel glass-panel">
          <h3>Your Estimate</h3>
          {estimate ? (
            <div className="estimate-breakdown">
              <div className="cost-row">
                <span><Plane size={16}/> Transit Cost</span>
                <strong>₹{Math.round(estimate.transitCost).toLocaleString()}</strong>
              </div>
              <div className="cost-row">
                <span>🏨 Stay Cost</span>
                <strong>₹{Math.round(estimate.stayCost).toLocaleString()}</strong>
              </div>
              <div className="cost-row">
                <span>🍔 Food & Living</span>
                <strong>₹{Math.round(estimate.foodCost).toLocaleString()}</strong>
              </div>
              <hr className="divider" />
              <div className="cost-row total-row">
                <span>Total Estimated Cost</span>
                <strong className="text-success">₹{Math.round(estimate.total).toLocaleString()}</strong>
              </div>
              <div className="cost-row">
                <span className="text-secondary">Per Person</span>
                <strong className="text-secondary">₹{Math.round(estimate.perPerson).toLocaleString()}</strong>
              </div>

              <div className="estimate-actions">
                <button className="btn btn-secondary w-100 mb-3" onClick={() => setShowMapModal(true)}>
                  <MapIcon size={18}/> View Route Details
                </button>
                <button className="btn btn-primary w-100" onClick={handleCreateTrip}>
                  <Check size={18}/> Create Trip from Estimate
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-estimate">
              <MapIcon size={48} className="empty-icon" />
              <p>Fill out the details on the left to generate an instant travel estimate.</p>
            </div>
          )}
        </div>
      </div>

      {showMapModal && estimate && (
        <div className="modal-overlay">
          <div className="map-modal glass-panel">
            <button className="close-btn" onClick={() => setShowMapModal(false)}>×</button>
            <div className="map-modal-content">
              <div className="map-container">
                <MapContainer 
                  bounds={[[fromCity.lat, fromCity.lng], [toCity.lat, toCity.lng]]} 
                  zoomControl={false} 
                  style={{ height: '100%', width: '100%', borderRadius: '16px' }}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  />
                  <Marker position={[fromCity.lat, fromCity.lng]}>
                    <Popup>{fromCity.name}</Popup>
                  </Marker>
                  <Marker position={[toCity.lat, toCity.lng]}>
                    <Popup>{toCity.name}</Popup>
                  </Marker>
                  <Polyline 
                    positions={[[fromCity.lat, fromCity.lng], [toCity.lat, toCity.lng]]}
                    color="#00f2fe"
                    weight={4}
                    opacity={0.8}
                    dashArray="10, 10"
                  />
                </MapContainer>
              </div>
              <div className="map-sidebar glass">
                <h3>Route Summary</h3>
                <div className="route-cities">
                  <div className="city">
                    <span className="city-label">ORIGIN</span>
                    <h4>{fromCity.name}</h4>
                  </div>
                  <ArrowRight size={24} color="#00f2fe" />
                  <div className="city">
                    <span className="city-label">DESTINATION</span>
                    <h4>{toCity.name}</h4>
                  </div>
                </div>

                <div className="summary-stats mt-6">
                  <div className="s-stat">
                    <span>Total Distance</span>
                    <strong>{estimate.distanceKm.toLocaleString()} km</strong>
                  </div>
                  <div className="s-stat">
                    <span>Est. Travel Time</span>
                    <strong>{estimate.travelTimeHrs.toFixed(1)} hrs</strong>
                  </div>
                  <div className="s-stat mt-4">
                    <span>Total Estimated Cost</span>
                    <strong className="text-success" style={{ fontSize: '1.5rem' }}>₹{Math.round(estimate.total).toLocaleString()}</strong>
                  </div>
                  <div className="s-stat">
                    <span>Cost Per Person</span>
                    <strong>₹{Math.round(estimate.perPerson).toLocaleString()}</strong>
                  </div>
                </div>

                <div className="mode-badge mt-6">
                  {travelMode === 'flight' && <Plane size={16}/>}
                  {travelMode === 'train' && <Train size={16}/>}
                  {travelMode === 'car' && <Car size={16}/>}
                  <span style={{ textTransform: 'capitalize' }}>{travelMode} | {estimate.travelTimeHrs.toFixed(1)} hrs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstimateExplore;
