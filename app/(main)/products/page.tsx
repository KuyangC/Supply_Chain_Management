"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Eye, Pencil, Trash2, MoreVertical, RefreshCw } from "lucide-react";
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
import Link from "next/link";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/use-api-data";
import { TableLoading, TableError, TableEmpty } from "@/components/shared/table-states";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { PRODUCT_STATUS_CONFIG, CATEGORY_OPTIONS, UNIT_OPTIONS } from "@/lib/constants";
import type { Product } from "@/lib/api";

/**
 * Stock indicator component with colored dot
 */
function StockIndicator({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[#ef4444]" />
        <span className="text-sm font-medium text-[#ef4444]">{stock}</span>
      </div>
    );
  }
  if (stock < 10) {
    return (
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[#ef4444]" />
        <span className="text-sm font-medium text-gray-900">{stock}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <span className="h-2 w-2 rounded-full bg-[#10b981]" />
      <span className="text-sm text-gray-700">{stock}</span>
    </div>
  );
}

/**
 * Product form interface
 */
interface ProductForm {
  sku: string;
  name: string;
  category: string;
  unit: string;
  stock: number;
  minStock: number;
  tags: string;
  status: string;
}

const emptyForm: ProductForm = {
  sku: "",
  name: "",
  category: "",
  unit: "pcs",
  stock: 0,
  minStock: 10,
  tags: "",
  status: "ACTIVE",
};

/**
 * Products List Page
 *
 * Displays all products with search, filter, add/edit modals, and delete functionality
 */
export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Dialog states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductForm>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ProductForm, string>>>({});

  const { data: products = [], isLoading, error, refetch } = useProducts();

  // Mutations
  const createMutation = useCreateProduct({
    onSuccess: () => {
      toast({
        title: "Product created",
        description: "Product has been created successfully.",
      });
      setIsAddModalOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create product.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useUpdateProduct({
    onSuccess: () => {
      toast({
        title: "Product updated",
        description: "Product has been updated successfully.",
      });
      setIsEditModalOpen(false);
      setSelectedProduct(null);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update product.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useDeleteProduct({
    onSuccess: () => {
      toast({
        title: "Product deleted",
        description: "Product has been deleted successfully.",
      });
      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete product.",
        variant: "destructive",
      });
    },
  });

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" ||
      product.category.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // Get unique categories from products
  const categories = Array.from(new Set(products.map((p) => p.category)));

  /**
   * Reset form to empty state
   */
  function resetForm() {
    setFormData(emptyForm);
    setFormErrors({});
  }

  /**
   * Open edit modal with product data
   */
  function openEditModal(product: Product) {
    setSelectedProduct(product);
    setFormData({
      sku: product.sku,
      name: product.name,
      category: product.category,
      unit: product.unit,
      stock: product.stock,
      minStock: product.minStock,
      tags: product.tags || "",
      status: product.status,
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  }

  /**
   * Open delete confirmation dialog
   */
  function openDeleteDialog(product: Product) {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  }

  /**
   * Validate form
   */
  function validateForm(): boolean {
    const errors: Partial<Record<keyof ProductForm, string>> = {};

    if (!formData.sku.trim()) errors.sku = "SKU is required";
    if (!formData.name.trim()) errors.name = "Product name is required";
    if (!formData.category) errors.category = "Category is required";
    if (!formData.unit) errors.unit = "Unit is required";
    if (formData.stock < 0) errors.stock = "Stock cannot be negative";
    if (formData.minStock < 0) errors.minStock = "Min stock cannot be negative";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  /**
   * Handle create product
   */
  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    createMutation.mutate({
      ...formData,
      tags: formData.tags || undefined,
    });
  }

  /**
   * Handle update product
   */
  function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProduct || !validateForm()) return;

    updateMutation.mutate({
      id: selectedProduct.id,
      data: {
        ...formData,
        tags: formData.tags || undefined,
      },
    });
  }

  /**
   * Handle delete product
   */
  function handleDelete() {
    if (!selectedProduct) return;
    deleteMutation.mutate(selectedProduct.id);
  }

  /**
   * Handle input change
   */
  function handleInputChange(field: keyof ProductForm, value: string | number) {
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
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your product catalog and inventory
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg"
            onClick={() => refetch()}
            disabled={isLoading}
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
            Add Product
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
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[160px] h-10 bg-white border-gray-200">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat.toLowerCase()}>
                {cat}
              </SelectItem>
            ))}
            {CATEGORY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Table */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent bg-gray-50/50">
              <TableHead className="text-gray-500 font-medium">SKU</TableHead>
              <TableHead className="text-gray-500 font-medium">Product Name</TableHead>
              <TableHead className="text-gray-500 font-medium">Category</TableHead>
              <TableHead className="text-gray-500 font-medium">Unit</TableHead>
              <TableHead className="text-gray-500 font-medium">Stock</TableHead>
              <TableHead className="text-gray-500 font-medium">Tags</TableHead>
              <TableHead className="text-gray-500 font-medium">Status</TableHead>
              <TableHead className="text-gray-500 font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableLoading colSpan={8} />
            ) : error ? (
              <TableError
                colSpan={8}
                message={error instanceof Error ? error.message : "Failed to load products"}
                onRetry={() => refetch()}
              />
            ) : filteredProducts.length === 0 ? (
              <TableEmpty
                colSpan={8}
                message={products.length === 0 ? "No products found. Add your first product to get started." : "No products match your filters."}
              />
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id} className="hover:bg-gray-50/50 border-b border-gray-50">
                  <TableCell>
                    <Link
                      href={`/products/${product.id}`}
                      className="font-medium text-[#3b82f6] hover:text-[#2563eb] hover:underline"
                    >
                      {product.sku}
                    </Link>
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    {product.name}
                  </TableCell>
                  <TableCell className="text-gray-600">{product.category}</TableCell>
                  <TableCell className="text-gray-600">{product.unit}</TableCell>
                  <TableCell>
                    <StockIndicator stock={product.stock} />
                  </TableCell>
                  <TableCell>
                    {product.tags ? (
                      <div className="flex gap-1">
                        {product.tags.split(",").map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs px-2 py-0 rounded-full bg-gray-100 text-gray-600 border-0"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={product.status} type="product" />
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
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/products/${product.id}`}
                            className="flex items-center cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4 text-gray-400" />
                            <span>View</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditModal(product)}>
                          <Pencil className="mr-2 h-4 w-4 text-gray-400" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-[#ef4444] focus:text-[#ef4444]"
                          onClick={() => openDeleteDialog(product)}
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

      {/* Add Product Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Create a new product for your inventory catalog.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="add-sku">SKU *</Label>
                  <Input
                    id="add-sku"
                    value={formData.sku}
                    onChange={(e) => handleInputChange("sku", e.target.value)}
                    placeholder="e.g. PROD-001"
                    className={formErrors.sku ? "border-red-500" : ""}
                  />
                  {formErrors.sku && <p className="text-xs text-red-500">{formErrors.sku}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-unit">Unit *</Label>
                  <Select value={formData.unit} onValueChange={(v) => handleInputChange("unit", v)}>
                    <SelectTrigger id="add-unit">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {UNIT_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.unit && <p className="text-xs text-red-500">{formErrors.unit}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-name">Product Name *</Label>
                <Input
                  id="add-name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g. Wireless Mouse"
                  className={formErrors.name ? "border-red-500" : ""}
                />
                {formErrors.name && <p className="text-xs text-red-500">{formErrors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-category">Category *</Label>
                <Select value={formData.category} onValueChange={(v) => handleInputChange("category", v)}>
                  <SelectTrigger id="add-category" className={formErrors.category ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.category && <p className="text-xs text-red-500">{formErrors.category}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="add-stock">Initial Stock *</Label>
                  <Input
                    id="add-stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => handleInputChange("stock", parseInt(e.target.value) || 0)}
                    className={formErrors.stock ? "border-red-500" : ""}
                  />
                  {formErrors.stock && <p className="text-xs text-red-500">{formErrors.stock}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-minStock">Min Stock Alert *</Label>
                  <Input
                    id="add-minStock"
                    type="number"
                    min="0"
                    value={formData.minStock}
                    onChange={(e) => handleInputChange("minStock", parseInt(e.target.value) || 0)}
                    className={formErrors.minStock ? "border-red-500" : ""}
                  />
                  {formErrors.minStock && <p className="text-xs text-red-500">{formErrors.minStock}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-tags">Tags</Label>
                <Input
                  id="add-tags"
                  value={formData.tags}
                  onChange={(e) => handleInputChange("tags", e.target.value)}
                  placeholder="e.g. electronics, wireless (comma separated)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-status">Status</Label>
                <Select value={formData.status} onValueChange={(v) => handleInputChange("status", v)}>
                  <SelectTrigger id="add-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(PRODUCT_STATUS_CONFIG).map((status) => (
                      <SelectItem key={status} value={status.toUpperCase()}>
                        {PRODUCT_STATUS_CONFIG[status as keyof typeof PRODUCT_STATUS_CONFIG].label}
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
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the product information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-sku">SKU *</Label>
                  <Input
                    id="edit-sku"
                    value={formData.sku}
                    onChange={(e) => handleInputChange("sku", e.target.value)}
                    placeholder="e.g. PROD-001"
                    className={formErrors.sku ? "border-red-500" : ""}
                  />
                  {formErrors.sku && <p className="text-xs text-red-500">{formErrors.sku}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-unit">Unit *</Label>
                  <Select value={formData.unit} onValueChange={(v) => handleInputChange("unit", v)}>
                    <SelectTrigger id="edit-unit">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {UNIT_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.unit && <p className="text-xs text-red-500">{formErrors.unit}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-name">Product Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g. Wireless Mouse"
                  className={formErrors.name ? "border-red-500" : ""}
                />
                {formErrors.name && <p className="text-xs text-red-500">{formErrors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-category">Category *</Label>
                <Select value={formData.category} onValueChange={(v) => handleInputChange("category", v)}>
                  <SelectTrigger id="edit-category" className={formErrors.category ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.category && <p className="text-xs text-red-500">{formErrors.category}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-stock">Stock *</Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => handleInputChange("stock", parseInt(e.target.value) || 0)}
                    className={formErrors.stock ? "border-red-500" : ""}
                  />
                  {formErrors.stock && <p className="text-xs text-red-500">{formErrors.stock}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-minStock">Min Stock Alert *</Label>
                  <Input
                    id="edit-minStock"
                    type="number"
                    min="0"
                    value={formData.minStock}
                    onChange={(e) => handleInputChange("minStock", parseInt(e.target.value) || 0)}
                    className={formErrors.minStock ? "border-red-500" : ""}
                  />
                  {formErrors.minStock && <p className="text-xs text-red-500">{formErrors.minStock}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-tags">Tags</Label>
                <Input
                  id="edit-tags"
                  value={formData.tags}
                  onChange={(e) => handleInputChange("tags", e.target.value)}
                  placeholder="e.g. electronics, wireless (comma separated)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(v) => handleInputChange("status", v)}>
                  <SelectTrigger id="edit-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(PRODUCT_STATUS_CONFIG).map((status) => (
                      <SelectItem key={status} value={status.toUpperCase()}>
                        {PRODUCT_STATUS_CONFIG[status as keyof typeof PRODUCT_STATUS_CONFIG].label}
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
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Updating..." : "Update Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-semibold">"{selectedProduct?.name}"</span>?
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
