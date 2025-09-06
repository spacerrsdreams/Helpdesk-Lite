import { lazy, Suspense } from "react";

import { MainContent } from "@/components/home/main-content";
import { TicketList } from "@/components/home/ticket-list/ticket-list";
import { TopLoadingBar } from "@/components/ui/top-loading-bar";

const TicketActions = lazy(() =>
  import("@/components/home/ticket-actions/ticket-actions").then((module) => ({
    default: module.TicketActions,
  })),
);

export function Home() {
  return (
    <div className="flex h-full">
      <TicketList />
      <main className="flex flex-1">
        <MainContent />
      </main>
      <Suspense fallback={<TopLoadingBar isLoading />}>
        <TicketActions />
      </Suspense>
    </div>
  );
}
