import React, { createContext, useContext, useState } from 'react';
import { INITIAL_TRIPS } from '../data/tripsData';

const TripsContext = createContext();

export const TripsProvider = ({ children }) => {
  const [trips, setTrips] = useState(() => {
    const saved = localStorage.getItem('globetrotter_trips');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_TRIPS;
  });

  const addTrip = (trip) => {
    const updated = [trip, ...trips];
    setTrips(updated);
    localStorage.setItem('globetrotter_trips', JSON.stringify(updated));
  };

  const updateTrip = (updatedTrip) => {
    const updated = trips.map(t => t.id === updatedTrip.id ? updatedTrip : t);
    setTrips(updated);
    localStorage.setItem('globetrotter_trips', JSON.stringify(updated));
  };

  const deleteTrip = (tripId) => {
    const updated = trips.filter(t => t.id !== tripId);
    setTrips(updated);
    localStorage.setItem('globetrotter_trips', JSON.stringify(updated));
  };

  return (
    <TripsContext.Provider value={{ trips, setTrips, addTrip, updateTrip, deleteTrip }}>
      {children}
    </TripsContext.Provider>
  );
};

export const useTrips = () => useContext(TripsContext);
