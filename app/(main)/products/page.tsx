import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Eye, Pencil, Trash2, MoreVertical } from "lucide-react";
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
import Link from "next/link";

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
 * Products List Page
 *
 * Displays all products with search, filter, and actions
 * Updated to match Figma design
 */
export default function ProductsPage() {
  // Mock data - replace with actual API calls
  const products = [
    {
      id: "1",
      sku: "PROD-001",
      name: "Wireless Mouse",
      category: "Electronics",
      unit: "pcs",
      stock: 150,
      status: "active",
      tags: ["new", "featured"],
    },
    {
      id: "2",
      sku: "PROD-002",
      name: "USB Cable",
      category: "Electronics",
      unit: "pcs",
      stock: 5,
      status: "active",
      tags: [],
    },
    {
      id: "3",
      sku: "PROD-003",
      name: "Keyboard",
      category: "Electronics",
      unit: "pcs",
      stock: 75,
      status: "active",
      tags: ["sale"],
    },
    {
      id: "4",
      sku: "PROD-004",
      name: "Monitor Stand",
      category: "Accessories",
      unit: "pcs",
      stock: 0,
      status: "inactive",
      tags: [],
    },
    {
      id: "5",
      sku: "PROD-005",
      name: "Webcam HD",
      category: "Electronics",
      unit: "pcs",
      stock: 25,
      status: "pending",
      tags: ["new"],
    },
    {
      id: "6",
      sku: "PROD-006",
      name: "USB-C Hub",
      category: "Electronics",
      unit: "pcs",
      stock: 8,
      status: "active",
      tags: ["featured"],
    },
    {
      id: "7",
      sku: "PROD-007",
      name: "Laptop Sleeve",
      category: "Accessories",
      unit: "pcs",
      stock: 100,
      status: "active",
      tags: [],
    },
    {
      id: "8",
      sku: "PROD-008",
      name: "Desk Lamp",
      category: "Office",
      unit: "pcs",
      stock: 45,
      status: "active",
      tags: ["new"],
    },
  ];

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
        <Link href="/products/new">
          <Button className="bg-[#3b82f6] text-white hover:bg-[#2563eb] rounded-lg px-4">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search products, shipments, users..."
            className="h-10 bg-white border-gray-200 pl-9 text-gray-900 placeholder:text-gray-400 focus-visible:ring-[#3b82f6]"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[160px] h-10 bg-white border-gray-200">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="electronics">Electronics</SelectItem>
            <SelectItem value="accessories">Accessories</SelectItem>
            <SelectItem value="office">Office</SelectItem>
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
            {products.map((product) => (
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
                  {product.tags.length > 0 ? (
                    <div className="flex gap-1">
                      {product.tags.map((tag) => (
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
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/products/${product.id}/edit`}
                          className="flex items-center cursor-pointer"
                        >
                          <Pencil className="mr-2 h-4 w-4 text-gray-400" />
                          <span>Edit</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-[#ef4444] focus:text-[#ef4444]">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
