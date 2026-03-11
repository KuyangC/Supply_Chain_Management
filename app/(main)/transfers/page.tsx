"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Eye, MoreVertical, RefreshCw, ArrowRight, CheckCircle, XCircle } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { TableLoading, TableError, TableEmpty } from "@/components/shared/table-states";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { TRANSFER_STATUS_CONFIG } from "@/lib/constants";
import { MOCK_TRANSFERS } from "@/lib/api";
import type { StockTransfer } from "@/lib/api";

/**
 * Transfer form interface
 */
interface TransferForm {
  productId: string;
  productName: string;
  fromLocationId: string;
  toLocationId: string;
  quantity: number;
  notes: string;
}

const emptyForm: TransferForm = {
  productId: "",
  productName: "",
  fromLocationId: "",
  toLocationId: "",
  quantity: 1,
  notes: "",
};

// Mock product options
const MOCK_PRODUCTS = [
  { id: "prod-1", name: "Wireless Mouse", sku: "WM-001" },
  { id: "prod-2", name: "USB-C Cable", sku: "USB-002" },
  { id: "prod-3", name: "Keyboard", sku: "KB-003" },
  { id: "prod-4", name: "Monitor Stand", sku: "MS-004" },
  { id: "prod-5", name: "Laptop Sleeve", sku: "LS-005" },
  { id: "prod-6", name: "Webcam HD", sku: "WC-006" },
  { id: "prod-7", name: "Headphones", sku: "HP-007" },
  { id: "prod-8", name: "Mouse Pad", sku: "MP-008" },
];

// Mock location options
const MOCK_LOCATIONS = [
  { id: "loc-1", name: "Warehouse 1" },
  { id: "loc-2", name: "Store A" },
  { id: "loc-3", name: "Store B" },
  { id: "loc-4", name: "Warehouse 2" },
];

/**
 * Stock Transfers Page
 *
 * Displays all stock transfers with history and create transfer functionality
 */
export default function TransfersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Dialog states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<StockTransfer | null>(null);
  const [formData, setFormData] = useState<TransferForm>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof TransferForm, string>>>({});

  // Mock state for transfers (with create/update/delete simulation)
  const [transfers, setTransfers] = useState<StockTransfer[]>(MOCK_TRANSFERS);
  const [isLoading, setIsLoading] = useState(false);

  // Filter transfers based on search and status
  const filteredTransfers = transfers.filter((transfer) => {
    const productName = transfer.product?.name || "";
    const productSku = transfer.product?.sku || "";
    const fromLocation = transfer.fromLocation?.name || "";
    const toLocation = transfer.toLocation?.name || "";

    const matchesSearch =
      !searchQuery ||
      productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      productSku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fromLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      toLocation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      transfer.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  /**
   * Reset form to empty state
   */
  function resetForm() {
    setFormData(emptyForm);
    setFormErrors({});
  }

  /**
   * Open view dialog with transfer data
   */
  function openViewDialog(transfer: StockTransfer) {
    setSelectedTransfer(transfer);
    setIsViewDialogOpen(true);
  }

  /**
   * Open approve confirmation dialog
   */
  function openApproveDialog(transfer: StockTransfer) {
    setSelectedTransfer(transfer);
    setIsApproveDialogOpen(true);
  }

  /**
   * Open cancel confirmation dialog
   */
  function openCancelDialog(transfer: StockTransfer) {
    setSelectedTransfer(transfer);
    setIsCancelDialogOpen(true);
  }

  /**
   * Validate form
   */
  function validateForm(): boolean {
    const errors: Partial<Record<keyof TransferForm, string>> = {};

    if (!formData.productId) errors.productId = "Product is required";
    if (!formData.fromLocationId) errors.fromLocationId = "Source location is required";
    if (!formData.toLocationId) errors.toLocationId = "Destination location is required";
    if (formData.fromLocationId === formData.toLocationId) errors.toLocationId = "Source and destination cannot be the same";
    if (formData.quantity <= 0) errors.quantity = "Quantity must be greater than 0";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  /**
   * Handle create transfer (mock)
   */
  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    const selectedProduct = MOCK_PRODUCTS.find((p) => p.id === formData.productId);
    const fromLocation = MOCK_LOCATIONS.find((l) => l.id === formData.fromLocationId);
    const toLocation = MOCK_LOCATIONS.find((l) => l.id === formData.toLocationId);

    const newTransfer: StockTransfer = {
      id: `trf-${Date.now()}`,
      productId: formData.productId,
      fromLocationId: formData.fromLocationId,
      toLocationId: formData.toLocationId,
      quantity: formData.quantity,
      status: "PENDING",
      notes: formData.notes || undefined,
      requestedBy: "user-1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      product: selectedProduct ? { id: selectedProduct.id, name: selectedProduct.name, sku: selectedProduct.sku } : undefined,
      fromLocation: fromLocation ? { id: fromLocation.id, name: fromLocation.name } : undefined,
      toLocation: toLocation ? { id: toLocation.id, name: toLocation.name } : undefined,
    };

    setTransfers([newTransfer, ...transfers]);
    toast({
      title: "Transfer requested",
      description: "Stock transfer has been requested and is pending approval.",
    });
    setIsCreateModalOpen(false);
    resetForm();
  }

  /**
   * Handle approve transfer (mock)
   */
  function handleApprove() {
    if (!selectedTransfer) return;

    const updatedTransfers = transfers.map((t) =>
      t.id === selectedTransfer.id
        ? {
            ...t,
            status: "IN_TRANSIT" as const,
            approvedBy: "user-1",
            updatedAt: new Date().toISOString(),
          }
        : t
    );

    setTransfers(updatedTransfers);
    toast({
      title: "Transfer approved",
      description: "Stock transfer has been approved and is now in transit.",
    });
    setIsApproveDialogOpen(false);
    setSelectedTransfer(null);
  }

  /**
   * Handle complete transfer (mock)
   */
  function handleComplete(transferId: string) {
    const updatedTransfers = transfers.map((t) =>
      t.id === transferId
        ? {
            ...t,
            status: "COMPLETED" as const,
            updatedAt: new Date().toISOString(),
          }
        : t
    );

    setTransfers(updatedTransfers);
    toast({
      title: "Transfer completed",
      description: "Stock transfer has been completed successfully.",
    });
  }

  /**
   * Handle cancel transfer (mock)
   */
  function handleCancel() {
    if (!selectedTransfer) return;

    const updatedTransfers = transfers.map((t) =>
      t.id === selectedTransfer.id
        ? {
            ...t,
            status: "CANCELLED" as const,
            updatedAt: new Date().toISOString(),
          }
        : t
    );

    setTransfers(updatedTransfers);
    toast({
      title: "Transfer cancelled",
      description: "Stock transfer has been cancelled.",
    });
    setIsCancelDialogOpen(false);
    setSelectedTransfer(null);
  }

  /**
   * Handle input change
   */
  function handleInputChange(field: keyof TransferForm, value: string | number) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Stock Transfers</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage stock transfers between locations
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg"
            onClick={() => setIsLoading(!isLoading)}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            className="bg-[#3b82f6] text-white hover:bg-[#2563eb] rounded-lg px-4"
            onClick={() => {
              resetForm();
              setIsCreateModalOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Transfer
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search transfers..."
            className="h-10 bg-white border-gray-200 pl-9 text-gray-900 placeholder:text-gray-400 focus-visible:ring-[#3b82f6]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px] h-10 bg-white border-gray-200">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_transit">In Transit</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Transfers Table */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent bg-gray-50/50">
              <TableHead className="text-gray-500 font-medium">Product</TableHead>
              <TableHead className="text-gray-500 font-medium">From</TableHead>
              <TableHead className="text-gray-500 font-medium">To</TableHead>
              <TableHead className="text-gray-500 font-medium">Quantity</TableHead>
              <TableHead className="text-gray-500 font-medium">Status</TableHead>
              <TableHead className="text-gray-500 font-medium">Date</TableHead>
              <TableHead className="text-gray-500 font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableLoading colSpan={7} />
            ) : filteredTransfers.length === 0 ? (
              <TableEmpty
                colSpan={7}
                message={transfers.length === 0 ? "No transfers found. Create your first transfer to get started." : "No transfers match your filters."}
              />
            ) : (
              filteredTransfers.map((transfer) => (
                <TableRow key={transfer.id} className="hover:bg-gray-50/50 border-b border-gray-50">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{transfer.product?.name}</span>
                      <span className="text-xs text-gray-500">{transfer.product?.sku}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">{transfer.fromLocation?.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{transfer.toLocation?.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700">{transfer.quantity}</TableCell>
                  <TableCell>
                    <StatusBadge status={transfer.status} type="transfer" />
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {new Date(transfer.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                        >
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openViewDialog(transfer)}>
                          <Eye className="mr-2 h-4 w-4 text-gray-400" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                        {transfer.status === "PENDING" && (
                          <>
                            <DropdownMenuItem onClick={() => openApproveDialog(transfer)}>
                              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                              <span>Approve</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openCancelDialog(transfer)}>
                              <XCircle className="mr-2 h-4 w-4 text-red-500" />
                              <span>Cancel</span>
                            </DropdownMenuItem>
                          </>
                        )}
                        {transfer.status === "IN_TRANSIT" && (
                          <DropdownMenuItem onClick={() => handleComplete(transfer.id)}>
                            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                            <span>Mark Complete</span>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Transfer Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Stock Transfer</DialogTitle>
            <DialogDescription>
              Request a stock transfer between locations.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="create-product">Product *</Label>
                <Select
                  value={formData.productId}
                  onValueChange={(v) => {
                    handleInputChange("productId", v);
                    const product = MOCK_PRODUCTS.find((p) => p.id === v);
                    if (product) handleInputChange("productName", product.name);
                  }}
                >
                  <SelectTrigger id="create-product" className={formErrors.productId ? "border-red-500" : ""}>
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
                {formErrors.productId && <p className="text-xs text-red-500">{formErrors.productId}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="create-fromLocation">From Location *</Label>
                  <Select value={formData.fromLocationId} onValueChange={(v) => handleInputChange("fromLocationId", v)}>
                    <SelectTrigger id="create-fromLocation" className={formErrors.fromLocationId ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_LOCATIONS.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.fromLocationId && <p className="text-xs text-red-500">{formErrors.fromLocationId}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-toLocation">To Location *</Label>
                  <Select value={formData.toLocationId} onValueChange={(v) => handleInputChange("toLocationId", v)}>
                    <SelectTrigger id="create-toLocation" className={formErrors.toLocationId ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_LOCATIONS.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.toLocationId && <p className="text-xs text-red-500">{formErrors.toLocationId}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-quantity">Quantity *</Label>
                <Input
                  id="create-quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange("quantity", parseInt(e.target.value) || 0)}
                  className={formErrors.quantity ? "border-red-500" : ""}
                />
                {formErrors.quantity && <p className="text-xs text-red-500">{formErrors.quantity}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-notes">Notes</Label>
                <Input
                  id="create-notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Optional notes for this transfer"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Transfer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Transfer Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Transfer Details</DialogTitle>
            <DialogDescription>
              Detailed information about the stock transfer.
            </DialogDescription>
          </DialogHeader>
          {selectedTransfer && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">Product</p>
                  <p className="font-semibold text-gray-900">{selectedTransfer.product?.name}</p>
                  <p className="text-xs text-gray-500">{selectedTransfer.product?.sku}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Quantity</p>
                  <p className="text-2xl font-bold text-[#3b82f6]">{selectedTransfer.quantity}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">From</p>
                  <p className="font-medium text-gray-900">{selectedTransfer.fromLocation?.name}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 mx-2" />
                <div className="flex-1 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-600 mb-1">To</p>
                  <p className="font-medium text-blue-900">{selectedTransfer.toLocation?.name}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Status</p>
                <StatusBadge status={selectedTransfer.status} type="transfer" />
              </div>

              {selectedTransfer.notes && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Notes</p>
                  <p className="text-sm text-gray-700">{selectedTransfer.notes}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Requested Date</p>
                  <p className="text-xs text-gray-700">
                    {new Date(selectedTransfer.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Last Updated</p>
                  <p className="text-xs text-gray-700">
                    {new Date(selectedTransfer.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Confirmation Dialog */}
      <AlertDialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Transfer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this transfer of <span className="font-semibold">{selectedTransfer?.quantity} units</span> of{" "}
              <span className="font-semibold">{selectedTransfer?.product?.name}</span> from{" "}
              <span className="font-semibold">{selectedTransfer?.fromLocation?.name}</span> to{" "}
              <span className="font-semibold">{selectedTransfer?.toLocation?.name}</span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApprove}
              className="bg-green-500 hover:bg-green-600"
            >
              Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Transfer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this transfer? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Transfer</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              className="bg-red-500 hover:bg-red-600"
            >
              Cancel Transfer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
