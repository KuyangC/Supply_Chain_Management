"use client";

import { Button } from "@/components/ui/button";
import { Search, Filter, RefreshCw, Loader2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useMemo } from "react";
import { useShipments, useProducts, useUsers } from "@/hooks/use-api-data";
import { api, ApiError } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

/**
 * Event log entry interface
 */
interface EventLog {
  id: string;
  timestamp: string;
  type: string;
  trackingId?: string;
  location?: string;
  userId?: string;
  userName?: string;
  notes: string;
  metadata?: Record<string, unknown>;
}

/**
 * Group events by date
 */
interface GroupedEvents {
  date: string;
  events: EventLog[];
}

/**
 * Event Logs Page
 *
 * Displays transaction events and audit trail
 * Updated to fetch real data from API when available
 */
export default function EventLogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState("all");

  // Fetch real data for generating events
  const { data: shipments = [] } = useShipments();
  const { data: products = [] } = useProducts();
  const { data: users = [] } = useUsers();

  // Fetch event logs from API (if endpoint exists)
  const { data: events = [], isLoading, error, refetch } = useQuery({
    queryKey: ["eventLogs"],
    queryFn: async (): Promise<EventLog[]> => {
      try {
        // Try to fetch from event logs endpoint
        return await api.get<EventLog[]>("/event-logs");
      } catch (err) {
        // If endpoint doesn't exist, generate mock events from real data
        if (err instanceof ApiError && err.status === 404) {
          return generateMockEvents();
        }
        throw err;
      }
    },
    retry: false,
  });

  /**
   * Generate mock events from real data
   * This is a fallback when the event logs endpoint doesn't exist
   */
  function generateMockEvents(): EventLog[] {
    const mockEvents: EventLog[] = [];

    // Generate events from shipments
    shipments.forEach((shipment) => {
      mockEvents.push({
        id: `evt-${shipment.id}-created`,
        timestamp: shipment.createdAt,
        type: "shipment_created",
        trackingId: shipment.trackingId,
        location: shipment.fromLocation?.name,
        userId: shipment.userId,
        userName: shipment.user?.name,
        notes: `Shipment ${shipment.trackingId} created from ${shipment.fromLocation?.name} to ${shipment.toLocation?.name}`,
        metadata: { shipmentId: shipment.id, status: shipment.status },
      });

      // Add status change event if not pending
      if (shipment.status !== "PENDING") {
        mockEvents.push({
          id: `evt-${shipment.id}-updated`,
          timestamp: shipment.updatedAt,
          type: "shipment_updated",
          trackingId: shipment.trackingId,
          userId: shipment.userId,
          userName: shipment.user?.name,
          notes: `Shipment ${shipment.trackingId} status changed to ${shipment.status.toLowerCase().replace(/_/g, " ")}`,
          metadata: { shipmentId: shipment.id, status: shipment.status },
        });
      }
    });

    // Generate events from products
    products.forEach((product) => {
      mockEvents.push({
        id: `evt-${product.id}-created`,
        timestamp: product.createdAt,
        type: "product_created",
        notes: `Product ${product.name} (${product.sku}) added to catalog`,
        metadata: { productId: product.id, sku: product.sku, category: product.category },
      });

      if (product.updatedAt !== product.createdAt) {
        mockEvents.push({
          id: `evt-${product.id}-updated`,
          timestamp: product.updatedAt,
          type: "product_updated",
          notes: `Product ${product.name} updated`,
          metadata: { productId: product.id },
        });
      }
    });

    // Generate events from users
    users.forEach((user) => {
      mockEvents.push({
        id: `evt-${user.id}-created`,
        timestamp: user.createdAt,
        type: "user_created",
        userId: user.id,
        userName: user.name,
        notes: `User ${user.name} (${user.email}) joined`,
        metadata: { userId: user.id, role: user.role },
      });
    });

    // Sort by timestamp descending
    return mockEvents.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  // Filter events based on search and type
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        !searchQuery ||
        event.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.trackingId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.userName?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType =
        eventTypeFilter === "all" ||
        (eventTypeFilter === "shipment" && event.type.startsWith("shipment")) ||
        (eventTypeFilter === "stock" && event.type.startsWith("stock")) ||
        (eventTypeFilter === "product" && event.type.startsWith("product")) ||
        (eventTypeFilter === "user" && event.type.startsWith("user"));

      return matchesSearch && matchesType;
    });
  }, [events, searchQuery, eventTypeFilter]);

  // Group events by date
  const groupedEvents = useMemo(() => {
    const groups = new Map<string, EventLog[]>();

    filteredEvents.forEach((event) => {
      const date = new Date(event.timestamp).toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).replace(/\//g, "-");

      if (!groups.has(date)) {
        groups.set(date, []);
      }
      groups.get(date)?.push(event);
    });

    // Convert to array and sort dates descending
    return Array.from(groups.entries())
      .map(([date, events]) => ({ date, events }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [filteredEvents]);

  const eventTypeLabels: Record<string, string> = {
    shipment_created: "Shipment Created",
    shipment_updated: "Shipment Updated",
    shipment_delivered: "Delivered",
    in_transit: "In Transit",
    picked_up: "Picked Up",
    confirmed: "Confirmed",
    stock_adjusted: "Stock Adjusted",
    product_created: "Product Created",
    product_updated: "Product Updated",
    user_created: "User Created",
  };

  const eventTypeColors: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
    shipment_created: "secondary",
    shipment_updated: "outline",
    shipment_delivered: "destructive",
    in_transit: "default",
    picked_up: "secondary",
    confirmed: "outline",
    stock_adjusted: "outline",
    product_created: "secondary",
    product_updated: "outline",
    user_created: "secondary",
  };

  /**
   * Format time for display
   */
  function formatTime(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

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
        <Button
          variant="outline"
          onClick={() => refetch()}
          disabled={isLoading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search events..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
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
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold">Failed to load events</h3>
          <p className="text-muted-foreground mt-2">
            {error instanceof Error ? error.message : "An error occurred"}
          </p>
          <Button variant="outline" className="mt-4" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      ) : groupedEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No events found</h3>
          <p className="text-muted-foreground mt-2">
            {searchQuery || eventTypeFilter !== "all"
              ? "No events match your filters."
              : "No events have been recorded yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {groupedEvents.map((group) => (
            <div key={group.date}>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="text-sm font-medium">
                  {group.date}
                </Badge>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="space-y-3 ml-2">
                {group.events.map((event) => (
                  <div
                    key={event.id}
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
                              {formatTime(event.timestamp)}
                            </span>
                            <Badge variant={eventTypeColors[event.type] || "outline"}>
                              {eventTypeLabels[event.type] || event.type.replace(/_/g, " ")}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {event.notes}
                            </span>
                            {event.trackingId && (
                              <Badge variant="outline" className="font-mono text-xs">
                                {event.trackingId}
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            {event.location && <span>Location: {event.location}</span>}
                            {event.userName && <span>By: {event.userName}</span>}
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
      )}

      {/* Load More Button (placeholder) */}
      {!isLoading && groupedEvents.length > 0 && (
        <div className="flex justify-center">
          <Button variant="outline">Load More</Button>
        </div>
      )}
    </div>
  );
}
