import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { TicketStatusT, TicketT, UpdateTicketFormDataT } from "@/schemas/tickets.schema";
import { updateTicketSchema } from "@/schemas/tickets.schema";
import { useSelectedTicket, useSetSelectedTicketIndex } from "@/stores/tickets.store";
import { debounce } from "@/lib/utils";
import { NotesThread } from "@/components/home/notes/notes-thread";
import { StatusSelect } from "@/components/home/ticket-detail/status-select";
import { TicketDetailHeader } from "@/components/home/ticket-detail/ticket-detail-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFetchTicketById } from "@/hooks/tickets/use-fetch-ticket-by-id";
import { useUpdateTicket } from "@/hooks/tickets/use-update-ticket";
import { useFetchUsers } from "@/hooks/users/use-fetch-users";

export function TicketDetailView() {
  const { usersMap } = useFetchUsers();
  const selectedTicket = useSelectedTicket(usersMap);

  const { data: ticket, error, refetch: refreshTicket } = useFetchTicketById(selectedTicket!.id);
  const { mutateAsync: updateTicket, isPending: isUpdating } = useUpdateTicket();
  const setSelectedTicketIndex = useSetSelectedTicketIndex();

  const form = useForm<UpdateTicketFormDataT>({
    resolver: zodResolver(updateTicketSchema),
    defaultValues: {
      title: "",
      body: "",
      status: "open",
    },
    mode: "onChange",
  });

  const {
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = form;

  const ticketData: TicketT | null = useMemo(() => {
    if (!ticket) return null;

    const currentValues = watch();
    return {
      ...ticket,
      ...currentValues,
      updatedAt: new Date(),
      createdAt: new Date(),
    };
  }, [ticket, watch]);

  const debouncedUpdate = useMemo(
    () =>
      debounce((data: UpdateTicketFormDataT) => {
        if (!ticket) return;

        const validationResult = updateTicketSchema.safeParse(data);
        if (!validationResult.success) {
          return;
        }

        if (!isValid) {
          return;
        }

        const updatedTicket: TicketT = {
          ...ticket,
          ...data,
          manuallyGenerated: {
            updatedAt: new Date(),
            createdAt: new Date(),
            status: data.status,
          },
        };

        updateTicket(updatedTicket).then(() => {
          setSelectedTicketIndex(0);
          toast.success("Ticket Updated", {
            description: "Your ticket has been updated successfully.",
          });
        });
      }, 550),
    [ticket, updateTicket, isValid, setSelectedTicketIndex],
  );

  useEffect(() => {
    if (ticket) {
      const status = (ticket.manuallyGenerated?.status ?? ticket.status ?? "open") as Exclude<TicketStatusT, "all">;

      reset({
        title: ticket.title,
        body: ticket.body,
        status: status,
      });
    }
  }, [ticket, reset]);

  useEffect(() => {
    const subscription = watch((value) => {
      debouncedUpdate(value as UpdateTicketFormDataT);
    });

    return () => subscription.unsubscribe();
  }, [watch, debouncedUpdate, ticket]);

  if (error) {
    toast.error("Failed to load ticket details. Please try again.", {
      description: `There was a problem loading the ticket with id #${selectedTicket?.id}. Please try again.`,
    });

    return (
      <div className="flex h-full flex-1 items-center justify-center">
        <Card className="max-w-md p-6" role="alert">
          <h3 className="text-destructive mb-2 text-lg font-semibold">Error Loading Ticket</h3>
          <p className="text-muted-foreground mb-4">Failed to load ticket details. Please try again.</p>
          <Button onClick={() => refreshTicket()}>Retry</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-1 flex-col" role="main" aria-label="Ticket Details">
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <TicketDetailHeader ticket={ticketData} isUpdating={isUpdating} />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="gap-1">
                <h3 className="text-lg font-semibold">Title</h3>
              </CardHeader>
              <CardContent>
                <Input
                  {...form.register("title")}
                  placeholder="Enter ticket title..."
                  className="text-lg"
                  disabled={isUpdating}
                  aria-label="Ticket title"
                  aria-describedby="title-help"
                />
                {errors.title && <p className="text-destructive mt-1 text-sm">{errors.title.message}</p>}
                <p id="title-help" className="sr-only">
                  Enter a descriptive title for this ticket
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Status</h3>
              </CardHeader>
              <CardContent>
                <StatusSelect
                  value={watch("status")}
                  onChange={(status) => {
                    if (status !== "all") {
                      setValue("status", status);
                    }
                  }}
                  disabled={isUpdating}
                />
                {errors.status && <p className="text-destructive mt-1 text-sm">{errors.status.message}</p>}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Description</h3>
            </CardHeader>
            <CardContent>
              <Textarea
                {...form.register("body")}
                placeholder="Enter ticket description..."
                className="min-h-32 resize-none"
                disabled={isUpdating}
                aria-label="Ticket description"
                aria-describedby="description-help"
              />
              {errors.body && <p className="text-destructive mt-1 text-sm">{errors.body.message}</p>}
              <p id="description-help" className="text-muted-foreground mt-2 text-xs">
                Changes are automatically saved as you type
              </p>
            </CardContent>
          </Card>

          {ticketData && <NotesThread ticketId={ticketData?.id} />}

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Details</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Created:</span>
                <span className="text-muted-foreground text-sm">{ticketData?.createdAt.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Last Updated:</span>
                <span className="text-muted-foreground text-sm">{ticketData?.updatedAt.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Reporter:</span>
                <Badge variant="secondary">User #{ticketData?.userId}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
