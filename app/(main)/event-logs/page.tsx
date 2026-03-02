import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Event Logs Page
 *
 * Displays transaction events and audit trail
 */
export default function EventLogsPage() {
  // Mock data - replace with actual API calls
  const events = [
    {
      date: "2025-03-01",
      events: [
        {
          time: "15:30",
          type: "in_transit",
          trackingId: "TXF001",
          location: "-6.2088, 106.8456",
          by: "Courier",
          temperature: "25C",
          notes: "Shipment picked up",
        },
        {
          time: "14:00",
          type: "picked_up",
          trackingId: "TXF001",
          location: "Main Warehouse",
          by: "Warehouse Manager",
          notes: "Package ready for delivery",
        },
        {
          time: "11:00",
          type: "confirmed",
          trackingId: "TXF001",
          location: "Main Warehouse",
          by: "Admin",
          notes: "Shipment confirmed",
        },
      ],
    },
    {
      date: "2025-02-28",
      events: [
        {
          time: "16:00",
          type: "delivered",
          trackingId: "TXF995",
          location: "Store B",
          by: "Store Manager",
          notes: "Successfully delivered",
        },
        {
          time: "09:00",
          type: "stock_adjusted",
          trackingId: null,
          location: "WH-001",
          by: "Admin",
          notes: "Stock increased: Wireless Mouse +50",
        },
      ],
    },
    {
      date: "2025-02-27",
      events: [
        {
          time: "13:30",
          type: "product_created",
          trackingId: null,
          location: null,
          by: "Admin",
          notes: "New product created: Webcam HD",
        },
        {
          time: "10:00",
          type: "user_created",
          trackingId: null,
          location: null,
          by: "System",
          notes: "New user created: Charlie Brown",
        },
      ],
    },
  ];

  const eventTypeLabels: Record<string, string> = {
    in_transit: "In Transit",
    picked_up: "Picked Up",
    confirmed: "Confirmed",
    delivered: "Delivered",
    stock_adjusted: "Stock Adjusted",
    product_created: "Product Created",
    user_created: "User Created",
  };

  const eventTypeColors: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
    in_transit: "default",
    picked_up: "secondary",
    confirmed: "outline",
    delivered: "destructive",
    stock_adjusted: "outline",
    product_created: "secondary",
    user_created: "secondary",
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Event Logs</h1>
          <p className="text-muted-foreground">
            Transaction events and audit trail
          </p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search events..."
            className="pl-9"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Event Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value="shipment">Shipments</SelectItem>
            <SelectItem value="stock">Stock Changes</SelectItem>
            <SelectItem value="product">Products</SelectItem>
            <SelectItem value="user">Users</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Event Timeline */}
      <div className="space-y-6">
        {events.map((day) => (
          <div key={day.date}>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className="text-sm font-medium">
                {day.date}
              </Badge>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="space-y-3 ml-2">
              {day.events.map((event, idx) => (
                <div
                  key={`${day.date}-${idx}`}
                  className="relative flex gap-4 pb-4 last:pb-0"
                >
                  {/* Timeline connector */}
                  <div className="absolute left-[5px] top-8 bottom-0 w-px bg-border last:hidden" />
                  <div className="relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                  <div className="flex-1 rounded-lg border bg-card p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {event.time}
                          </span>
                          <Badge variant={eventTypeColors[event.type] || "outline"}>
                            {eventTypeLabels[event.type] || event.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {event.notes}
                          </span>
                          {event.trackingId && (
                            <Badge variant="outline" className="font-mono">
                              {event.trackingId}
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          {event.location && (
                            <span>Location: {event.location}</span>
                          )}
                          <span>By: {event.by}</span>
                          {"temperature" in event && event.temperature && (
                            <span>Temp: {event.temperature}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="flex justify-center">
        <Button variant="outline">Load More</Button>
      </div>
    </div>
  );
}
