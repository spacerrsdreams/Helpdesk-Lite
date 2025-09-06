import { QueryClientProvider } from "@/providers/query-client.provider";
import { ThemeProvider } from "@/providers/theme.provider";
import { Toaster } from "@/components/ui/sonner";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        {children}
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
