import type React from "react";

import type { TicketT } from "@/schemas/tickets.schema";
import type { UserT } from "@/schemas/user.schemas";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle, Circle, User } from "@/components/icons";

interface TicketItemProps {
  ticket: TicketT;
  author?: UserT;
  isSelected: boolean;
  onClick: () => void;
  style?: React.CSSProperties;
}

const statusIcons = {
  open: Circle,
  ack: AlertCircle,
  resolved: CheckCircle,
};

const statusColors = {
  open: "text-blue-500",
  ack: "text-yellow-500",
  resolved: "text-green-500",
};

export function TicketItem({ ticket, author, isSelected, onClick, style }: TicketItemProps) {
  const StatusIcon = statusIcons[ticket.status as keyof typeof statusIcons];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const formattedDate = formatDate(ticket.updatedAt.toISOString());

  return (
    <div
      id={`ticket-${ticket.id}`}
      style={style}
      className={cn(
        "hover:bg-accent/50 cursor-pointer border-b p-3 transition-colors",
        "focus:bg-accent focus:ring-ring focus:ring-2 focus:outline-none focus:ring-inset",
        isSelected && "bg-accent border-l-primary border-l-4",
      )}
      onClick={onClick}
      tabIndex={-1}
      role="option"
      aria-selected={isSelected}
      aria-label={`Ticket ${ticket.id}: ${ticket.title}, Status: ${ticket.status}, Updated: ${formattedDate}`}
    >
      <div className="flex items-start gap-3">
        <StatusIcon
          className={cn("mt-0.5 h-4 w-4 flex-shrink-0", statusColors[ticket.status as keyof typeof statusColors])}
          aria-hidden="true"
        />

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center justify-between">
            <h3 className="truncate pr-2 text-sm font-medium">{ticket.title}</h3>
            <span className="text-muted-foreground flex-shrink-0 text-xs">{formattedDate}</span>
          </div>

          <p className="text-muted-foreground mb-2 line-clamp-2 text-xs">{ticket.body}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-medium",
                  ticket.status === "open" && "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
                  ticket.status === "ack" && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
                  ticket.status === "resolved" &&
                    "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
                )}
              >
                {ticket.status}
              </span>
            </div>

            {author && (
              <div className="text-muted-foreground flex items-center gap-1 text-xs">
                <User className="h-3 w-3" aria-hidden="true" />
                <span className="max-w-20 truncate">{author.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
