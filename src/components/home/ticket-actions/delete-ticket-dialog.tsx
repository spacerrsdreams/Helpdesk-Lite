import { toast } from "sonner";

import type { TicketT } from "@/schemas/tickets.schema";
import { AlertTriangle, Loader2, Trash2 } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteTicket } from "@/hooks/tickets/use-delete-ticket";

interface DeleteTicketDialogProps {
  ticket: TicketT | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteTicketDialog({ ticket, open, onOpenChange }: DeleteTicketDialogProps) {
  const { mutateAsync: deleteTicket, isPending: isDeleting } = useDeleteTicket();

  const handleDelete = async () => {
    if (!ticket) return;

    try {
      await deleteTicket(ticket.id);
      onOpenChange(false);

      toast.success("Ticket Deleted", {
        description: `Ticket #${ticket.id} has been deleted successfully.`,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to Delete Ticket", {
        description: "There was an error deleting the ticket. Please try again.",
      });
    }
  };

  if (!ticket) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Delete Ticket
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this ticket? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg border p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="font-medium">#{ticket.id}</span>
              <Badge variant="secondary">{ticket.status}</Badge>
            </div>
            <h4 className="mb-1 font-medium">{ticket.title}</h4>
            <p className="text-muted-foreground line-clamp-2 text-sm">{ticket.body}</p>
          </div>

          <div className="bg-destructive/10 border-destructive/20 flex items-center gap-2 rounded-lg border p-3">
            <AlertTriangle className="text-destructive h-4 w-4 flex-shrink-0" />
            <p className="text-destructive text-sm">
              This will permanently delete the ticket and all associated notes.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Ticket
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
