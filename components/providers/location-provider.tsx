/**
 * Location Provider
 * Provides user location context throughout the app
 */

"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { LocationType } from "@/lib/mock-data";

interface LocationContextType {
  locationType: LocationType;
  setLocationType: (location: LocationType) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within LocationProvider");
  }
  return context;
}

interface LocationProviderProps {
  children: ReactNode;
  defaultLocation?: LocationType;
}

export function LocationProvider({
  children,
  defaultLocation = "manufacturer",
}: LocationProviderProps) {
  const [locationType, setLocationType] = useState<LocationType>(defaultLocation);

  return (
    <LocationContext.Provider value={{ locationType, setLocationType }}>
      {children}
    </LocationContext.Provider>
  );
}
