import { useEffect } from "react";
import { toast } from "sonner";

import {
  useAssigneeFilter,
  useFilteredAndSortedTickets,
  useSearchTerm,
  useSelectedTicketIndex,
  useSetTickets,
  useStatusFilter,
} from "@/stores/tickets.store";
import { TicketsListHeader } from "@/components/home/ticket-list/tickets-list-header";
import { VirtulisedTicketList } from "@/components/home/ticket-list/virtulised-ticket-list";
import { TopLoadingBar } from "@/components/ui/top-loading-bar";
import { useFetchTickets } from "@/hooks/tickets/use-fetch-tickets";
import { useFetchUsers } from "@/hooks/users/use-fetch-users";

export function TicketList() {
  const { data: tickets, isLoading, error } = useFetchTickets();
  const { usersMap, data: users, isLoading: isLoadingUsers, error: usersError } = useFetchUsers();
  const setTickets = useSetTickets();
  const filteredAndSortedTickets = useFilteredAndSortedTickets(usersMap);
  const searchTerm = useSearchTerm();
  const statusFilter = useStatusFilter();
  const assigneeFilter = useAssigneeFilter();
  const selectedTicketIndex = useSelectedTicketIndex();

  useEffect(() => {
    if (!tickets.length) return;

    setTickets(tickets);
  }, [tickets, setTickets]);

  if (error || usersError) {
    toast.error("Error during fetching data");

    return null;
  }

  return (
    <>
      <TopLoadingBar isLoading={isLoading || isLoadingUsers} />
      <aside
        className="bg-card flex h-full w-96 flex-col border-r"
        role="complementary"
        aria-label="Ticket list sidebar"
      >
        <TicketsListHeader
          isLoading={isLoading}
          tickets={tickets}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          users={users ?? []}
          filteredAndSortedTickets={filteredAndSortedTickets}
          assigneeFilter={assigneeFilter}
        />
        <VirtulisedTicketList
          usersMap={usersMap}
          filteredAndSortedTickets={filteredAndSortedTickets}
          selectedIndex={selectedTicketIndex}
        />
      </aside>
    </>
  );
}
