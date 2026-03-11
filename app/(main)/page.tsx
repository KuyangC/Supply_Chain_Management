"use client";

import { Button } from "@/components/ui/button";
import { SummaryCard } from "@/components/shared/summary-card";
import { InventoryFlowChart } from "@/components/shared/inventory-flow-chart";
import { ShipmentStatusChart } from "@/components/shared/shipment-status-chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Package,
  Warehouse,
  Truck,
  AlertTriangle,
  Clock,
  TrendingUp,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useProducts, useShipments } from "@/hooks/use-api-data";
import { TableLoading, TableError } from "@/components/shared/table-states";
import { useMemo } from "react";

/**
 * Dashboard Page
 *
 * Main dashboard showing summary statistics, charts, and recent activity
 * Updated to match Figma design
 */
export default function DashboardPage() {
  // Fetch real data from API
  const { data: products = [], isLoading: productsLoading, error: productsError, refetch: refetchProducts } = useProducts();
  const { data: shipments = [], isLoading: shipmentsLoading, error: shipmentsError, refetch: refetchShipments } = useShipments();

  // Calculate summary statistics from real data
  const summaryData = useMemo(() => {
    const totalProducts = products.length;
    const lowStockProducts = products.filter((p) => p.stock < (p.minStock ?? 10)).length;
    const totalShipments = shipments.length;
    const inTransitShipments = shipments.filter((s) => s.status === "IN_TRANSIT").length;
    const deliveredShipments = shipments.filter((s) => s.status === "DELIVERED").length;
    const pendingShipments = shipments.filter((s) => s.status === "PENDING").length;
    const confirmedShipments = shipments.filter((s) => s.status === "CONFIRMED").length;
    const pickedUpShipments = shipments.filter((s) => s.status === "PICKED_UP").length;

    return [
      {
        title: "Total Products",
        value: totalProducts,
        icon: Package,
        trend: { value: totalProducts > 0 ? "+5%" : "0%", direction: "up" as const },
      },
      {
        title: "Locations",
        value: 5,
        icon: Warehouse,
        trend: { value: "+1", direction: "up" as const },
      },
      {
        title: "Confirmed",
        value: confirmedShipments,
        icon: Warehouse,
        trend: { value: confirmedShipments > 0 ? "+2" : "0", direction: "up" as const },
      },
      {
        title: "Shipments",
        value: totalShipments,
        icon: Truck,
        trend: { value: totalShipments > 0 ? "+3" : "0", direction: "up" as const },
      },
      {
        title: "Low Stock",
        value: lowStockProducts,
        icon: AlertTriangle,
        trend: { value: lowStockProducts > 0 ? "-2" : "0", direction: "down" as const },
        variant: "warning" as const,
      },
      {
        title: "Expiring Soon",
        value: 12,
        icon: Clock,
        trend: { value: "+4", direction: "up" as const },
        variant: "danger" as const,
      },
      {
        title: "In Transit",
        value: inTransitShipments,
        icon: TrendingUp,
        trend: { value: inTransitShipments > 0 ? "+6" : "0", direction: "up" as const },
        variant: "info" as const,
      },
    ];
  }, [products, shipments]);

  // Get recent shipments (last 5)
  const recentShipments = useMemo(() => {
    if (!shipments || shipments.length === 0) return [];

    return shipments
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map((shipment) => ({
        id: shipment.trackingId,
        from: shipment.fromLocation?.name || "-",
        to: shipment.toLocation?.name || "-",
        product: shipment.items?.[0]?.product?.name || "-",
        status: shipment.status,
        date: new Date(shipment.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      }));
  }, [shipments]);

  const systemAlerts = [
    {
      id: 1,
      type: "warning",
      title: "Low Stock Alert",
      message: "5 products are running low on stock",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "danger",
      title: "Expiry Warning",
      message: "3 batches expiring within 7 days",
      time: "5 hours ago",
    },
    {
      id: 3,
      type: "success",
      title: "Shipment Delivered",
      message: "TXF003 has been successfully delivered",
      time: "1 day ago",
    },
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertCircle className="h-5 w-5 text-[#f59e0b]" />;
      case "danger":
        return <AlertCircle className="h-5 w-5 text-[#ef4444]" />;
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-[#10b981]" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Overview of your supply chain metrics and recent activity
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            refetchProducts();
            refetchShipments();
          }}
          disabled={productsLoading || shipmentsLoading}
          className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${(productsLoading || shipmentsLoading) ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {summaryData.map((item) => (
          <SummaryCard
            key={item.title}
            title={item.title}
            value={item.value}
            icon={item.icon}
            trend={item.trend}
            variant={item.variant}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Inventory Flow Trend */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Inventory Flow Trend</h3>
              <p className="text-sm text-gray-500">
                Total inventory movement over time
              </p>
            </div>
          </div>
          <div className="mt-6">
            <InventoryFlowChart />
          </div>
        </div>

        {/* Shipment Status */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Shipment Status</h3>
              <p className="text-sm text-gray-500">
                Current shipment distribution
              </p>
            </div>
          </div>
          <div className="mt-6">
            <ShipmentStatusChart />
          </div>
        </div>
      </div>

      {/* Recent Shipments and System Alerts */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Shipments Table */}
        <div className="lg:col-span-2 rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Recent Shipments</h3>
              <p className="text-sm text-gray-500">
                Latest shipment activity across all locations
              </p>
            </div>
            <Link
              href="/shipments"
              className="flex items-center text-sm font-medium text-[#3b82f6] hover:text-[#2563eb] transition-colors"
            >
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-gray-100">
                  <TableHead className="text-gray-500 font-medium">Tracking ID</TableHead>
                  <TableHead className="text-gray-500 font-medium">From</TableHead>
                  <TableHead className="text-gray-500 font-medium">To</TableHead>
                  <TableHead className="text-gray-500 font-medium">Product</TableHead>
                  <TableHead className="text-gray-500 font-medium">Status</TableHead>
                  <TableHead className="text-gray-500 font-medium">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shipmentsLoading ? (
                  <TableLoading colSpan={6} />
                ) : shipmentsError ? (
                  <TableError
                    colSpan={6}
                    message={shipmentsError instanceof Error ? shipmentsError.message : "Failed to load shipments"}
                    onRetry={() => refetchShipments()}
                  />
                ) : recentShipments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="h-32 text-center text-gray-500">
                      No recent shipments found
                    </td>
                  </tr>
                ) : (
                  recentShipments.map((shipment) => (
                    <TableRow key={shipment.id} className="hover:bg-gray-50/50 border-b border-gray-50">
                      <TableCell className="font-medium text-gray-900">{shipment.id}</TableCell>
                      <TableCell className="text-gray-600">{shipment.from}</TableCell>
                      <TableCell className="text-gray-600">{shipment.to}</TableCell>
                      <TableCell className="text-gray-600">{shipment.product}</TableCell>
                      <TableCell>
                        <StatusBadge status={shipment.status} type="shipment" />
                      </TableCell>
                      <TableCell className="text-gray-600">{shipment.date}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* System Alerts */}
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h3 className="text-base font-semibold text-gray-900">System Alerts</h3>
              <p className="text-sm text-gray-500">
                Recent notifications and warnings
              </p>
            </div>
          </div>
          <div className="p-4 space-y-3">
            {systemAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{alert.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
