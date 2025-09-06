import type { TicketStatusT } from "@/schemas/tickets.schema";
import { useSetStatusFilter, useStatusFilter } from "@/stores/tickets.store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const StatusOptions: { label: string; value: TicketStatusT }[] = [
  { label: "All Status", value: "all" },
  { label: "Open", value: "open" },
  { label: "Acknowledged", value: "ack" },
  { label: "Resolved", value: "resolved" },
];

export function StatusFilter() {
  const statusFilter = useStatusFilter();
  const setStatusFilter = useSetStatusFilter();

  return (
    <Select value={statusFilter} onValueChange={setStatusFilter}>
      <SelectTrigger className="h-8 flex-1 text-xs" aria-label="Filter by ticket status">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        {StatusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
