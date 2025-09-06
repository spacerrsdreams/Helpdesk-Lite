import { JSON_PLACEHOLDER_MAX_TICKETS } from "@/constants";
import { useMutation } from "@tanstack/react-query";

import type { CreateNoteFormDataT, NoteT } from "@/schemas/notes.schema";
import { queryClient } from "@/providers/query-client.provider";
import { apiRequest, ApiRoutes } from "@/lib/api";
import { UseFetchNotesQueryKey } from "@/hooks/notes/use-fetch-notes";

export const UseCreateNoteQueryKey = "create-note";

export function useCreateNote() {
  return useMutation({
    mutationKey: [UseCreateNoteQueryKey],
    mutationFn: (note: CreateNoteFormDataT) => {
      //! Check constants.ts for more info.
      if (note.postId > JSON_PLACEHOLDER_MAX_TICKETS) {
        return Promise.resolve(note);
      }

      return apiRequest<NoteT>(ApiRoutes.notes.create, { method: "POST", body: JSON.stringify(note) });
    },
    onMutate: async (note) => {
      await queryClient.cancelQueries({ queryKey: [UseFetchNotesQueryKey] });
      const previousNotes = queryClient.getQueryData([UseFetchNotesQueryKey]);
      queryClient.setQueryData([UseFetchNotesQueryKey], (old: NoteT[]) => [
        ...old,
        { ...note, manuallyGenerated: { createdAt: new Date() } },
      ]);
      return { previousNotes };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData([UseFetchNotesQueryKey], context?.previousNotes);
    },
    onSettled: () => {
      //   queryClient.invalidateQueries({ queryKey: [UseFetchNotesQueryKey] });
    },
  });
}
