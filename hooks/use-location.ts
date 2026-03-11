/**
 * Custom hooks for location-based data fetching
 */

"use client";

import { useMemo, useState } from "react";
import {
  getCurrentUser,
  getDashboardData,
  DASHBOARD_DATA_BY_LOCATION,
  type LocationType,
  type MockUser,
  type DashboardData,
} from "@/lib/mock-data";

/**
 * Hook to get current user's location
 * In real app, this would come from auth context/API
 */
export function useUserLocation(locationType?: LocationType) {
  const [userLocation, setUserLocation] = useState<LocationType>(
    locationType || "manufacturer"
  );

  const user = useMemo<MockUser>(
    () => getCurrentUser(userLocation),
    [userLocation]
  );

  return {
    user,
    locationType: userLocation,
    setLocationType: setUserLocation,
  };
}

/**
 * Hook to get dashboard data based on location type
 */
export function useDashboardData(locationType: LocationType): DashboardData {
  return useMemo(() => getDashboardData(locationType), [locationType]);
}

/**
 * Hook to get navigation items based on location type
 */
export function useNavigationItems(locationType: LocationType) {
  const { NAV_ITEMS_BY_LOCATION } = require("@/lib/constants");

  return useMemo(
    () => NAV_ITEMS_BY_LOCATION[locationType] || [],
    [locationType]
  );
}
