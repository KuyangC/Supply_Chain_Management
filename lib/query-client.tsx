/**
 * TanStack Query Configuration
 * Provides React Query client with optimized defaults
 */

"use client";

import { ReactNode } from "react";
import {
  QueryClient,
  defaultShouldDehydrateQuery,
  QueryClientProvider as TanStackQueryProvider,
} from "@tanstack/react-query";

/**
 * Create a new QueryClient instance with production-ready defaults
 * This is configured for Next.js App Router with React 19
 */
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Stale time: data remains fresh for 5 seconds
        staleTime: 5 * 1000,
        // Cache time: unused data is garbage collected after 10 minutes
        gcTime: 10 * 60 * 1000,
        // Retry failed requests once
        retry: 1,
        // Refetch on window focus (can be disabled for better UX)
        refetchOnWindowFocus: false,
        // Refetch on mount
        refetchOnMount: true,
        // Refetch on reconnect
        refetchOnReconnect: true,
      },
      mutations: {
        // Retry failed mutations once
        retry: 1,
      },
    },
  });
}

/**
 * Browser singleton for QueryClient
 * Ensures only one instance is created during SSR
 */
let browserQueryClient: QueryClient | undefined = undefined;

/**
 * Get QueryClient instance
 * Creates a new instance for SSR, or returns singleton for browser
 */
export function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always create a new client
    return makeQueryClient();
  } else {
    // Browser: create client once
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
  }
}

/**
 * Provider component for wrapping the app with QueryClientProvider
 * Import this in your layout file
 */

interface QueryClientProviderProps {
  children: ReactNode;
}

export function QueryClientProvider({ children }: QueryClientProviderProps) {
  // NOTE: Avoid useState when initializing the query client if you don't
  // have a suspense boundary between this and the code that may
  // suspend because React will throw away the client on the initial
  // render if it suspends and there is no boundary
  const queryClient = getQueryClient();

  return (
    <TanStackQueryProvider client={queryClient}>
      {children}
    </TanStackQueryProvider>
  );
}
