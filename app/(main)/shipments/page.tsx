import { Button } from "@/components/ui/button";
import { Plus, Search, Filter } from "lucide-react";
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

/**
 * Shipments List Page
 *
 * Displays all shipments with filtering and tracking
 */
export default function ShipmentsPage() {
  // Mock data - replace with actual API calls
  const shipments = [
    {
      id: "TXF001",
      from: "WH-001",
      to: "Store-A",
      product: "Wireless Mouse",
      quantity: 25,
      status: "in_transit",
      date: "2025-03-01",
    },
    {
      id: "TXF002",
      from: "WH-001",
      to: "Store-B",
      product: "USB Cable",
      quantity: 50,
      status: "pending",
      date: "2025-03-01",
    },
    {
      id: "TXF003",
      from: "WH-002",
      to: "Store-C",
      product: "Keyboard",
      quantity: 30,
      status: "delivered",
      date: "2025-02-28",
    },
    {
      id: "TXF004",
      from: "WH-001",
      to: "Store-A",
      product: "Monitor",
      quantity: 10,
      status: "confirmed",
      date: "2025-02-28",
    },
    {
      id: "TXF005",
      from: "WH-002",
      to: "Store-B",
      product: "Webcam",
      quantity: 15,
      status: "picked_up",
      date: "2025-02-27",
    },
  ];

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
        <Link href="/shipments/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Shipment
          </Button>
        </Link>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search shipments..."
            className="pl-9"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="in_transit">In Transit</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
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
            {shipments.map((shipment) => (
              <TableRow key={shipment.id}>
                <TableCell className="font-medium">{shipment.id}</TableCell>
                <TableCell>{shipment.from}</TableCell>
                <TableCell>{shipment.to}</TableCell>
                <TableCell>{shipment.product}</TableCell>
                <TableCell>{shipment.quantity}</TableCell>
                <TableCell>
                  <StatusBadge status={shipment.status} type="shipment" />
                </TableCell>
                <TableCell>{shipment.date}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/shipments/${shipment.id}`}>View</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/shipments/${shipment.id}/track`}>Track</Link>
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
