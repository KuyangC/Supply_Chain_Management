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
} from "lucide-react";
import Link from "next/link";

/**
 * Dashboard Page
 *
 * Main dashboard showing summary statistics, charts, and recent activity
 * Updated to match Figma design
 */
export default function DashboardPage() {
  // Mock data - replace with actual API calls
  const summaryData = [
    {
      title: "Total Products",
      value: 150,
      icon: Package,
      trend: { value: "+5%", direction: "up" as const },
    },
    {
      title: "Locations",
      value: 5,
      icon: Warehouse,
      trend: { value: "+1", direction: "up" as const },
    },
    {
      title: "Shipments",
      value: 25,
      icon: Truck,
      trend: { value: "+3", direction: "up" as const },
    },
    {
      title: "Low Stock",
      value: 8,
      icon: AlertTriangle,
      trend: { value: "-2", direction: "down" as const },
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
      value: 18,
      icon: TrendingUp,
      trend: { value: "+6", direction: "up" as const },
      variant: "info" as const,
    },
  ];

  const recentShipments = [
    {
      id: "TXF001",
      from: "WH-001",
      to: "Store-A",
      product: "Wireless Mouse",
      status: "in_transit",
      date: "2025-03-01",
    },
    {
      id: "TXF002",
      from: "WH-001",
      to: "Store-B",
      product: "USB Cable",
      status: "pending",
      date: "2025-03-01",
    },
    {
      id: "TXF003",
      from: "WH-002",
      to: "Store-C",
      product: "Keyboard",
      status: "delivered",
      date: "2025-02-28",
    },
    {
      id: "TXF004",
      from: "WH-001",
      to: "Store-A",
      product: "Monitor",
      status: "confirmed",
      date: "2025-02-28",
    },
    {
      id: "TXF005",
      from: "WH-002",
      to: "Store-B",
      product: "Webcam",
      status: "picked_up",
      date: "2025-02-27",
    },
  ];

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
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of your supply chain metrics and recent activity
        </p>
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
                {recentShipments.map((shipment) => (
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
                ))}
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
