"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Eye, Pencil, Trash2, MoreVertical, RefreshCw, Mail, Phone, MapPin } from "lucide-react";
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
import { SUPPLIER_STATUS_CONFIG } from "@/lib/constants";
import { MOCK_SUPPLIERS } from "@/lib/api";
import type { Supplier } from "@/lib/api";

/**
 * Supplier form interface
 */
interface SupplierForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  contactPerson: string;
  status: string;
}

const emptyForm: SupplierForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
  contactPerson: "",
  status: "ACTIVE",
};

/**
 * Suppliers List Page
 *
 * Displays all suppliers with search, filter, add/edit modals, and delete functionality
 */
export default function SuppliersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Dialog states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState<SupplierForm>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof SupplierForm, string>>>({});

  // Mock state for suppliers (with create/update/delete simulation)
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [isLoading, setIsLoading] = useState(false);

  // Filter suppliers based on search and status
  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      !searchQuery ||
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.contactPerson.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      supplier.status.toLowerCase() === statusFilter.toLowerCase();

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
   * Open view dialog with supplier data
   */
  function openViewDialog(supplier: Supplier) {
    setSelectedSupplier(supplier);
    setIsViewDialogOpen(true);
  }

  /**
   * Open edit modal with supplier data
   */
  function openEditModal(supplier: Supplier) {
    setSelectedSupplier(supplier);
    setFormData({
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      contactPerson: supplier.contactPerson,
      status: supplier.status,
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  }

  /**
   * Open delete confirmation dialog
   */
  function openDeleteDialog(supplier: Supplier) {
    setSelectedSupplier(supplier);
    setIsDeleteDialogOpen(true);
  }

  /**
   * Validate form
   */
  function validateForm(): boolean {
    const errors: Partial<Record<keyof SupplierForm, string>> = {};

    if (!formData.name.trim()) errors.name = "Supplier name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.phone.trim()) errors.phone = "Phone is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.contactPerson.trim()) errors.contactPerson = "Contact person is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  /**
   * Handle create supplier (mock)
   */
  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    const newSupplier: Supplier = {
      id: `sup-${Date.now()}`,
      ...formData,
      status: formData.status as Supplier["status"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSuppliers([newSupplier, ...suppliers]);
    toast({
      title: "Supplier created",
      description: "Supplier has been created successfully.",
    });
    setIsAddModalOpen(false);
    resetForm();
  }

  /**
   * Handle update supplier (mock)
   */
  function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSupplier || !validateForm()) return;

    const updatedSuppliers = suppliers.map((s) =>
      s.id === selectedSupplier.id
        ? {
            ...s,
            ...formData,
            status: formData.status as Supplier["status"],
            updatedAt: new Date().toISOString(),
          }
        : s
    );

    setSuppliers(updatedSuppliers);
    toast({
      title: "Supplier updated",
      description: "Supplier has been updated successfully.",
    });
    setIsEditModalOpen(false);
    setSelectedSupplier(null);
    resetForm();
  }

  /**
   * Handle delete supplier (mock)
   */
  function handleDelete() {
    if (!selectedSupplier) return;

    const filtered = suppliers.filter((s) => s.id !== selectedSupplier.id);
    setSuppliers(filtered);
    toast({
      title: "Supplier deleted",
      description: "Supplier has been deleted successfully.",
    });
    setIsDeleteDialogOpen(false);
    setSelectedSupplier(null);
  }

  /**
   * Handle input change
   */
  function handleInputChange(field: keyof SupplierForm, value: string) {
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
          <h1 className="text-2xl font-semibold text-gray-900">Suppliers</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your supplier relationships and contacts
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
              setIsAddModalOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Supplier
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search suppliers..."
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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="blocked">Blocked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Suppliers Table */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent bg-gray-50/50">
              <TableHead className="text-gray-500 font-medium">Name</TableHead>
              <TableHead className="text-gray-500 font-medium">Contact Person</TableHead>
              <TableHead className="text-gray-500 font-medium">Email</TableHead>
              <TableHead className="text-gray-500 font-medium">Phone</TableHead>
              <TableHead className="text-gray-500 font-medium">Status</TableHead>
              <TableHead className="text-gray-500 font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableLoading colSpan={6} />
            ) : filteredSuppliers.length === 0 ? (
              <TableEmpty
                colSpan={6}
                message={suppliers.length === 0 ? "No suppliers found. Add your first supplier to get started." : "No suppliers match your filters."}
              />
            ) : (
              filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id} className="hover:bg-gray-50/50 border-b border-gray-50">
                  <TableCell className="font-medium text-gray-900">
                    {supplier.name}
                  </TableCell>
                  <TableCell className="text-gray-600">{supplier.contactPerson}</TableCell>
                  <TableCell className="text-gray-600">{supplier.email}</TableCell>
                  <TableCell className="text-gray-600">{supplier.phone}</TableCell>
                  <TableCell>
                    <StatusBadge status={supplier.status} type="supplier" />
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
                        <DropdownMenuItem onClick={() => openViewDialog(supplier)}>
                          <Eye className="mr-2 h-4 w-4 text-gray-400" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditModal(supplier)}>
                          <Pencil className="mr-2 h-4 w-4 text-gray-400" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-[#ef4444] focus:text-[#ef4444]"
                          onClick={() => openDeleteDialog(supplier)}
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

      {/* Add Supplier Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Supplier</DialogTitle>
            <DialogDescription>
              Create a new supplier for your supply chain network.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="add-name">Supplier Name *</Label>
                <Input
                  id="add-name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g. Acme Corporation"
                  className={formErrors.name ? "border-red-500" : ""}
                />
                {formErrors.name && <p className="text-xs text-red-500">{formErrors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-contactPerson">Contact Person *</Label>
                <Input
                  id="add-contactPerson"
                  value={formData.contactPerson}
                  onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                  placeholder="e.g. John Smith"
                  className={formErrors.contactPerson ? "border-red-500" : ""}
                />
                {formErrors.contactPerson && <p className="text-xs text-red-500">{formErrors.contactPerson}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="add-email">Email *</Label>
                  <Input
                    id="add-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="e.g. contact@acme.com"
                    className={formErrors.email ? "border-red-500" : ""}
                  />
                  {formErrors.email && <p className="text-xs text-red-500">{formErrors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-phone">Phone *</Label>
                  <Input
                    id="add-phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="e.g. +1-555-0101"
                    className={formErrors.phone ? "border-red-500" : ""}
                  />
                  {formErrors.phone && <p className="text-xs text-red-500">{formErrors.phone}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-address">Address *</Label>
                <Input
                  id="add-address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="e.g. 123 Industrial Ave, Suite 100, San Francisco, CA 94102"
                  className={formErrors.address ? "border-red-500" : ""}
                />
                {formErrors.address && <p className="text-xs text-red-500">{formErrors.address}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-status">Status</Label>
                <Select value={formData.status} onValueChange={(v) => handleInputChange("status", v)}>
                  <SelectTrigger id="add-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(SUPPLIER_STATUS_CONFIG).map((status) => (
                      <SelectItem key={status} value={status.toUpperCase()}>
                        {SUPPLIER_STATUS_CONFIG[status as keyof typeof SUPPLIER_STATUS_CONFIG].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Supplier</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Supplier Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Supplier</DialogTitle>
            <DialogDescription>
              Update the supplier information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Supplier Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g. Acme Corporation"
                  className={formErrors.name ? "border-red-500" : ""}
                />
                {formErrors.name && <p className="text-xs text-red-500">{formErrors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-contactPerson">Contact Person *</Label>
                <Input
                  id="edit-contactPerson"
                  value={formData.contactPerson}
                  onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                  placeholder="e.g. John Smith"
                  className={formErrors.contactPerson ? "border-red-500" : ""}
                />
                {formErrors.contactPerson && <p className="text-xs text-red-500">{formErrors.contactPerson}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email *</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="e.g. contact@acme.com"
                    className={formErrors.email ? "border-red-500" : ""}
                  />
                  {formErrors.email && <p className="text-xs text-red-500">{formErrors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone *</Label>
                  <Input
                    id="edit-phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="e.g. +1-555-0101"
                    className={formErrors.phone ? "border-red-500" : ""}
                  />
                  {formErrors.phone && <p className="text-xs text-red-500">{formErrors.phone}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-address">Address *</Label>
                <Input
                  id="edit-address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="e.g. 123 Industrial Ave, Suite 100, San Francisco, CA 94102"
                  className={formErrors.address ? "border-red-500" : ""}
                />
                {formErrors.address && <p className="text-xs text-red-500">{formErrors.address}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(v) => handleInputChange("status", v)}>
                  <SelectTrigger id="edit-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(SUPPLIER_STATUS_CONFIG).map((status) => (
                      <SelectItem key={status} value={status.toUpperCase()}>
                        {SUPPLIER_STATUS_CONFIG[status as keyof typeof SUPPLIER_STATUS_CONFIG].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Supplier</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Supplier Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Supplier Details</DialogTitle>
            <DialogDescription>
              Detailed information about the supplier.
            </DialogDescription>
          </DialogHeader>
          {selectedSupplier && (
            <div className="grid gap-4 py-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Supplier Name</p>
                <p className="text-base font-semibold text-gray-900">{selectedSupplier.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Contact Person</p>
                <p className="text-base text-gray-900">{selectedSupplier.contactPerson}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" />
                    Email
                  </p>
                  <p className="text-sm text-gray-900">{selectedSupplier.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" />
                    Phone
                  </p>
                  <p className="text-sm text-gray-900">{selectedSupplier.phone}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  Address
                </p>
                <p className="text-sm text-gray-900">{selectedSupplier.address}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Status</p>
                <StatusBadge status={selectedSupplier.status} type="supplier" />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Created At</p>
                  <p className="text-xs text-gray-700">
                    {new Date(selectedSupplier.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Last Updated</p>
                  <p className="text-xs text-gray-700">
                    {new Date(selectedSupplier.updatedAt).toLocaleDateString("en-US", {
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Supplier</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-semibold">"{selectedSupplier?.name}"</span>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
