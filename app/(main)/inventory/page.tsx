import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, AlertCircle, Calendar } from "lucide-react";
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
  // Mock data - replace with actual API calls
  const inventory = [
    {
      id: "1",
      product: "Wireless Mouse",
      sku: "PROD-001",
      location: "WH-001",
      batch: "BATCH-001",
      quantity: 100,
      available: 90,
      reserved: 10,
      expiryDate: null,
    },
    {
      id: "2",
      product: "Wireless Mouse",
      sku: "PROD-001",
      location: "Store-A",
      batch: "BATCH-001",
      quantity: 50,
      available: 50,
      reserved: 0,
      expiryDate: null,
    },
    {
      id: "3",
      product: "USB Cable",
      sku: "PROD-002",
      location: "WH-001",
      batch: "BATCH-002",
      quantity: 5,
      available: 5,
      reserved: 0,
      expiryDate: "2024-12-31",
    },
    {
      id: "4",
      product: "Keyboard",
      sku: "PROD-003",
      location: "WH-002",
      batch: "BATCH-003",
      quantity: 75,
      available: 70,
      reserved: 5,
      expiryDate: null,
    },
    {
      id: "5",
      product: "Webcam HD",
      sku: "PROD-005",
      location: "WH-001",
      batch: "BATCH-004",
      quantity: 25,
      available: 25,
      reserved: 0,
      expiryDate: null,
    },
    {
      id: "6",
      product: "Monitor Stand",
      sku: "PROD-004",
      location: "WH-002",
      batch: "BATCH-005",
      quantity: 2,
      available: 2,
      reserved: 0,
      expiryDate: "2025-03-15",
    },
    {
      id: "7",
      product: "Laptop Sleeve",
      sku: "PROD-007",
      location: "Store-B",
      batch: "BATCH-006",
      quantity: 30,
      available: 25,
      reserved: 5,
      expiryDate: null,
    },
  ];

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
            {inventory.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-50/50 border-b border-gray-50">
                <TableCell className="font-medium text-gray-900">
                  <Link
                    href={`/products/${item.id}`}
                    className="hover:text-[#3b82f6] hover:underline transition-colors"
                  >
                    {item.product}
                  </Link>
                </TableCell>
                <TableCell className="font-mono text-sm text-gray-600">
                  {item.sku}
                </TableCell>
                <TableCell className="text-gray-600">{item.location}</TableCell>
                <TableCell className="font-mono text-sm text-gray-600">
                  {item.batch}
                </TableCell>
                <TableCell className="text-gray-700">{item.quantity}</TableCell>
                <TableCell>
                  <StockStatusDot status={getStockStatus(item.available)} />
                  <span className="ml-2 text-sm text-gray-600">{item.available}</span>
                </TableCell>
                <TableCell className="text-gray-600">{item.reserved}</TableCell>
                <TableCell>
                  <ExpiryWarning expiryDate={item.expiryDate} isExpiring={isExpiring(item.expiryDate)} />
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
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
