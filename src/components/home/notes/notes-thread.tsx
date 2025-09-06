import { useMemo } from "react";

import { NoteComposer } from "@/components/home/notes/note-composer";
import { VirtulisedComments } from "@/components/home/notes/virtulised-comments";
import { MessageSquare, RefreshCw } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TopLoadingBar } from "@/components/ui/top-loading-bar";
import { useCreateNote } from "@/hooks/notes/use-create-note";
import { useFetchNotes } from "@/hooks/notes/use-fetch-notes";

interface NotesThreadProps {
  ticketId: number;
}

export function NotesThread({ ticketId }: NotesThreadProps) {
  const { data: notes, isLoading, error, refetch } = useFetchNotes();
  const { mutateAsync: createNote, isPending: isCreating } = useCreateNote();

  const sortedNotes = useMemo(() => {
    if (!notes) return [];

    // Sort by createdAt date - newest first
    return [...notes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [notes]);

  const handleCreateNote = async (content: string) => {
    await createNote({ postId: ticketId, name: "Anonymous", email: "anonymous@example.com", body: content });
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Failed to load notes</p>
            <Button onClick={() => refetch()} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <TopLoadingBar isLoading={isLoading} />

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="h-5 w-5" />
              Notes ({sortedNotes.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {sortedNotes.length === 0 ? (
            <div className="py-8 text-center">
              <MessageSquare className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <p className="text-muted-foreground mb-2">No notes yet</p>
              <p className="text-muted-foreground text-sm">Be the first to add a note to this ticket.</p>
            </div>
          ) : (
            <VirtulisedComments notes={sortedNotes} />
          )}
        </CardContent>
      </Card>

      <NoteComposer onSubmit={handleCreateNote} isSubmitting={isCreating} />
    </div>
  );
}
