import type { UserT } from "@/schemas/user.schemas";
import { useAssigneeFilter, useSetAssigneeFilter } from "@/stores/tickets.store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AssigneeOptions: { label: string; value: string }[] = [
  { label: "All Assignees", value: "all" },
  { label: "Unassigned", value: "unassigned" },
];

interface AssigneeFilterProps {
  users: UserT[];
}

export function AssigneeFilter({ users }: AssigneeFilterProps) {
  const assigneeFilter = useAssigneeFilter();
  const setAssigneeFilter = useSetAssigneeFilter();

  return (
    <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
      <SelectTrigger className="h-8 flex-1 text-xs" aria-label="Filter by ticket assignee">
        <SelectValue placeholder="Assignee" />
      </SelectTrigger>
      <SelectContent>
        {AssigneeOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
        {users?.map((user) => (
          <SelectItem key={user.id} value={user.id.toString()}>
            {user.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
