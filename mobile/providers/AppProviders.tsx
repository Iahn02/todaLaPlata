import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { trpc } from "../lib/trpc";
import { API_URL } from "../lib/api";
import { tokenCache } from "../lib/auth";

const CLERK_PUBLISHABLE_KEY =
  "pk_test_cHJlcGFyZWQtdGVybWl0ZS04NS5jbGVyay5hY2NvdW50cy5kZXYk";

/**
 * Inner provider that sets up tRPC with the Clerk auth token.
 * Must be inside ClerkProvider so useAuth() works.
 */
function TRPCInnerProvider({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: API_URL,
          transformer: superjson,
          async headers() {
            const token = await getToken();
            return token ? { Authorization: `Bearer ${token}` } : {};
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}

/**
 * Root provider: wraps Clerk (auth) → tRPC (API) → React Query (cache).
 */
export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <TRPCInnerProvider>{children}</TRPCInnerProvider>
    </ClerkProvider>
  );
}
