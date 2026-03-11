"use client";

import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useShipments } from "@/hooks/use-api-data";
import { TableLoading, TableError, TableEmpty } from "@/components/shared/table-states";
import { useState } from "react";

/**
 * Shipments List Page
 *
 * Displays all shipments with filtering and tracking
 */
export default function ShipmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: shipments = [], isLoading, error, refetch } = useShipments();

  // Filter shipments based on search and status
  const filteredShipments = shipments.filter((shipment) => {
    const trackingId = shipment.trackingId || "";
    const fromLocation = shipment.fromLocation?.name || "";
    const toLocation = shipment.toLocation?.name || "";

    const matchesSearch =
      !searchQuery ||
      trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fromLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      toLocation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      shipment.status.toLowerCase() === statusFilter.toLowerCase() ||
      shipment.status === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  // Get first product name from items
  const getProductName = (shipment: typeof shipments[0]): string => {
    if (shipment.items && shipment.items.length > 0) {
      return shipment.items[0].product?.name || "Unknown";
    }
    return "-";
  };

  // Get total quantity from items
  const getTotalQuantity = (shipment: typeof shipments[0]): number => {
    if (shipment.items && shipment.items.length > 0) {
      return shipment.items.reduce((sum, item) => sum + item.qty, 0);
    }
    return 0;
  };

  // Format date
  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shipments</h1>
          <p className="text-muted-foreground">
            Track and manage shipments across locations
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Link href="/shipments/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Shipment
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search shipments..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="picked_up">Picked Up</SelectItem>
            <SelectItem value="in_transit">In Transit</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Shipments Table */}
      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tracking ID</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableLoading colSpan={8} />
            ) : error ? (
              <TableError
                colSpan={8}
                message={error instanceof Error ? error.message : "Failed to load shipments"}
                onRetry={() => refetch()}
              />
            ) : filteredShipments.length === 0 ? (
              <TableEmpty
                colSpan={8}
                message={shipments.length === 0 ? "No shipments found. Create your first shipment to get started." : "No shipments match your filters."}
              />
            ) : (
              filteredShipments.map((shipment) => (
                <TableRow key={shipment.id}>
                  <TableCell className="font-medium">{shipment.trackingId}</TableCell>
                  <TableCell>{shipment.fromLocation?.name || "-"}</TableCell>
                  <TableCell>{shipment.toLocation?.name || "-"}</TableCell>
                  <TableCell>{getProductName(shipment)}</TableCell>
                  <TableCell>{getTotalQuantity(shipment)}</TableCell>
                  <TableCell>
                    <StatusBadge status={shipment.status} type="shipment" />
                  </TableCell>
                  <TableCell>{formatDate(shipment.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/shipments/${shipment.id}`}>View</Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/shipments/${shipment.id}/track`}>Track</Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
