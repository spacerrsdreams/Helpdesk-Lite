import type { TicketStatusT } from "@/schemas/tickets.schema";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle, Circle } from "@/components/icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StatusSelectProps {
  value: TicketStatusT;
  onChange: (status: TicketStatusT) => void;
  disabled?: boolean;
}

const statusConfig: Record<
  Exclude<TicketStatusT, "all">,
  { label: string; icon: React.ElementType; color: string; bgColor: string }
> = {
  open: {
    label: "Open",
    icon: Circle,
    color: "text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
  },
  ack: {
    label: "Acknowledged",
    icon: AlertCircle,
    color: "text-yellow-500",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
  },
  resolved: {
    label: "Resolved",
    icon: CheckCircle,
    color: "text-green-500",
    bgColor: "bg-green-100 dark:bg-green-900/20",
  },
};

export function StatusSelect({ value, onChange, disabled }: StatusSelectProps) {
  const currentStatus = statusConfig[value as keyof typeof statusConfig];
  const StatusIcon = currentStatus?.icon;

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-40">
        <SelectValue>
          <div className="flex items-center gap-2">
            <StatusIcon className={cn("h-4 w-4", currentStatus.color)} />
            <span>{currentStatus.label}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(statusConfig).map(([status, config]) => {
          const Icon = config.icon;
          return (
            <SelectItem key={status} value={status}>
              <div className="flex items-center gap-2">
                <Icon className={cn("h-4 w-4", config.color)} />
                <span>{config.label}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
