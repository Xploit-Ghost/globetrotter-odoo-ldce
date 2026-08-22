import React, { createContext, useContext, useState } from 'react';
import { INITIAL_TRIPS } from '../data/tripsData';

const TripsContext = createContext();

export const TripsProvider = ({ children }) => {
  const [trips, setTrips] = useState(INITIAL_TRIPS);

  const addTrip = (trip) => {
    setTrips([trip, ...trips]);
  };

  return (
    <TripsContext.Provider value={{ trips, setTrips, addTrip }}>
      {children}
    </TripsContext.Provider>
  );
};

export const useTrips = () => useContext(TripsContext);
