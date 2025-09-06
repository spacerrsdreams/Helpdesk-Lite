import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createTicketSchema, type CreateTicketFormDataT } from "@/schemas/tickets.schema";
import { useSetSelectedTicketIndex } from "@/stores/tickets.store";
import { AssigneeSelect } from "@/components/home/ticket-detail/assignee-select";
import { Loader2, Plus } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TopLoadingBar } from "@/components/ui/top-loading-bar";
import { useCreateTicket } from "@/hooks/tickets/use-create-ticket";
import { useFetchUsers } from "@/hooks/users/use-fetch-users";

interface CreateTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTicketDialog({ open, onOpenChange }: CreateTicketDialogProps) {
  const { usersMap, data: users, isLoading: isLoadingUsers } = useFetchUsers();
  const { mutateAsync: createTicket, isPending: isLoadingCreateTicket } = useCreateTicket();
  const setSelectedTicketIndex = useSetSelectedTicketIndex();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateTicketFormDataT>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      title: "",
      body: "",
      assigneeId: undefined,
    },
  });

  const onSubmit = async (data: CreateTicketFormDataT) => {
    createTicket(data)
      .then(() => {
        reset();
        onOpenChange(false);
        setSelectedTicketIndex(0);
        toast.success("Ticket Created", {
          description: "Your ticket has been created successfully.",
        });
      })
      .catch(() => {
        toast.error("Failed to Create Ticket", {
          description: "There was an error creating your ticket. Please try again.",
        });
      });
  };

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  if (isLoadingUsers || !users) return <TopLoadingBar isLoading />;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Ticket
          </DialogTitle>
          <DialogDescription>
            Create a new support ticket. Fill in the details below and assign it to a team member if needed.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Enter a descriptive title for the ticket..."
              disabled={isLoadingCreateTicket}
            />
            {errors.title && <p className="text-destructive text-sm">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignee">Assignee</Label>
            <AssigneeSelect
              value={watch("assigneeId")}
              users={users}
              usersMap={usersMap}
              onChange={(value) => setValue("assigneeId", value)}
              disabled={isLoadingCreateTicket}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Description *</Label>
            <Textarea
              id="body"
              {...register("body")}
              placeholder="Describe the issue or request in detail..."
              className="min-h-32 resize-none"
              disabled={isLoadingCreateTicket}
            />
            {errors.body && <p className="text-destructive text-sm">{errors.body.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoadingCreateTicket}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoadingCreateTicket || !isValid}>
              {isLoadingCreateTicket ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Ticket
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
