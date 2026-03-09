"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, AlertCircle, Calendar, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useInventory } from "@/hooks/use-api-data";
import { TableLoading, TableError, TableEmpty } from "@/components/shared/table-states";
import { useState } from "react";

/**
 * Stock status indicator with colored dot
 */
function StockStatusDot({ status }: { status: "sufficient" | "low" | "critical" }) {
  const colors = {
    sufficient: "bg-[#10b981]",
    low: "bg-[#ef4444]",
    critical: "bg-[#f97316]",
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`h-2 w-2 rounded-full ${colors[status]}`} />
      <span className="text-sm text-gray-700">{status}</span>
    </div>
  );
}

/**
 * Expiry warning component
 */
function ExpiryWarning({ expiryDate, isExpiring }: { expiryDate: string | null; isExpiring: boolean }) {
  if (!expiryDate) {
    return <span className="text-gray-400">-</span>;
  }

  if (isExpiring) {
    return (
      <div className="flex items-center gap-1.5">
        <Calendar className="h-4 w-4 text-[#ef4444]" />
        <span className="text-sm font-medium text-[#ef4444]">{expiryDate}</span>
      </div>
    );
  }

  return <span className="text-sm text-gray-600">{expiryDate}</span>;
}

/**
 * Inventory Page
 *
 * Overview of inventory across all locations
 * Updated to match Figma design
 */
export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");

  const { data: inventory = [], isLoading, error, refetch } = useInventory();

  // Filter inventory based on search and location
  const filteredInventory = inventory.filter((item) => {
    const productName = item.product?.name || "";
    const productSku = item.product?.sku || "";
    const locationName = item.location?.name || "";
    const batch = item.batch || "";

    const matchesSearch =
      !searchQuery ||
      productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      productSku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation =
      locationFilter === "all" ||
      locationName.toLowerCase().includes(locationFilter.toLowerCase());

    return matchesSearch && matchesLocation;
  });

  const getStockStatus = (available: number): "sufficient" | "low" | "critical" => {
    if (available === 0) return "critical";
    if (available < 10) return "low";
    return "sufficient";
  };

  const isExpiring = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor and manage stock across all locations
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg"
          >
            Adjust Stock
          </Button>
          <Button
            variant="outline"
            className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button className="bg-[#3b82f6] text-white hover:bg-[#2563eb] rounded-lg">
            Transfer Stock
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search products, shipments, users..."
            className="h-10 bg-white border-gray-200 pl-9 text-gray-900 placeholder:text-gray-400 focus-visible:ring-[#3b82f6]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[160px] h-10 bg-white border-gray-200">
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="wh-001">Warehouse 1</SelectItem>
            <SelectItem value="wh-002">Warehouse 2</SelectItem>
            <SelectItem value="store-a">Store A</SelectItem>
            <SelectItem value="store-b">Store B</SelectItem>
          </SelectContent>
        </Select>
        <Badge variant="outline" className="gap-1.5 px-3 py-1.5 bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100 cursor-pointer">
          <AlertCircle className="h-3.5 w-3.5" />
          Low Stock
        </Badge>
        <Badge variant="outline" className="gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 cursor-pointer">
          <Calendar className="h-3.5 w-3.5" />
          Expiring
        </Badge>
      </div>

      {/* Inventory Table */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent bg-gray-50/50">
              <TableHead className="text-gray-500 font-medium">Product</TableHead>
              <TableHead className="text-gray-500 font-medium">SKU</TableHead>
              <TableHead className="text-gray-500 font-medium">Location</TableHead>
              <TableHead className="text-gray-500 font-medium">Batch</TableHead>
              <TableHead className="text-gray-500 font-medium">Qty</TableHead>
              <TableHead className="text-gray-500 font-medium">Available</TableHead>
              <TableHead className="text-gray-500 font-medium">Reserved</TableHead>
              <TableHead className="text-gray-500 font-medium">Expiry</TableHead>
              <TableHead className="text-gray-500 font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableLoading colSpan={9} />
            ) : error ? (
              <TableError
                colSpan={9}
                message={error instanceof Error ? error.message : "Failed to load inventory"}
                onRetry={() => refetch()}
              />
            ) : filteredInventory.length === 0 ? (
              <TableEmpty
                colSpan={9}
                message={inventory.length === 0 ? "No inventory items found." : "No inventory items match your filters."}
              />
            ) : (
              filteredInventory.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50/50 border-b border-gray-50">
                  <TableCell className="font-medium text-gray-900">
                    <Link
                      href={`/products/${item.productId}`}
                      className="hover:text-[#3b82f6] hover:underline transition-colors"
                    >
                      {item.product?.name || "Unknown"}
                    </Link>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-gray-600">
                    {item.product?.sku || "-"}
                  </TableCell>
                  <TableCell className="text-gray-600">{item.location?.name || "-"}</TableCell>
                  <TableCell className="font-mono text-sm text-gray-600">
                    {item.batch || "-"}
                  </TableCell>
                  <TableCell className="text-gray-700">{item.qty}</TableCell>
                  <TableCell>
                    <StockStatusDot status={getStockStatus(item.available)} />
                    <span className="ml-2 text-sm text-gray-600">{item.available}</span>
                  </TableCell>
                  <TableCell className="text-gray-600">{item.reserved}</TableCell>
                  <TableCell>
                    <ExpiryWarning expiryDate={item.expiry || null} isExpiring={isExpiring(item.expiry || null)} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      >
                        Adjust
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-[#3b82f6] hover:text-[#2563eb] hover:bg-blue-50"
                      >
                        Transfer
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
