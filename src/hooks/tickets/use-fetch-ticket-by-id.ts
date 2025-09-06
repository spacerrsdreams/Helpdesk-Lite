import { JSON_PLACEHOLDER_MAX_TICKETS } from "@/constants";
import { useQuery } from "@tanstack/react-query";

import type { TicketT } from "@/schemas/tickets.schema";
import { apiRequest, ApiRoutes } from "@/lib/api";

import { useFetchTickets } from "./use-fetch-tickets";

export const UseFetchTicketByIdQueryKey = "fetch-ticket-by-id";

export function useFetchTicketById(id: number) {
  const { data: tickets } = useFetchTickets();
  const ticket = tickets.find((ticket: TicketT) => ticket.id === id);

  return useQuery({
    queryKey: [UseFetchTicketByIdQueryKey, id],
    queryFn: async () => {
      //! Check constants.ts for more info.
      if (id > JSON_PLACEHOLDER_MAX_TICKETS) {
        return Promise.resolve(ticket);
      }

      const data = await apiRequest<TicketT>(ApiRoutes.posts.getById(id));

      //! Again doing redundant spreading SINCE we are using JSONPlaceholder.
      return { ...data, status: ticket?.status === "all" ? "open" : ticket?.status, assigneeId: ticket?.assigneeId };
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
}
