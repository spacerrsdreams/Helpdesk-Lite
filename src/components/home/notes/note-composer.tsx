import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

import { Loader2, Send } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface NoteComposerProps {
  onSubmit: (content: string) => Promise<void>;
  isSubmitting?: boolean;
  disabled?: boolean;
}

export function NoteComposer({ onSubmit, isSubmitting = false, disabled = false }: NoteComposerProps) {
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() || isSubmitting) return;

    try {
      await onSubmit(content.trim());
      setContent("");
    } catch {
      toast.error("Failed to add note", {
        description: "There was an error adding your note. Please try again.",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Add Note</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a note to this ticket..."
            className="min-h-20 resize-none"
            disabled={disabled || isSubmitting}
            onKeyDown={handleKeyDown}
          />
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-xs">Press Cmd/Ctrl + Enter to submit</p>
            <Button type="submit" size="sm" disabled={!content.trim() || isSubmitting || disabled}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Add Note
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
