import {
  useCreateTicketDialogOpen,
  useDeleteTicketDialogOpen,
  useSelectedTicket,
  useSetCreateTicketDialogOpen,
  useSetDeleteTicketDialogOpen,
} from "@/stores/tickets.store";
import { CreateTicketDialog } from "@/components/home/ticket-actions/create-ticket-dialog";
import { DeleteTicketDialog } from "@/components/home/ticket-actions/delete-ticket-dialog";
import { useFetchUsers } from "@/hooks/users/use-fetch-users";

export function TicketActions() {
  const { usersMap } = useFetchUsers();

  const selectedTicket = useSelectedTicket(usersMap);
  const createTicketDialogOpen = useCreateTicketDialogOpen();
  const deleteTicketDialogOpen = useDeleteTicketDialogOpen();
  const setCreateTicketDialogOpen = useSetCreateTicketDialogOpen();
  const setDeleteTicketDialogOpen = useSetDeleteTicketDialogOpen();

  return (
    <>
      <CreateTicketDialog open={createTicketDialogOpen} onOpenChange={setCreateTicketDialogOpen} />
      <DeleteTicketDialog
        ticket={selectedTicket}
        open={deleteTicketDialogOpen}
        onOpenChange={setDeleteTicketDialogOpen}
      />
    </>
  );
}
