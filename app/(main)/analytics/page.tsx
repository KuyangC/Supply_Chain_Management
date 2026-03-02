import { Button } from "@/components/ui/button";
import { Download, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SummaryCard } from "@/components/shared/summary-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

/**
 * Analytics & Reports Page
 *
 * Displays analytics with charts and export options
 */
export default function AnalyticsPage() {
  // Mock data - replace with actual API calls
  const summaryData = [
    {
      title: "Inventory Value",
      value: "$125,000",
      trend: { value: "+8%", direction: "up" as const },
    },
    {
      title: "Total Shipments",
      value: 500,
      trend: { value: "+12%", direction: "up" as const },
    },
    {
      title: "Completion Rate",
      value: "94.5%",
      trend: { value: "+2%", direction: "up" as const },
    },
    {
      title: "Avg. Delivery Time",
      value: "2.5 days",
      trend: { value: "-0.5 days", direction: "down" as const },
    },
  ];

  const inventoryReport = [
    {
      product: "Wireless Mouse",
      category: "Electronics",
      stock: 150,
      value: "$2,250",
      lowStock: false,
      expiring: false,
    },
    {
      product: "USB Cable",
      category: "Electronics",
      stock: 5,
      value: "$50",
      lowStock: true,
      expiring: false,
    },
    {
      product: "Keyboard",
      category: "Electronics",
      stock: 75,
      value: "$3,750",
      lowStock: false,
      expiring: false,
    },
    {
      product: "Monitor Stand",
      category: "Accessories",
      stock: 0,
      value: "$0",
      lowStock: true,
      expiring: false,
    },
    {
      product: "Webcam HD",
      category: "Electronics",
      stock: 25,
      value: "$1,250",
      lowStock: false,
      expiring: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
          <p className="text-muted-foreground">
            View insights and export reports
          </p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="30d">
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="lastMonth">Last Month</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryData.map((item) => (
          <SummaryCard
            key={item.title}
            title={item.title}
            value={item.value}
            trend={item.trend}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Inventory by Category Chart Placeholder */}
        <div className="rounded-xl border bg-card p-6">
          <h3 className="text-lg font-semibold">Inventory by Category</h3>
          <p className="text-sm text-muted-foreground">
            Distribution of inventory across categories
          </p>
          <div className="mt-4 h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
            <span className="text-muted-foreground">Pie Chart Placeholder</span>
          </div>
        </div>

        {/* Shipment Trends Chart Placeholder */}
        <div className="rounded-xl border bg-card p-6">
          <h3 className="text-lg font-semibold">Shipment Trends</h3>
          <p className="text-sm text-muted-foreground">
            Shipment volume over time
          </p>
          <div className="mt-4 h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
            <span className="text-muted-foreground">Line Chart Placeholder</span>
          </div>
        </div>
      </div>

      {/* Inventory Report Table */}
      <div className="rounded-xl border bg-card">
        <div className="flex items-center justify-between p-6">
          <div>
            <h3 className="text-lg font-semibold">Inventory Report</h3>
            <p className="text-sm text-muted-foreground">
              Detailed inventory status by product
            </p>
          </div>
        </div>
        <div className="p-6 pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Low Stock</TableHead>
                <TableHead>Expiring</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryReport.map((item) => (
                <TableRow key={item.product}>
                  <TableCell className="font-medium">{item.product}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.stock}</TableCell>
                  <TableCell>{item.value}</TableCell>
                  <TableCell>
                    {item.lowStock ? (
                      <Badge variant="destructive">Yes</Badge>
                    ) : (
                      <Badge variant="outline">No</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.expiring ? (
                      <Badge variant="destructive">Yes</Badge>
                    ) : (
                      <Badge variant="outline">No</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
