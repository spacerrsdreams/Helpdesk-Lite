import { memo } from "react";

import type { NoteT } from "@/schemas/notes.schema";
import { Clock, User } from "@/components/icons";
import { Card, CardContent } from "@/components/ui/card";

interface NoteItemProps {
  note: NoteT;
}

export const NoteItem = memo(function NoteItem({ note }: NoteItemProps) {
  return (
    <Card className="mb-3 p-3">
      <CardContent className="px-4 py-1">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
              <User className="text-primary h-4 w-4" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-sm font-medium">{note.name}</span>
              <span className="text-muted-foreground text-xs">{note.email}</span>
            </div>

            <p className="text-foreground mb-2 text-sm whitespace-pre-wrap">{note.body}</p>

            <div className="text-muted-foreground flex items-center gap-1 text-xs">
              <Clock className="h-3 w-3" />
              <span>{note.createdAt.toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
