import { useSetCreateTicketDialogOpen } from "@/stores/tickets.store";
import { Plus } from "@/components/icons";
import { Button } from "@/components/ui/button";

export function TickerListHeaderAction() {
  const setCreateTicketDialogOpen = useSetCreateTicketDialogOpen();

  return (
    <div className="mb-4 flex items-center justify-between">
      <h1 className="text-xl font-semibold">Helpdesk Lite</h1>
      <Button size="sm" aria-label="Create new ticket" onClick={() => setCreateTicketDialogOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        New Ticket
      </Button>
    </div>
  );
}
