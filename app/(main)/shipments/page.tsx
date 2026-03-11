"use client";

import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, RefreshCw, Trash2, MoreVertical, Pencil } from "lucide-react";
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
import { useShipments, useLocations, useCreateShipment, useUpdateShipment, useDeleteShipment, useProducts } from "@/hooks/use-api-data";
import { TableLoading, TableError, TableEmpty } from "@/components/shared/table-states";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { SHIPMENT_STATUS_CONFIG } from "@/lib/constants";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Shipment, ShipmentStatus } from "@/lib/api";

/**
 * Shipment form interface
 */
interface ShipmentForm {
  trackingId: string;
  fromLocationId: string;
  toLocationId: string;
  status: ShipmentStatus;
  notes: string;
}

const emptyForm: ShipmentForm = {
  trackingId: "",
  fromLocationId: "",
  toLocationId: "",
  status: "PENDING",
  notes: "",
};

/**
 * Shipments List Page
 *
 * Displays all shipments with filtering, add/edit modals, and delete functionality
 */
export default function ShipmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Dialog states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [formData, setFormData] = useState<ShipmentForm>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ShipmentForm, string>>>({});

  const { data: shipments = [], isLoading, error, refetch } = useShipments();
  const { data: locations = [] } = useLocations();
  const { data: products = [] } = useProducts();

  // Mutations
  const createMutation = useCreateShipment({
    onSuccess: () => {
      toast({
        title: "Shipment created",
        description: "Shipment has been created successfully.",
      });
      setIsAddModalOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create shipment.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useUpdateShipment({
    onSuccess: () => {
      toast({
        title: "Shipment updated",
        description: "Shipment has been updated successfully.",
      });
      setIsEditModalOpen(false);
      setSelectedShipment(null);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update shipment.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useDeleteShipment({
    onSuccess: () => {
      toast({
        title: "Shipment deleted",
        description: "Shipment has been deleted successfully.",
      });
      setIsDeleteDialogOpen(false);
      setSelectedShipment(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete shipment.",
        variant: "destructive",
      });
    },
  });

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

  /**
   * Reset form to empty state
   */
  function resetForm() {
    setFormData(emptyForm);
    setFormErrors({});
  }

  /**
   * Generate tracking ID
   */
  function generateTrackingId(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `TXF-${timestamp}-${random}`;
  }

  /**
   * Open edit modal with shipment data
   */
  function openEditModal(shipment: Shipment) {
    setSelectedShipment(shipment);
    setFormData({
      trackingId: shipment.trackingId,
      fromLocationId: shipment.fromLocationId,
      toLocationId: shipment.toLocationId,
      status: shipment.status,
      notes: shipment.notes || "",
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  }

  /**
   * Open delete confirmation dialog
   */
  function openDeleteDialog(shipment: Shipment) {
    setSelectedShipment(shipment);
    setIsDeleteDialogOpen(true);
  }

  /**
   * Validate form
   */
  function validateForm(): boolean {
    const errors: Partial<Record<keyof ShipmentForm, string>> = {};

    if (!formData.trackingId.trim()) errors.trackingId = "Tracking ID is required";
    if (!formData.fromLocationId) errors.fromLocationId = "From location is required";
    if (!formData.toLocationId) errors.toLocationId = "To location is required";
    if (formData.fromLocationId === formData.toLocationId) {
      errors.toLocationId = "From and To locations cannot be the same";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  /**
   * Handle create shipment
   */
  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    createMutation.mutate(formData);
  }

  /**
   * Handle update shipment
   */
  function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedShipment || !validateForm()) return;

    updateMutation.mutate({
      id: selectedShipment.id,
      data: formData,
    });
  }

  /**
   * Handle delete shipment
   */
  function handleDelete() {
    if (!selectedShipment) return;
    deleteMutation.mutate(selectedShipment.id);
  }

  /**
   * Handle input change
   */
  function handleInputChange(field: keyof ShipmentForm, value: string) {
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
          <Button
            onClick={() => {
              resetForm();
              setFormData((prev) => ({ ...prev, trackingId: generateTrackingId() }));
              setIsAddModalOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Shipment
          </Button>
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/shipments/${shipment.id}`}
                            className="flex items-center cursor-pointer"
                          >
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/shipments/${shipment.id}/track`}
                            className="flex items-center cursor-pointer"
                          >
                            Track Shipment
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditModal(shipment)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-500 focus:text-red-500"
                          onClick={() => openDeleteDialog(shipment)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Shipment Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Shipment</DialogTitle>
            <DialogDescription>
              Create a new shipment to track products between locations.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="add-trackingId">Tracking ID *</Label>
                <div className="flex gap-2">
                  <Input
                    id="add-trackingId"
                    value={formData.trackingId}
                    onChange={(e) => handleInputChange("trackingId", e.target.value)}
                    placeholder="e.g. TXF-001"
                    className={formErrors.trackingId ? "border-red-500" : ""}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFormData((prev) => ({ ...prev, trackingId: generateTrackingId() }))}
                  >
                    Generate
                  </Button>
                </div>
                {formErrors.trackingId && <p className="text-xs text-red-500">{formErrors.trackingId}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="add-fromLocation">From Location *</Label>
                  <Select
                    value={formData.fromLocationId}
                    onValueChange={(v) => handleInputChange("fromLocationId", v)}
                  >
                    <SelectTrigger id="add-fromLocation" className={formErrors.fromLocationId ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.fromLocationId && <p className="text-xs text-red-500">{formErrors.fromLocationId}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-toLocation">To Location *</Label>
                  <Select
                    value={formData.toLocationId}
                    onValueChange={(v) => handleInputChange("toLocationId", v)}
                  >
                    <SelectTrigger id="add-toLocation" className={formErrors.toLocationId ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations
                        .filter((loc) => loc.id !== formData.fromLocationId)
                        .map((location) => (
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
                <Label htmlFor="add-status">Initial Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) => handleInputChange("status", v as ShipmentStatus)}
                >
                  <SelectTrigger id="add-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(SHIPMENT_STATUS_CONFIG).map((status) => (
                      <SelectItem key={status} value={status.toUpperCase()}>
                        {SHIPMENT_STATUS_CONFIG[status as keyof typeof SHIPMENT_STATUS_CONFIG].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-notes">Notes</Label>
                <Input
                  id="add-notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Additional notes..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create Shipment"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Shipment Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Shipment</DialogTitle>
            <DialogDescription>
              Update the shipment information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-trackingId">Tracking ID *</Label>
                <Input
                  id="edit-trackingId"
                  value={formData.trackingId}
                  onChange={(e) => handleInputChange("trackingId", e.target.value)}
                  placeholder="e.g. TXF-001"
                  className={formErrors.trackingId ? "border-red-500" : ""}
                />
                {formErrors.trackingId && <p className="text-xs text-red-500">{formErrors.trackingId}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-fromLocation">From Location *</Label>
                  <Select
                    value={formData.fromLocationId}
                    onValueChange={(v) => handleInputChange("fromLocationId", v)}
                  >
                    <SelectTrigger id="edit-fromLocation" className={formErrors.fromLocationId ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.fromLocationId && <p className="text-xs text-red-500">{formErrors.fromLocationId}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-toLocation">To Location *</Label>
                  <Select
                    value={formData.toLocationId}
                    onValueChange={(v) => handleInputChange("toLocationId", v)}
                  >
                    <SelectTrigger id="edit-toLocation" className={formErrors.toLocationId ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations
                        .filter((loc) => loc.id !== formData.fromLocationId)
                        .map((location) => (
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
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) => handleInputChange("status", v as ShipmentStatus)}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(SHIPMENT_STATUS_CONFIG).map((status) => (
                      <SelectItem key={status} value={status.toUpperCase()}>
                        {SHIPMENT_STATUS_CONFIG[status as keyof typeof SHIPMENT_STATUS_CONFIG].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Input
                  id="edit-notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Additional notes..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Updating..." : "Update Shipment"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Shipment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete shipment <span className="font-semibold">"{selectedShipment?.trackingId}"</span>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
