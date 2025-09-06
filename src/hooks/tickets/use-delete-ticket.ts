import { JSON_PLACEHOLDER_MAX_TICKETS } from "@/constants";
import { useMutation } from "@tanstack/react-query";

import type { TicketT } from "@/schemas/tickets.schema";
import { queryClient } from "@/providers/query-client.provider";
import { apiRequest, ApiRoutes } from "@/lib/api";
import { UseFetchTicketsQueryKey } from "@/hooks/tickets/use-fetch-tickets";

const UseDeleteTicketQueryKey = "delete-ticket";

//! Optimistic delete of ticket. This is not STANDARD optimistic update since we do not have DB.
//! Therefore we have to manually update the data in cache.
export function useDeleteTicket() {
  return useMutation({
    mutationKey: [UseDeleteTicketQueryKey],
    mutationFn: (ticketId: number) => {
      //! Check constants.ts for more info.
      if (ticketId > JSON_PLACEHOLDER_MAX_TICKETS) {
        return Promise.resolve(null);
      }

      return apiRequest<null>(ApiRoutes.posts.delete(ticketId), {
        method: "DELETE",
      });
    },
    onMutate: async (ticketId) => {
      await queryClient.cancelQueries({ queryKey: [UseFetchTicketsQueryKey] });
      const previousTickets = queryClient.getQueryData([UseFetchTicketsQueryKey]);

      //! Since there is no DB, we have to manually remove the ticket from the cache.
      queryClient.setQueryData([UseFetchTicketsQueryKey], (old: TicketT[]) => [
        ...old.filter((t) => t.id !== ticketId),
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
