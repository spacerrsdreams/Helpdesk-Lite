import { QueryClient, QueryClientProvider as ReactQueryClientProvider } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
});

export function QueryClientProvider({ children }: { children: React.ReactNode }) {
  return <ReactQueryClientProvider client={queryClient}>{children}</ReactQueryClientProvider>;
}
