import * as z from "zod";

export interface CommentT {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

export interface NoteT extends CommentT {
  createdAt: Date;
  manuallyGenerated?: {
    createdAt?: Date;
  };
}

export const createNoteSchema = z.object({
  postId: z.number(),
  name: z.string(),
  email: z.string(),
  body: z.string(),
});

export type CreateNoteFormDataT = z.infer<typeof createNoteSchema>;
