import { lazy, Suspense } from "react";

import { useSelectedTicket, useSetCreateTicketDialogOpen } from "@/stores/tickets.store";
import { Plus } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useFetchUsers } from "@/hooks/users/use-fetch-users";

import { TopLoadingBar } from "../ui/top-loading-bar";

const TicketDetailView = lazy(() =>
  import("@/components/home/ticket-detail/ticket-detail-view").then((module) => ({
    default: module.TicketDetailView,
  })),
);

export function MainContent() {
  const setCreateTicketDialogOpen = useSetCreateTicketDialogOpen();
  const { usersMap } = useFetchUsers();
  const selectedTicket = useSelectedTicket(usersMap);

  if (!selectedTicket) {
    return (
      <div className="flex h-full flex-1 items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-semibold">Welcome to Helpdesk Lite</h2>
          <p className="text-muted-foreground mb-6">
            Select a ticket from the sidebar to get started, or create a new one.
          </p>
          <Button onClick={() => setCreateTicketDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Ticket
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<TopLoadingBar isLoading />}>
      <TicketDetailView />
    </Suspense>
  );
}
