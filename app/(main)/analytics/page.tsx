"use client";

import { Button } from "@/components/ui/button";
import { Download, Calendar, RefreshCw, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SummaryCard } from "@/components/shared/summary-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useProducts, useShipments, useInventory } from "@/hooks/use-api-data";
import { TableError, TableLoading } from "@/components/shared/table-states";
import { useMemo, useState } from "react";
import { formatCurrency } from "@/lib/utils";

/**
 * Analytics & Reports Page
 *
 * Displays analytics with charts and export options
 * Updated to use real API data
 */
export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("30d");

  const { data: products = [], isLoading: productsLoading, error: productsError, refetch: refetchProducts } = useProducts();
  const { data: shipments = [], isLoading: shipmentsLoading, error: shipmentsError, refetch: refetchShipments } = useShipments();
  const { data: inventory = [], isLoading: inventoryLoading, error: inventoryError, refetch: refetchInventory } = useInventory();

  /**
   * Calculate summary data from real API data
   */
  const summaryData = useMemo(() => {
    // Calculate inventory value (assuming $15 average value per item for demo)
    const totalInventoryValue = inventory.reduce((sum, item) => sum + (item.qty * 15), 0);

    const totalShipments = shipments.length;
    const deliveredShipments = shipments.filter((s) => s.status === "DELIVERED").length;
    const completionRate = totalShipments > 0 ? (deliveredShipments / totalShipments) * 100 : 0;

    // Calculate average delivery time (mock calculation for now)
    const avgDeliveryTime = "2.5 days";

    // Calculate trends (comparing to previous period - simplified for now)
    const inventoryTrend = "+8%";
    const shipmentsTrend = "+12%";
    const completionTrend = "+2%";

    return [
      {
        title: "Inventory Value",
        value: formatCurrency(totalInventoryValue),
        trend: { value: inventoryTrend, direction: "up" as const },
      },
      {
        title: "Total Shipments",
        value: totalShipments,
        trend: { value: shipmentsTrend, direction: "up" as const },
      },
      {
        title: "Completion Rate",
        value: `${completionRate.toFixed(1)}%`,
        trend: { value: completionTrend, direction: "up" as const },
      },
      {
        title: "Avg. Delivery Time",
        value: avgDeliveryTime,
        trend: { value: "-0.5 days", direction: "down" as const },
      },
    ];
  }, [products, shipments, inventory]);

  /**
   * Generate inventory report from real data
   */
  const inventoryReport = useMemo(() => {
    return products.map((product) => ({
      id: product.id,
      product: product.name,
      category: product.category,
      stock: product.stock,
      value: formatCurrency(product.stock * 15), // Assuming $15 average value
      lowStock: product.stock < product.minStock,
      expiring: false, // Expiry data not available in product model
    }));
  }, [products]);

  /**
   * Get shipment status distribution for chart
   */
  const shipmentStatusDistribution = useMemo(() => {
    const distribution = {
      pending: shipments.filter((s) => s.status === "PENDING").length,
      confirmed: shipments.filter((s) => s.status === "CONFIRMED").length,
      pickedUp: shipments.filter((s) => s.status === "PICKED_UP").length,
      inTransit: shipments.filter((s) => s.status === "IN_TRANSIT").length,
      delivered: shipments.filter((s) => s.status === "DELIVERED").length,
      failed: shipments.filter((s) => s.status === "FAILED").length,
      cancelled: shipments.filter((s) => s.status === "CANCELLED").length,
    };
    return distribution;
  }, [shipments]);

  /**
   * Get inventory by category for chart
   */
  const inventoryByCategory = useMemo(() => {
    const categoryMap = new Map<string, number>();

    products.forEach((product) => {
      const current = categoryMap.get(product.category) || 0;
      categoryMap.set(product.category, current + product.stock);
    });

    return Array.from(categoryMap.entries()).map(([category, stock]) => ({
      category,
      stock,
    }));
  }, [products]);

  /**
   * Refresh all data
   */
  function handleRefresh() {
    refetchProducts();
    refetchShipments();
    refetchInventory();
  }

  /**
   * Handle export (placeholder)
   */
  function handleExport() {
    // TODO: Implement export functionality
    console.log("Export clicked");
  }

  const isLoading = productsLoading || shipmentsLoading || inventoryLoading;
  const hasError = productsError || shipmentsError || inventoryError;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
          <p className="text-muted-foreground">
            View insights and export reports
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="lastMonth">Last Month</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryData.map((item) => (
          <SummaryCard
            key={item.title}
            title={item.title}
            value={item.value}
            trend={item.trend}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Inventory by Category Chart */}
        <div className="rounded-xl border bg-card p-6">
          <h3 className="text-lg font-semibold">Inventory by Category</h3>
          <p className="text-sm text-muted-foreground">
            Distribution of inventory across categories
          </p>
          <div className="mt-6">
            {productsLoading ? (
              <div className="h-64 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : inventoryByCategory.length === 0 ? (
              <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
                <span className="text-muted-foreground">No inventory data available</span>
              </div>
            ) : (
              <div className="space-y-3">
                {inventoryByCategory.map((item) => {
                  const maxStock = Math.max(...inventoryByCategory.map((i) => i.stock));
                  const percentage = (item.stock / maxStock) * 100;
                  return (
                    <div key={item.category} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{item.category}</span>
                        <span className="text-muted-foreground">{item.stock} units</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Shipment Status Distribution */}
        <div className="rounded-xl border bg-card p-6">
          <h3 className="text-lg font-semibold">Shipment Status</h3>
          <p className="text-sm text-muted-foreground">
            Current shipment distribution
          </p>
          <div className="mt-6">
            {shipmentsLoading ? (
              <div className="h-64 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : shipments.length === 0 ? (
              <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
                <span className="text-muted-foreground">No shipment data available</span>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(shipmentStatusDistribution).map(([status, count]) => {
                  if (count === 0) return null;
                  const maxCount = Math.max(...Object.values(shipmentStatusDistribution));
                  const percentage = (count / maxCount) * 100;

                  const statusColors: Record<string, string> = {
                    pending: "bg-gray-500",
                    confirmed: "bg-blue-500",
                    pickedUp: "bg-amber-500",
                    inTransit: "bg-indigo-500",
                    delivered: "bg-green-500",
                    failed: "bg-red-500",
                    cancelled: "bg-red-400",
                  };

                  const statusLabels: Record<string, string> = {
                    pending: "Pending",
                    confirmed: "Confirmed",
                    pickedUp: "Picked Up",
                    inTransit: "In Transit",
                    delivered: "Delivered",
                    failed: "Failed",
                    cancelled: "Cancelled",
                  };

                  return (
                    <div key={status} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium capitalize">{statusLabels[status] || status}</span>
                        <span className="text-muted-foreground">{count} shipments</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${statusColors[status] || "bg-gray-500"} rounded-full transition-all`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Inventory Report Table */}
      <div className="rounded-xl border bg-card">
        <div className="flex items-center justify-between p-6">
          <div>
            <h3 className="text-lg font-semibold">Inventory Report</h3>
            <p className="text-sm text-muted-foreground">
              Detailed inventory status by product
            </p>
          </div>
        </div>
        <div className="p-6 pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Low Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productsLoading ? (
                <TableLoading colSpan={5} />
              ) : hasError ? (
                <TableError
                  colSpan={5}
                  message="Failed to load inventory data"
                  onRetry={handleRefresh}
                />
              ) : inventoryReport.length === 0 ? (
                <tr>
                  <td colSpan={5} className="h-32 text-center text-muted-foreground">
                    No inventory data found
                  </td>
                </tr>
              ) : (
                inventoryReport.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.product}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.stock}</TableCell>
                    <TableCell>{item.value}</TableCell>
                    <TableCell>
                      {item.lowStock ? (
                        <Badge variant="destructive">Yes</Badge>
                      ) : (
                        <Badge variant="outline">No</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
