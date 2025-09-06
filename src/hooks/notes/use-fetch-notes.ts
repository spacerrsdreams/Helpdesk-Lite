import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import type { NoteT } from "@/schemas/notes.schema";
import { apiRequest, ApiRoutes } from "@/lib/api";
import { getWithInDays } from "@/lib/utils";

export const UseFetchNotesQueryKey = "fetch-notes";

export function useFetchNotes() {
  const { data, ...rest } = useQuery({
    queryKey: [UseFetchNotesQueryKey],
    queryFn: () => apiRequest<NoteT[]>(ApiRoutes.notes.getAll),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const modifiedData = useMemo(() => {
    return data?.map((note) => {
      const createdAt = note?.manuallyGenerated?.createdAt
        ? new Date(note.manuallyGenerated.createdAt)
        : getWithInDays(30);

      return {
        ...note,
        createdAt,
      };
    });
  }, [data]);

  return {
    data: modifiedData,
    ...rest,
  };
}
