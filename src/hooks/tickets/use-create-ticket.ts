import { useMutation } from "@tanstack/react-query";

import type { CreateTicketFormDataT, TicketT } from "@/schemas/tickets.schema";
import { queryClient } from "@/providers/query-client.provider";
import { apiRequest, ApiRoutes } from "@/lib/api";
import { UseFetchTicketsQueryKey } from "@/hooks/tickets/use-fetch-tickets";

const UseCreateTicketQueryKey = "create-ticket";

//! Optimistic creation of ticket. This is not STANDARD optimistic update since we do not have DB.
//! Therefore we have to manually update the data in the cache.
export function useCreateTicket() {
  return useMutation({
    mutationKey: [UseCreateTicketQueryKey],
    mutationFn: (ticket: CreateTicketFormDataT) => {
      return apiRequest<TicketT>(ApiRoutes.posts.create, {
        method: "POST",
        body: JSON.stringify(ticket),
      });
    },
    onMutate: async (ticket) => {
      await queryClient.cancelQueries({ queryKey: [UseFetchTicketsQueryKey] });
      const previousTickets = queryClient.getQueryData([UseFetchTicketsQueryKey]);

      //! Since there is no DB, we have to manually add the id, updatedAt and createdAt to the ticket.
      queryClient.setQueryData([UseFetchTicketsQueryKey], (old: TicketT[]) => [
        ...old,
        {
          ...ticket,
          id: old.length + 1,
          userId: ticket.assigneeId,
          manuallyGenerated: { createdAt: new Date(), updatedAt: new Date() },
        },
      ]);

      return { previousTickets };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData([UseFetchTicketsQueryKey], context?.previousTickets);
    },
    onSettled: () => {
      //! Ideally this is where invalidation will happen but if we invalidate this
      //! Data will be lost since we are using JSONPlaceholder.
      // queryClient.invalidateQueries({ queryKey: [UseFetchTicketsQueryKey] });
    },
  });
}
