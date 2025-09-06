import { useMemo } from "react";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

import type { TicketStatusT, TicketT } from "@/schemas/tickets.schema";
import type { UserT } from "@/schemas/user.schemas";

export interface TicketsStoreState {
  // Filtered Data
  tickets: TicketT[];

  // Filters
  searchTerm: string;
  statusFilter: TicketStatusT;
  assigneeFilter: string;
  selectedTicketIndex: number | null;

  // Dialogs
  createTicketDialogOpen: boolean;
  deleteTicketDialogOpen: boolean;

  // Actions
  setSearchTerm: (term: string) => void;
  setTickets: (tickets: TicketT[]) => void;
  setStatusFilter: (status: TicketStatusT) => void;
  setAssigneeFilter: (assignee: string) => void;
  setSelectedTicketIndex: (index: number) => void;
  resetFilters: () => void;
  setCreateTicketDialogOpen: (open: boolean) => void;
  setDeleteTicketDialogOpen: (open: boolean) => void;
}

export const useTicketsStore = create<TicketsStoreState>()(
  subscribeWithSelector((set) => ({
    tickets: [],
    searchTerm: "",
    statusFilter: "all",
    assigneeFilter: "all",
    selectedTicketIndex: null,
    createTicketDialogOpen: false,
    deleteTicketDialogOpen: false,

    setCreateTicketDialogOpen: (open: boolean) => set({ createTicketDialogOpen: open }),
    setDeleteTicketDialogOpen: (open: boolean) => set({ deleteTicketDialogOpen: open }),
    setSearchTerm: (term: string) => set({ searchTerm: term }),
    setStatusFilter: (status: TicketT["status"]) => set({ statusFilter: status }),
    setAssigneeFilter: (assignee: string) => set({ assigneeFilter: assignee }),
    setSelectedTicketIndex: (index: number) => set({ selectedTicketIndex: index }),
    setTickets: (tickets: TicketT[]) => set({ tickets }),
    resetFilters: () =>
      set({
        searchTerm: "",
        statusFilter: "all",
        assigneeFilter: "all",
        selectedTicketIndex: 0,
      }),
  })),
);

// Individual selectors
export const useTickets = () => useTicketsStore((state) => state.tickets);
export const useSearchTerm = () => useTicketsStore((state) => state.searchTerm);
export const useStatusFilter = () => useTicketsStore((state) => state.statusFilter);
export const useAssigneeFilter = () => useTicketsStore((state) => state.assigneeFilter);
export const useSelectedTicketIndex = () => useTicketsStore((state) => state.selectedTicketIndex);
export const useCreateTicketDialogOpen = () => useTicketsStore((state) => state.createTicketDialogOpen);
export const useDeleteTicketDialogOpen = () => useTicketsStore((state) => state.deleteTicketDialogOpen);

// Derived selectors
export const useSelectedTicket = (usersMap: Map<number, UserT>) => {
  const filteredTickets = useFilteredAndSortedTickets(usersMap);
  const selectedIndex = useSelectedTicketIndex();

  if (selectedIndex === null) return null;

  return filteredTickets[selectedIndex];
};

export const useTicketFilters = () =>
  useTicketsStore((state) => ({
    searchTerm: state.searchTerm,
    statusFilter: state.statusFilter,
    assigneeFilter: state.assigneeFilter,
  }));

// Individual action hooks
export const useSetCreateTicketDialogOpen = () => useTicketsStore((state) => state.setCreateTicketDialogOpen);
export const useSetDeleteTicketDialogOpen = () => useTicketsStore((state) => state.setDeleteTicketDialogOpen);
export const useSetSearchTerm = () => useTicketsStore((state) => state.setSearchTerm);
export const useSetStatusFilter = () => useTicketsStore((state) => state.setStatusFilter);
export const useSetAssigneeFilter = () => useTicketsStore((state) => state.setAssigneeFilter);
export const useSetSelectedTicketIndex = () => useTicketsStore((state) => state.setSelectedTicketIndex);
export const useSetTickets = () => useTicketsStore((state) => state.setTickets);
export const useResetFilters = () => useTicketsStore((state) => state.resetFilters);

// Computed selectors (derived state)
export const useFilteredAndSortedTickets = (usersMap: Map<number, UserT>) => {
  const tickets = useTickets();
  const searchTerm = useSearchTerm();
  const statusFilter = useStatusFilter();
  const assigneeFilter = useAssigneeFilter();

  return useMemo(() => {
    if (!tickets.length) return [];

    let filtered = tickets;

    if (statusFilter !== "all") {
      filtered = filtered.filter((ticket) => ticket.status === statusFilter);
    }

    if (assigneeFilter !== "all") {
      if (assigneeFilter === "unassigned") {
        filtered = filtered.filter((ticket) => !ticket.assigneeId);
      } else {
        filtered = filtered.filter((ticket) => ticket.assigneeId?.toString() === assigneeFilter);
      }
    }

    if (searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((ticket) => {
        const matchesTicket =
          ticket.title.toLowerCase().includes(lowerSearchTerm) ||
          ticket.body.toLowerCase().includes(lowerSearchTerm) ||
          ticket.id.toString().includes(lowerSearchTerm) ||
          `#${ticket.id}`.includes(lowerSearchTerm) ||
          ticket.status.toLowerCase().includes(lowerSearchTerm);

        const author = usersMap?.get(ticket?.userId);
        const matchesAuthor = author?.name.toLowerCase().includes(lowerSearchTerm) || false;

        return matchesTicket || matchesAuthor;
      });
    }

    // Sort by updated date (newest first)
    return filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [tickets, usersMap, searchTerm, statusFilter, assigneeFilter]);
};
