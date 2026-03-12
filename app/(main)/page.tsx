"use client";

import { useEffect } from "react";
import { useLocation, useDashboardData } from "@/hooks/use-location";
import { SupplierDashboard } from "@/components/dashboard/supplier-dashboard";
import { ManufacturerDashboard } from "@/components/dashboard/manufacturer-dashboard";
import { WarehouseDashboard } from "@/components/dashboard/warehouse-dashboard";
import { DistributorDashboard } from "@/components/dashboard/distributor-dashboard";
import { RetailDashboard } from "@/components/dashboard/retail-dashboard";
import type { LocationType } from "@/lib/mock-data";

/**
 * Dashboard Page
 *
 * Location-based dashboard that displays different content based on user's location type:
 * - Supplier: Raw material shipments and deliveries
 * - Manufacturer: Production batches and incoming raw materials
 * - Warehouse: Stock summary and incoming/outgoing shipments
 * - Distributor: Stock overview and retail order management
 * - Retail: Stock overview and low stock alerts
 */
export default function DashboardPage() {
  const { locationType, setLocationType } = useLocation();
  const dashboardData = useDashboardData(locationType);

  // Render the appropriate dashboard based on location type
  const renderDashboard = () => {
    switch (locationType) {
      case "supplier":
        return <SupplierDashboard data={dashboardData} />;
      case "manufacturer":
        return <ManufacturerDashboard data={dashboardData} />;
      case "warehouse":
        return <WarehouseDashboard data={dashboardData} />;
      case "distributor":
        return <DistributorDashboard data={dashboardData} />;
      case "retail":
        return <RetailDashboard data={dashboardData} />;
      default:
        return <ManufacturerDashboard data={dashboardData} />;
    }
  };

  const locationOptions: { value: LocationType; label: string; color: string }[] = [
    { value: "supplier", label: "Supplier", color: "bg-purple-100 text-purple-700" },
    { value: "manufacturer", label: "Manufacturer", color: "bg-blue-100 text-blue-700" },
    { value: "warehouse", label: "Warehouse", color: "bg-orange-100 text-orange-700" },
    { value: "distributor", label: "Distributor", color: "bg-cyan-100 text-cyan-700" },
    { value: "retail", label: "Retail", color: "bg-green-100 text-green-700" },
  ];

  const currentLocationLabel = locationOptions.find((loc) => loc.value === locationType)?.label || "Manufacturer";

  return (
    <div className="space-y-6">
      {/* Page Header with Location Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            {currentLocationLabel} location overview
          </p>
        </div>

        {/* Location Selector (for testing/demonstration) */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">View as:</span>
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
            {locationOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setLocationType(option.value)}
                className={`
                  px-3 py-1.5 text-xs font-medium rounded-md transition-all
                  ${locationType === option.value
                    ? `${option.color} shadow-sm`
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      {renderDashboard()}
    </div>
  );
}
