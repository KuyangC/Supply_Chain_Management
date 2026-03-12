"use client";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { Toaster } from "@/components/ui/toaster";
import { LocationProvider, useLocation } from "@/components/providers/location-provider";

/**
 * Inner Main Layout with Location Context
 */
function MainLayoutInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locationType } = useLocation();

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar locationType={locationType} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-y-auto bg-[#f8fafc] p-6">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
}

/**
 * Main Layout (Dashboard)
 *
 * Used for all protected pages that require sidebar and header.
 * This layout wraps the dashboard and all protected routes.
 * Provides location context for dynamic navigation.
 */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LocationProvider defaultLocation="manufacturer">
      <MainLayoutInner>{children}</MainLayoutInner>
    </LocationProvider>
  );
}
