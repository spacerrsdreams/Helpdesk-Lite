import type { TicketT } from "@/schemas/tickets.schema";
import { useSetDeleteTicketDialogOpen } from "@/stores/tickets.store";
import { Clock, MoreHorizontal, Save, Trash2 } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TicketDetailHeaderProps {
  ticket: TicketT | null;
  isUpdating: boolean;
}

export function TicketDetailHeader({ ticket, isUpdating }: TicketDetailHeaderProps) {
  const setDeleteTicketDialogOpen = useSetDeleteTicketDialogOpen();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">Ticket #{ticket?.id}</h2>
          {isUpdating && (
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Save className="h-4 w-4 animate-pulse" />
              <span>Saving...</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            <span>Updated {formatDate(ticket?.updatedAt?.toISOString() ?? "")}</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" aria-label="Ticket actions menu">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => window.print()}>Print Ticket</DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setDeleteTicketDialogOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Ticket
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
}
