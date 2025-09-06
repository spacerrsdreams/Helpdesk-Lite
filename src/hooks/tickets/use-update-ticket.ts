import { JSON_PLACEHOLDER_MAX_TICKETS } from "@/constants";
import { useMutation } from "@tanstack/react-query";

import type { TicketT } from "@/schemas/tickets.schema";
import { queryClient } from "@/providers/query-client.provider";
import { apiRequest, ApiRoutes } from "@/lib/api";
import { UseFetchTicketByIdQueryKey } from "@/hooks/tickets/use-fetch-ticket-by-id";
import { UseFetchTicketsQueryKey } from "@/hooks/tickets/use-fetch-tickets";

const UseUpdateTicketQueryKey = "update-ticket";

//! Optimistic update of ticket. This is not STANDARD optimistic update since we do not have DB.
//! Therefore we have to manually update the data in the cache.
export function useUpdateTicket() {
  return useMutation({
    mutationKey: [UseUpdateTicketQueryKey],
    mutationFn: (ticket: TicketT) => {
      //! Check constants.ts for more info.
      if (ticket.id > JSON_PLACEHOLDER_MAX_TICKETS) {
        return Promise.resolve(ticket);
      }

      return apiRequest<TicketT>(ApiRoutes.posts.update(ticket.id), {
        method: "PUT",
        body: JSON.stringify(ticket),
      });
    },
    onMutate: async (ticket) => {
      await queryClient.cancelQueries({ queryKey: [UseFetchTicketByIdQueryKey, ticket.id, UseFetchTicketsQueryKey] });
      const previousTicket = queryClient.getQueryData([UseFetchTicketByIdQueryKey, ticket.id]);
      const previousTickets = queryClient.getQueryData([UseFetchTicketsQueryKey]);

      //! Since there is no DB, we have to manually update the ticket in the cache.
      queryClient.setQueryData([UseFetchTicketByIdQueryKey, ticket.id], (old: TicketT) => ({ ...ticket, id: old.id }));
      queryClient.setQueryData([UseFetchTicketsQueryKey], (old: TicketT[]) => [
        ...old.map((t) => (t.id === ticket.id ? { ...ticket, id: t.id } : t)),
      ]);

      return { previousTicket, previousTickets };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData([UseFetchTicketByIdQueryKey], context?.previousTicket);
      queryClient.setQueryData([UseFetchTicketsQueryKey], context?.previousTickets);
    },
    onSettled: () => {
      //! Ideally this is where invalidation will happen but if we invalidate this
      //! Data will be lost since we are using JSONPlaceholder.
      // queryClient.invalidateQueries({ queryKey: [UseFetchTicketByIdQueryKey] });
    },
  });
}
