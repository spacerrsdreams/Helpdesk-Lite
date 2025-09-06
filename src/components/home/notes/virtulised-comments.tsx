import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

import type { NoteT } from "@/schemas/notes.schema";
import { NoteItem } from "@/components/home/notes/note-item";

interface VirtulisedCommentsProps {
  notes: NoteT[];
}

export function VirtulisedComments({ notes }: VirtulisedCommentsProps) {
  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: notes.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120,
    measureElement: (element) => element?.getBoundingClientRect().height,
  });

  return (
    <section className="min-h-0 flex-1">
      <div ref={parentRef} className="max-h-96 overflow-auto">
        <div className="relative w-full" style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
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
              <NoteItem note={notes[virtualItem.index]} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
