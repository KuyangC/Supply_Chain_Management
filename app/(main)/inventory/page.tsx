"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, AlertCircle, Calendar, RefreshCw, Plus, Package } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useInventory } from "@/hooks/use-api-data";
import { TableLoading, TableError, TableEmpty } from "@/components/shared/table-states";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

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

  // Receive modal state
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [receiveFormData, setReceiveFormData] = useState({
    productId: "",
    productName: "",
    locationId: "",
    locationName: "",
    batch: "",
    quantity: 1,
    supplierId: "",
    supplierName: "",
    notes: "",
  });
  const [receiveFormErrors, setReceiveFormErrors] = useState<Partial<Record<keyof typeof receiveFormData, string>>>({});

  const { data: inventory = [], isLoading, error, refetch } = useInventory();

  // Mock product options for receive modal
  const MOCK_PRODUCTS = [
    { id: "prod-1", name: "Wireless Mouse", sku: "WM-001" },
    { id: "prod-2", name: "USB-C Cable", sku: "USB-002" },
    { id: "prod-3", name: "Keyboard", sku: "KB-003" },
    { id: "prod-4", name: "Monitor Stand", sku: "MS-004" },
    { id: "prod-5", name: "Laptop Sleeve", sku: "LS-005" },
    { id: "prod-6", name: "Webcam HD", sku: "WC-006" },
  ];

  // Mock location options for receive modal
  const MOCK_LOCATIONS = [
    { id: "loc-1", name: "Warehouse 1" },
    { id: "loc-2", name: "Store A" },
    { id: "loc-3", name: "Store B" },
    { id: "loc-4", name: "Warehouse 2" },
  ];

  // Mock supplier options for receive modal
  const MOCK_SUPPLIERS = [
    { id: "sup-1", name: "Acme Corporation" },
    { id: "sup-2", name: "Global Parts Distributors" },
    { id: "sup-3", name: "TechSupply Co." },
  ];

  /**
   * Reset receive form to empty state
   */
  function resetReceiveForm() {
    setReceiveFormData({
      productId: "",
      productName: "",
      locationId: "",
      locationName: "",
      batch: "",
      quantity: 1,
      supplierId: "",
      supplierName: "",
      notes: "",
    });
    setReceiveFormErrors({});
  }

  /**
   * Handle input change for receive form
   */
  function handleReceiveInputChange(field: keyof typeof receiveFormData, value: string | number) {
    setReceiveFormData((prev) => ({ ...prev, [field]: value }));
    if (receiveFormErrors[field]) {
      setReceiveFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  /**
   * Validate receive form
   */
  function validateReceiveForm(): boolean {
    const errors: Partial<Record<keyof typeof receiveFormData, string>> = {};

    if (!receiveFormData.productId) errors.productId = "Product is required";
    if (!receiveFormData.locationId) errors.locationId = "Location is required";
    if (receiveFormData.quantity <= 0) errors.quantity = "Quantity must be greater than 0";

    setReceiveFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  /**
   * Handle receive inventory (mock)
   */
  function handleReceive(e: React.FormEvent) {
    e.preventDefault();
    if (!validateReceiveForm()) return;

    toast({
      title: "Stock received",
      description: `Successfully received ${receiveFormData.quantity} units of ${receiveFormData.productName} at ${receiveFormData.locationName}.`,
    });

    setIsReceiveModalOpen(false);
    resetReceiveForm();
  }

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
            onClick={() => {
              resetReceiveForm();
              setIsReceiveModalOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Receive Stock
          </Button>
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

      {/* Receive Stock Modal */}
      <Dialog open={isReceiveModalOpen} onOpenChange={setIsReceiveModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Receive Stock</DialogTitle>
            <DialogDescription>
              Record incoming stock into inventory.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleReceive}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="receive-product">Product *</Label>
                <Select
                  value={receiveFormData.productId}
                  onValueChange={(v) => {
                    handleReceiveInputChange("productId", v);
                    const product = MOCK_PRODUCTS.find((p) => p.id === v);
                    if (product) handleReceiveInputChange("productName", product.name);
                  }}
                >
                  <SelectTrigger id="receive-product" className={receiveFormErrors.productId ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_PRODUCTS.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} ({product.sku})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {receiveFormErrors.productId && <p className="text-xs text-red-500">{receiveFormErrors.productId}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="receive-location">Location *</Label>
                  <Select
                    value={receiveFormData.locationId}
                    onValueChange={(v) => {
                      handleReceiveInputChange("locationId", v);
                      const location = MOCK_LOCATIONS.find((l) => l.id === v);
                      if (location) handleReceiveInputChange("locationName", location.name);
                    }}
                  >
                    <SelectTrigger id="receive-location" className={receiveFormErrors.locationId ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_LOCATIONS.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {receiveFormErrors.locationId && <p className="text-xs text-red-500">{receiveFormErrors.locationId}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receive-quantity">Quantity *</Label>
                  <Input
                    id="receive-quantity"
                    type="number"
                    min="1"
                    value={receiveFormData.quantity}
                    onChange={(e) => handleReceiveInputChange("quantity", parseInt(e.target.value) || 0)}
                    className={receiveFormErrors.quantity ? "border-red-500" : ""}
                  />
                  {receiveFormErrors.quantity && <p className="text-xs text-red-500">{receiveFormErrors.quantity}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="receive-batch">Batch Number</Label>
                  <Input
                    id="receive-batch"
                    value={receiveFormData.batch}
                    onChange={(e) => handleReceiveInputChange("batch", e.target.value)}
                    placeholder="e.g. BATCH-2024-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receive-supplier">Supplier (Optional)</Label>
                  <Select
                    value={receiveFormData.supplierId}
                    onValueChange={(v) => {
                      handleReceiveInputChange("supplierId", v);
                      const supplier = MOCK_SUPPLIERS.find((s) => s.id === v);
                      if (supplier) handleReceiveInputChange("supplierName", supplier.name);
                    }}
                  >
                    <SelectTrigger id="receive-supplier">
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_SUPPLIERS.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="receive-notes">Notes</Label>
                <Input
                  id="receive-notes"
                  value={receiveFormData.notes}
                  onChange={(e) => handleReceiveInputChange("notes", e.target.value)}
                  placeholder="Optional notes about this receipt"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsReceiveModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Receive Stock</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
