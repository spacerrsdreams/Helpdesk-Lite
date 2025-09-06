import type { TicketStatusT, TicketT } from "@/schemas/tickets.schema";
import type { UserT } from "@/schemas/user.schemas";
import { AssigneeFilter } from "@/components/home/ticket-list/filters/assaignee-filter";
import { SearchFilter } from "@/components/home/ticket-list/filters/search-filter";
import { StatusFilter } from "@/components/home/ticket-list/filters/status-filter";
import { TickerListHeaderAction } from "@/components/home/ticket-list/ticker-list-header-action";
import { Skeleton } from "@/components/ui/skeleton";

interface TicketsListHeaderProps {
  isLoading: boolean;
  searchTerm: string;
  statusFilter: TicketStatusT;
  assigneeFilter: string;
  users: UserT[];
  filteredAndSortedTickets: TicketT[];
  tickets: TicketT[];
}

export function TicketsListHeader({
  isLoading,
  searchTerm,
  statusFilter,
  users,
  assigneeFilter,
  filteredAndSortedTickets,
  tickets,
}: TicketsListHeaderProps) {
  const getTicketCountText = () => {
    const hasActiveFilters = searchTerm.trim() || statusFilter !== "all" || assigneeFilter !== "all";
    const totalTickets = tickets.length ?? 0;
    const filteredCount = filteredAndSortedTickets.length;

    if (hasActiveFilters) {
      return `${filteredCount} of ${totalTickets} tickets`;
    }

    return `${totalTickets} tickets • ${users?.length} users`;
  };

  return (
    <header className="flex-shrink-0 border-b p-4">
      <TickerListHeaderAction />
      <SearchFilter />

      <div className="mb-4 flex gap-2">
        <StatusFilter />
        <AssigneeFilter users={users} />
      </div>

      <p className="text-muted-foreground text-sm" aria-live="polite">
        {isLoading && !filteredAndSortedTickets ? <Skeleton className="h-4 w-24" /> : getTicketCountText()}
      </p>
    </header>
  );
}
