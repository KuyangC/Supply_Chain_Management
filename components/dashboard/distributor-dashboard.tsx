/**
 * Distributor Dashboard Component
 */

import { Button } from "@/components/ui/button";
import { SummaryCard } from "@/components/shared/summary-card";
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
  Truck,
  Calendar,
  Store,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import type { DashboardData } from "@/lib/mock-data";

interface DistributorDashboardProps {
  data: DashboardData;
}

export function DistributorDashboard({ data }: DistributorDashboardProps) {
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

  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Package,
    Truck,
    Calendar,
    Store,
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            Pending
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            Processing
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
            Shipped
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Distributor Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Stock overview and retail order management
          </p>
        </div>
        <Button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white">
          + Create Order
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {data.summaryCards.map((item) => {
          const Icon = iconMap[item.icon] || Package;
          return (
            <SummaryCard
              key={item.title}
              title={item.title}
              value={item.value}
              icon={Icon}
              trend={item.trend}
              variant={item.variant}
            />
          );
        })}
      </div>

      {/* Incoming Shipments & Pending Retail Orders */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Incoming Shipments */}
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Incoming Shipments</h3>
              <p className="text-sm text-gray-500">
                Shipments from warehouse
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
                  <TableHead className="text-gray-500 font-medium">ID</TableHead>
                  <TableHead className="text-gray-500 font-medium">From</TableHead>
                  <TableHead className="text-gray-500 font-medium">Product</TableHead>
                  <TableHead className="text-gray-500 font-medium">Status</TableHead>
                  <TableHead className="text-gray-500 font-medium">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentShipments.map((shipment) => (
                  <TableRow key={shipment.id} className="hover:bg-gray-50/50 border-b border-gray-50">
                    <TableCell className="font-medium text-gray-900">{shipment.id}</TableCell>
                    <TableCell className="text-gray-600">{shipment.from}</TableCell>
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

        {/* Pending Retail Orders */}
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Pending Retail Orders</h3>
              <p className="text-sm text-gray-500">
                Orders awaiting shipment to retail stores
              </p>
            </div>
            <Link
              href="/orders"
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
                  <TableHead className="text-gray-500 font-medium">Order ID</TableHead>
                  <TableHead className="text-gray-500 font-medium">Retail Store</TableHead>
                  <TableHead className="text-gray-500 font-medium">Product</TableHead>
                  <TableHead className="text-gray-500 font-medium">Qty</TableHead>
                  <TableHead className="text-gray-500 font-medium">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.pendingRetailOrders?.map((order) => (
                  <TableRow key={order.id} className="hover:bg-gray-50/50 border-b border-gray-50">
                    <TableCell className="font-medium text-gray-900">{order.id}</TableCell>
                    <TableCell className="text-gray-600">{order.retailStore}</TableCell>
                    <TableCell className="text-gray-600">{order.product}</TableCell>
                    <TableCell className="text-gray-600">{order.quantity.toLocaleString("en-US")}</TableCell>
                    <TableCell>{getOrderStatusBadge(order.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* System Alerts */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h3 className="text-base font-semibold text-gray-900">System Alerts</h3>
            <p className="text-sm text-gray-500">
              Recent notifications and updates
            </p>
          </div>
        </div>
        <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
          {data.alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex-shrink-0 mt-0.5">{getAlertIcon(alert.type)}</div>
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
  );
}
