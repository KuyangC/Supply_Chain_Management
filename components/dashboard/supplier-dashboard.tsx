/**
 * Supplier Dashboard Component
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
  Clock,
  Calendar,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import type { DashboardData } from "@/lib/mock-data";

interface SupplierDashboardProps {
  data: DashboardData;
}

export function SupplierDashboard({ data }: SupplierDashboardProps) {
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
    Clock,
    Calendar,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Supplier Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Overview of your raw material shipments and deliveries
          </p>
        </div>
        <Button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white">
          + New Shipment
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

      {/* Pending & Recent Deliveries */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Confirmation */}
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Pending Confirmation</h3>
              <p className="text-sm text-gray-500">
                Waiting for receiver confirmation
              </p>
            </div>
          </div>
          <div className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-gray-100">
                  <TableHead className="text-gray-500 font-medium">ID</TableHead>
                  <TableHead className="text-gray-500 font-medium">To</TableHead>
                  <TableHead className="text-gray-500 font-medium">Product</TableHead>
                  <TableHead className="text-gray-500 font-medium">Qty</TableHead>
                  <TableHead className="text-gray-500 font-medium">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentShipments
                  .filter((s) => s.status === "in_transit" || s.status === "confirmed")
                  .map((shipment) => (
                    <TableRow key={shipment.id} className="hover:bg-gray-50/50 border-b border-gray-50">
                      <TableCell className="font-medium text-gray-900">{shipment.id}</TableCell>
                      <TableCell className="text-gray-600">{shipment.to}</TableCell>
                      <TableCell className="text-gray-600">{shipment.product}</TableCell>
                      <TableCell className="text-gray-600">—</TableCell>
                      <TableCell className="text-gray-600">{shipment.date}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Recent Deliveries */}
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Recent Deliveries</h3>
              <p className="text-sm text-gray-500">
                Successfully delivered shipments
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
                  <TableHead className="text-gray-500 font-medium">To</TableHead>
                  <TableHead className="text-gray-500 font-medium">Product</TableHead>
                  <TableHead className="text-gray-500 font-medium">Status</TableHead>
                  <TableHead className="text-gray-500 font-medium">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentShipments
                  .filter((s) => s.status === "delivered")
                  .map((shipment) => (
                    <TableRow key={shipment.id} className="hover:bg-gray-50/50 border-b border-gray-50">
                      <TableCell className="font-medium text-gray-900">{shipment.id}</TableCell>
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
