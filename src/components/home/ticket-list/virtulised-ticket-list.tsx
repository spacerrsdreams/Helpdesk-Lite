import { useVirtualizer } from "@tanstack/react-virtual";
import { useCallback, useRef } from "react";

import type { TicketT } from "@/schemas/tickets.schema";
import type { UserT } from "@/schemas/user.schemas";
import { useSetSelectedTicketIndex } from "@/stores/tickets.store";
import { TicketItem } from "@/components/home/ticket-list/ticket-item";

interface VirtulisedTicketListProps {
  usersMap: Map<number, UserT>;
  filteredAndSortedTickets: TicketT[];
  selectedIndex: number | null;
}

export function VirtulisedTicketList({ usersMap, filteredAndSortedTickets, selectedIndex }: VirtulisedTicketListProps) {
  const parentRef = useRef(null);
  const setSelectedTicketIndex = useSetSelectedTicketIndex();

  const rowVirtualizer = useVirtualizer({
    count: filteredAndSortedTickets.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120,
    measureElement: (element) => element?.getBoundingClientRect().height,
  });

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (filteredAndSortedTickets.length === 0) return;

      switch (event.key) {
        case "ArrowDown": {
          event.preventDefault();
          event.stopPropagation();
          const nextIndex = Math.min(selectedIndex ?? 0 + 1, filteredAndSortedTickets.length - 1);
          setSelectedTicketIndex(nextIndex);
          rowVirtualizer.scrollToIndex(nextIndex);
          break;
        }
        case "ArrowUp": {
          event.preventDefault();
          event.stopPropagation();

          const prevIndex = Math.max(selectedIndex ?? 0 - 1, 0);

          setSelectedTicketIndex(prevIndex);
          // Scroll to keep selected item visible
          rowVirtualizer.scrollToIndex(prevIndex);
          break;
        }
        case "Enter": {
          event.preventDefault();
          event.stopPropagation();
          setSelectedTicketIndex(selectedIndex ?? 0);
          break;
        }
      }
    },
    [selectedIndex, setSelectedTicketIndex, filteredAndSortedTickets, rowVirtualizer],
  );

  return (
    <section className="min-h-0 flex-1" aria-labelledby="tickets-section-title">
      <h2 id="tickets-section-title" className="sr-only">
        Tickets List
      </h2>
      <div
        ref={parentRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="h-full overflow-auto focus:outline-none"
        role="listbox"
        aria-label="Tickets list"
        aria-activedescendant={
          selectedIndex !== null ? `ticket-${filteredAndSortedTickets[selectedIndex]?.id}` : undefined
        }
      >
        <div className="relative h-full w-full" style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
          {rowVirtualizer.getVirtualItems().map((virtualItem) => (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={rowVirtualizer.measureElement}
              className="absolute top-0 left-0 w-full"
              style={{
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <TicketItem
                ticket={filteredAndSortedTickets[virtualItem.index]}
                author={usersMap.get(filteredAndSortedTickets[virtualItem.index].userId)}
                isSelected={virtualItem.index === selectedIndex}
                onClick={() => {
                  setSelectedTicketIndex?.(virtualItem.index);
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
