"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Eye, MoreVertical, RefreshCw, Package, CheckCircle, XCircle } from "lucide-react";
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
import { RETURN_STATUS_CONFIG } from "@/lib/constants";
import { MOCK_RETURNS } from "@/lib/api";
import type { ProductReturn } from "@/lib/api";

/**
 * Return form interface
 */
interface ReturnForm {
  productId: string;
  productName: string;
  quantity: number;
  reason: string;
  supplierId: string;
  supplierName: string;
  notes: string;
}

const emptyForm: ReturnForm = {
  productId: "",
  productName: "",
  quantity: 1,
  reason: "",
  supplierId: "",
  supplierName: "",
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

// Mock supplier options
const MOCK_SUPPLIERS = [
  { id: "sup-1", name: "Acme Corporation" },
  { id: "sup-2", name: "Global Parts Distributors" },
  { id: "sup-3", name: "TechSupply Co." },
  { id: "sup-4", name: "Pacific Logistics" },
  { id: "sup-5", name: "Midwest Materials Inc" },
];

// Return reason options
const RETURN_REASONS = [
  { value: "damaged", label: "Damaged Product" },
  { value: "defective", label: "Defective / Quality Issue" },
  { value: "wrong_item", label: "Wrong Item Shipped" },
  { value: "expired", label: "Expired Product" },
  { value: "customer_dissatisfaction", label: "Customer Dissatisfaction" },
  { value: "overstock", label: "Overstock" },
  { value: "other", label: "Other" },
];

/**
 * Product Returns Page
 *
 * Displays all product returns with history and create return functionality
 */
export default function ReturnsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Dialog states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState<ProductReturn | null>(null);
  const [formData, setFormData] = useState<ReturnForm>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ReturnForm, string>>>({});

  // Mock state for returns (with create/update/delete simulation)
  const [returns, setReturns] = useState<ProductReturn[]>(MOCK_RETURNS);
  const [isLoading, setIsLoading] = useState(false);

  // Filter returns based on search and status
  const filteredReturns = returns.filter((itemReturn) => {
    const productName = itemReturn.product?.name || "";
    const productSku = itemReturn.product?.sku || "";
    const supplierName = itemReturn.supplier?.name || "";
    const reason = itemReturn.reason.toLowerCase();

    const matchesSearch =
      !searchQuery ||
      productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      productSku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reason.includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      itemReturn.status.toLowerCase() === statusFilter.toLowerCase();

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
   * Open view dialog with return data
   */
  function openViewDialog(itemReturn: ProductReturn) {
    setSelectedReturn(itemReturn);
    setIsViewDialogOpen(true);
  }

  /**
   * Open approve confirmation dialog
   */
  function openApproveDialog(itemReturn: ProductReturn) {
    setSelectedReturn(itemReturn);
    setIsApproveDialogOpen(true);
  }

  /**
   * Open reject confirmation dialog
   */
  function openRejectDialog(itemReturn: ProductReturn) {
    setSelectedReturn(itemReturn);
    setIsRejectDialogOpen(true);
  }

  /**
   * Validate form
   */
  function validateForm(): boolean {
    const errors: Partial<Record<keyof ReturnForm, string>> = {};

    if (!formData.productId) errors.productId = "Product is required";
    if (formData.quantity <= 0) errors.quantity = "Quantity must be greater than 0";
    if (!formData.reason) errors.reason = "Reason is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  /**
   * Handle create return (mock)
   */
  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    const selectedProduct = MOCK_PRODUCTS.find((p) => p.id === formData.productId);
    const selectedSupplier = MOCK_SUPPLIERS.find((s) => s.id === formData.supplierId);

    const newReturn: ProductReturn = {
      id: `ret-${Date.now()}`,
      productId: formData.productId,
      quantity: formData.quantity,
      reason: formData.reason,
      status: "PENDING",
      supplierId: formData.supplierId || undefined,
      notes: formData.notes || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      product: selectedProduct ? { id: selectedProduct.id, name: selectedProduct.name, sku: selectedProduct.sku } : undefined,
      supplier: selectedSupplier ? { id: selectedSupplier.id, name: selectedSupplier.name } : undefined,
    };

    setReturns([newReturn, ...returns]);
    toast({
      title: "Return created",
      description: "Product return has been created and is pending approval.",
    });
    setIsCreateModalOpen(false);
    resetForm();
  }

  /**
   * Handle approve return (mock)
   */
  function handleApprove() {
    if (!selectedReturn) return;

    const updatedReturns = returns.map((r) =>
      r.id === selectedReturn.id
        ? {
            ...r,
            status: "APPROVED" as const,
            updatedAt: new Date().toISOString(),
          }
        : r
    );

    setReturns(updatedReturns);
    toast({
      title: "Return approved",
      description: "Product return has been approved.",
    });
    setIsApproveDialogOpen(false);
    setSelectedReturn(null);
  }

  /**
   * Handle complete return (mock)
   */
  function handleComplete(returnId: string) {
    const updatedReturns = returns.map((r) =>
      r.id === returnId
        ? {
            ...r,
            status: "COMPLETED" as const,
            updatedAt: new Date().toISOString(),
          }
        : r
    );

    setReturns(updatedReturns);
    toast({
      title: "Return completed",
      description: "Product return has been completed successfully.",
    });
  }

  /**
   * Handle reject return (mock)
   */
  function handleReject() {
    if (!selectedReturn) return;

    const updatedReturns = returns.map((r) =>
      r.id === selectedReturn.id
        ? {
            ...r,
            status: "REJECTED" as const,
            updatedAt: new Date().toISOString(),
          }
        : r
    );

    setReturns(updatedReturns);
    toast({
      title: "Return rejected",
      description: "Product return has been rejected.",
      variant: "destructive",
    });
    setIsRejectDialogOpen(false);
    setSelectedReturn(null);
  }

  /**
   * Handle input change
   */
  function handleInputChange(field: keyof ReturnForm, value: string | number) {
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
          <h1 className="text-2xl font-semibold text-gray-900">Product Returns</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage product returns and refunds
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
            New Return
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search returns..."
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
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Returns Table */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent bg-gray-50/50">
              <TableHead className="text-gray-500 font-medium">Product</TableHead>
              <TableHead className="text-gray-500 font-medium">Supplier</TableHead>
              <TableHead className="text-gray-500 font-medium">Quantity</TableHead>
              <TableHead className="text-gray-500 font-medium">Reason</TableHead>
              <TableHead className="text-gray-500 font-medium">Status</TableHead>
              <TableHead className="text-gray-500 font-medium">Date</TableHead>
              <TableHead className="text-gray-500 font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableLoading colSpan={7} />
            ) : filteredReturns.length === 0 ? (
              <TableEmpty
                colSpan={7}
                message={returns.length === 0 ? "No returns found. Create your first return to get started." : "No returns match your filters."}
              />
            ) : (
              filteredReturns.map((itemReturn) => (
                <TableRow key={itemReturn.id} className="hover:bg-gray-50/50 border-b border-gray-50">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{itemReturn.product?.name}</span>
                      <span className="text-xs text-gray-500">{itemReturn.product?.sku}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">{itemReturn.supplier?.name || "-"}</TableCell>
                  <TableCell className="text-gray-700">{itemReturn.quantity}</TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600 capitalize">
                      {itemReturn.reason.replace(/_/g, " ")}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={itemReturn.status} type="return" />
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {new Date(itemReturn.createdAt).toLocaleDateString("en-US", {
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
                        <DropdownMenuItem onClick={() => openViewDialog(itemReturn)}>
                          <Eye className="mr-2 h-4 w-4 text-gray-400" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                        {itemReturn.status === "PENDING" && (
                          <>
                            <DropdownMenuItem onClick={() => openApproveDialog(itemReturn)}>
                              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                              <span>Approve</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openRejectDialog(itemReturn)}>
                              <XCircle className="mr-2 h-4 w-4 text-red-500" />
                              <span>Reject</span>
                            </DropdownMenuItem>
                          </>
                        )}
                        {itemReturn.status === "APPROVED" && (
                          <DropdownMenuItem onClick={() => handleComplete(itemReturn.id)}>
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

      {/* Create Return Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Product Return</DialogTitle>
            <DialogDescription>
              Create a new product return request.
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
                  <Label htmlFor="create-supplier">Supplier (Optional)</Label>
                  <Select
                    value={formData.supplierId}
                    onValueChange={(v) => {
                      handleInputChange("supplierId", v);
                      const supplier = MOCK_SUPPLIERS.find((s) => s.id === v);
                      if (supplier) handleInputChange("supplierName", supplier.name);
                    }}
                  >
                    <SelectTrigger id="create-supplier">
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
                <Label htmlFor="create-reason">Reason *</Label>
                <Select value={formData.reason} onValueChange={(v) => handleInputChange("reason", v)}>
                  <SelectTrigger id="create-reason" className={formErrors.reason ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {RETURN_REASONS.map((reason) => (
                      <SelectItem key={reason.value} value={reason.value}>
                        {reason.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.reason && <p className="text-xs text-red-500">{formErrors.reason}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-notes">Notes</Label>
                <Input
                  id="create-notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Additional notes about this return"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Return</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Return Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Return Details</DialogTitle>
            <DialogDescription>
              Detailed information about the product return.
            </DialogDescription>
          </DialogHeader>
          {selectedReturn && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{selectedReturn.product?.name}</p>
                    <p className="text-xs text-gray-500">{selectedReturn.product?.sku}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Quantity</p>
                  <p className="text-2xl font-bold text-[#3b82f6]">{selectedReturn.quantity}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Supplier</p>
                <p className="text-base text-gray-900">{selectedReturn.supplier?.name || "Not specified"}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Reason</p>
                <span className="inline-block px-2.5 py-0.5 text-sm bg-gray-100 text-gray-700 rounded-full capitalize">
                  {selectedReturn.reason.replace(/_/g, " ")}
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Status</p>
                <StatusBadge status={selectedReturn.status} type="return" />
              </div>

              {selectedReturn.notes && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Notes</p>
                  <p className="text-sm text-gray-700">{selectedReturn.notes}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Created Date</p>
                  <p className="text-xs text-gray-700">
                    {new Date(selectedReturn.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Last Updated</p>
                  <p className="text-xs text-gray-700">
                    {new Date(selectedReturn.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
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
            <AlertDialogTitle>Approve Return</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this return of <span className="font-semibold">{selectedReturn?.quantity} units</span> of{" "}
              <span className="font-semibold">{selectedReturn?.product?.name}</span>?
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

      {/* Reject Confirmation Dialog */}
      <AlertDialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Return</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this return of <span className="font-semibold">{selectedReturn?.quantity} units</span> of{" "}
              <span className="font-semibold">{selectedReturn?.product?.name}</span>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              className="bg-red-500 hover:bg-red-600"
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
