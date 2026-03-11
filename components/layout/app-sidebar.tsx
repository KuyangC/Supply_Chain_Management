"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Package,
  Warehouse,
  Truck,
  Users,
  BarChart3,
  ScrollText,
  Settings,
  LogOut,
  Building,
  ArrowRight,
  RotateCcw,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, SYSTEM_ITEMS } from "@/lib/constants";

/**
 * Map icon names to Lucide components
 */
const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  Package,
  Warehouse,
  Truck,
  Building,
  ArrowRight,
  RotateCcw,
  Users,
  BarChart3,
  ScrollText,
  Settings,
  LogOut,
};

interface SidebarProps {
  className?: string;
}

/**
 * AppSidebar Component
 *
 * Main navigation sidebar for the application with dark navy background (#1e293b).
 * Collapsible with smooth transitions.
 */
export function AppSidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    // Clear auth token from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");

      // Clear the auth cookie (set to expired)
      document.cookie = "auth_token=; path=/; max-age=0; SameSite=lax";
    }
    // Redirect to login page
    router.push("/login");
  };

  return (
    <aside
      className={cn(
        "flex flex-col bg-[#1e293b] text-white transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
        {!isCollapsed && (
          <span className="text-lg font-semibold text-white">Supply Chain</span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded-md p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-thin p-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const IconComponent = ICON_MAP[item.icon];

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#3b82f6] text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white",
                isCollapsed && "justify-center"
              )}
              title={isCollapsed ? item.title : undefined}
            >
              {IconComponent && (
                <IconComponent className="h-5 w-5 shrink-0" strokeWidth={2} />
              )}
              {!isCollapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* System Section */}
      <div className="border-t border-white/10">
        {/* System Label */}
        {!isCollapsed && (
          <div className="px-4 py-2">
            <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
              System
            </span>
          </div>
        )}

        {/* System Items */}
        <div className="space-y-1 p-2">
          {SYSTEM_ITEMS.map((item) => {
            const isLogout = "action" in item && item.action === "logout";
            const IconComponent = ICON_MAP[item.icon];

            const content = (
              <>
                {IconComponent && (
                  <IconComponent className="h-5 w-5 shrink-0" strokeWidth={2} />
                )}
                {!isCollapsed && <span>{item.title}</span>}
              </>
            );

            if (isLogout) {
              return (
                <button
                  key={item.title}
                  onClick={handleLogout}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    "text-white/70 hover:bg-red-500/20 hover:text-red-400",
                    isCollapsed && "justify-center"
                  )}
                  title={isCollapsed ? item.title : undefined}
                >
                  {content}
                </button>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-[#3b82f6] text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white",
                  isCollapsed && "justify-center"
                )}
                title={isCollapsed ? item.title : undefined}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </div>

      {/* User Profile Section */}
      {!isCollapsed && (
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#3b82f6] text-white font-semibold">
              A
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <p className="truncate text-sm font-medium text-white">Admin User</p>
              <p className="truncate text-xs text-white/60">admin@supplychain.com</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
