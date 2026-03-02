"use client";

import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  className?: string;
}

/**
 * AppHeader Component
 *
 * Top header bar with search bar (light gray #f1f5f9), notifications, and user profile.
 */
export function AppHeader({ className }: AppHeaderProps) {
  return (
    <header
      className={cn(
        "flex h-16 items-center justify-between border-b bg-white px-6",
        className
      )}
    >
      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search products, shipments, users..."
            className="h-10 bg-[#f1f5f9] border-0 text-gray-900 placeholder:text-gray-400 focus-visible:ring-[#3b82f6] focus-visible:ring-2 focus-visible:ring-offset-0"
          />
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-gray-900 hover:bg-gray-100">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#ef4444] text-[10px] text-white font-medium">
            3
          </span>
          <span className="sr-only">Notifications</span>
        </Button>

        {/* User profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-gray-50 transition-colors">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3b82f6] text-white font-semibold text-sm">
                A
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium text-gray-900">Admin User</span>
                <span className="text-xs text-gray-500">Administrator</span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">
                  admin@supplychain.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <span>Profile Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>Notifications</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>Help & Support</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-[#ef4444] focus:text-[#ef4444]">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
