import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockCars } from '../data/mockCars';
import storage from '../utils/storage';

const CarContext = createContext();

export const useCarContext = () => {
  const context = useContext(CarContext);
  if (!context) {
    throw new Error('useCarContext must be used within a CarProvider');
  }
  return context;
};

export const CarProvider = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [cars, setCars] = useState(mockCars);
  const [initialized, setInitialized] = useState(false);

  // Initialize from storage
  useEffect(() => {
    const loadData = async () => {
      const savedMode = await storage.getItem('carValue_demoMode');
      const demoMode = savedMode ? JSON.parse(savedMode) : true;
      setIsDemoMode(demoMode);

      if (!demoMode) {
        const savedCars = await storage.getItem('carValue_cars');
        if (savedCars) {
          try {
            setCars(JSON.parse(savedCars));
          } catch (e) {
            setCars([]);
          }
        } else {
          setCars([]);
        }
      } else {
        setCars(mockCars);
      }
      setInitialized(true);
    };
    loadData();
  }, []);

  // Sync cars to storage
  useEffect(() => {
    if (initialized && !isDemoMode) {
      storage.setItem('carValue_cars', JSON.stringify(cars));
    }
  }, [cars, isDemoMode, initialized]);

  // Sync demo mode to storage
  useEffect(() => {
    if (initialized) {
      storage.setItem('carValue_demoMode', JSON.stringify(isDemoMode));
    }
  }, [isDemoMode, initialized]);

  const toggleDemoMode = async () => {
    const newMode = !isDemoMode;
    setIsDemoMode(newMode);

    if (newMode) {
      // Switching to demo mode - load demo data
      setCars(mockCars);
    } else {
      // Switching to live mode - load saved data or empty array
      const saved = await storage.getItem('carValue_cars');
      setCars(saved ? JSON.parse(saved) : []);
    }
  };

  const addCar = (car) => {
    const newCar = {
      ...car,
      id: Date.now().toString(),
      color: ['primary', 'secondary', 'success', 'warning', 'info'][cars.length % 5],
    };
    setCars([...cars, newCar]);
    return newCar;
  };

  const updateCar = (id, updates) => {
    setCars(cars.map(car => car.id === id ? { ...car, ...updates } : car));
  };

  const deleteCar = (id) => {
    setCars(cars.filter(car => car.id !== id));
  };

  const value = {
    cars,
    isDemoMode,
    toggleDemoMode,
    addCar,
    updateCar,
    deleteCar,
  };

  return <CarContext.Provider value={value}>{children}</CarContext.Provider>;
};
