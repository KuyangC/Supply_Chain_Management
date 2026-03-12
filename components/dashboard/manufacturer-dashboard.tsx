/**
 * Manufacturer Dashboard Component
 */

"use client";

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
import { ShipmentDetailModal } from "@/components/shared/shipment-detail-modal";
import {
  Package,
  Factory,
  CheckCircle,
  Truck,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Info,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { DashboardData } from "@/lib/mock-data";

interface ManufacturerDashboardProps {
  data: DashboardData;
}

interface ShipmentItem {
  id: string;
  from: string;
  product: string;
  quantity: number;
  date: string;
}

export function ManufacturerDashboard({ data }: ManufacturerDashboardProps) {
  const [selectedShipment, setSelectedShipment] = useState<ShipmentItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertCircle className="h-5 w-5 text-[#f59e0b]" />;
      case "danger":
        return <AlertCircle className="h-5 w-5 text-[#ef4444]" />;
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-[#10b981]" />;
      case "info":
        return <Info className="h-5 w-5 text-[#3b82f6]" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Package,
    Factory,
    CheckCircle,
    Truck,
  };

  const handleShipmentClick = (shipment: ShipmentItem) => {
    setSelectedShipment(shipment);
    setIsModalOpen(true);
  };

  const handleConfirmReceipt = (confirmData: { quantity: number; type: string }) => {
    console.log("Confirming shipment:", selectedShipment?.id, confirmData);
    // In real app, call API here
  };

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Manufacturer Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              Production overview and incoming raw materials
            </p>
          </div>
          <Button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white">
            + New Production Batch
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

        {/* Active Production Batches & Incoming Shipments */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Active Production Batches */}
          <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Active Production Batches</h3>
                <p className="text-sm text-gray-500">
                  Current production status
                </p>
              </div>
              <Link
                href="/production"
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
                    <TableHead className="text-gray-500 font-medium">Batch ID</TableHead>
                    <TableHead className="text-gray-500 font-medium">Product</TableHead>
                    <TableHead className="text-gray-500 font-medium">Target</TableHead>
                    <TableHead className="text-gray-500 font-medium">Status</TableHead>
                    <TableHead className="text-gray-500 font-medium">Started</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.productionBatches?.map((batch) => (
                    <TableRow key={batch.id} className="hover:bg-gray-50/50 border-b border-gray-50">
                      <TableCell className="font-medium text-gray-900">{batch.id}</TableCell>
                      <TableCell className="text-gray-600">{batch.product}</TableCell>
                      <TableCell className="text-gray-600">{batch.target.toLocaleString("en-US")}</TableCell>
                      <TableCell>
                        <StatusBadge status={batch.status} type="production_batch" />
                      </TableCell>
                      <TableCell className="text-gray-600">{batch.startedDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Incoming Shipments - Info Only */}
          <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Incoming Shipments</h3>
                <p className="text-sm text-gray-500">
                  Raw materials awaiting confirmation
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                    Click to confirm
                  </span>
                </p>
              </div>
            </div>
            <div className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-gray-100">
                    <TableHead className="text-gray-500 font-medium">ID</TableHead>
                    <TableHead className="text-gray-500 font-medium">From</TableHead>
                    <TableHead className="text-gray-500 font-medium">Product</TableHead>
                    <TableHead className="text-gray-500 font-medium">Qty</TableHead>
                    <TableHead className="text-gray-500 font-medium">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.incomingShipmentsToConfirm?.map((shipment) => (
                    <TableRow
                      key={shipment.id}
                      className="hover:bg-blue-50/50 cursor-pointer border-b border-gray-50 transition-colors"
                      onClick={() => handleShipmentClick(shipment)}
                    >
                      <TableCell className="font-medium text-gray-900">{shipment.id}</TableCell>
                      <TableCell className="text-gray-600">{shipment.from}</TableCell>
                      <TableCell className="text-gray-600">{shipment.product}</TableCell>
                      <TableCell className="text-gray-600">{shipment.quantity.toLocaleString("en-US")}</TableCell>
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

      {/* Shipment Detail Modal */}
      {selectedShipment && (
        <ShipmentDetailModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedShipment(null);
          }}
          shipment={{
            ...selectedShipment,
            to: "Manufaktur A", // Auto-fill based on current location
          }}
          onConfirm={handleConfirmReceipt}
        />
      )}
    </>
  );
}
