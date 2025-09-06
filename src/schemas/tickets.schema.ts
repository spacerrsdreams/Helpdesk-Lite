import * as z from "zod";

export type TicketStatusT = "open" | "ack" | "resolved" | "all";

export interface PostT {
  id: number;
  title: string;
  body: string;
  userId: number;
  manuallyGenerated?: {
    createdAt?: Date;
    updatedAt?: Date;
    status?: TicketStatusT;
  };
}

export interface TicketT extends PostT {
  status: TicketStatusT;
  assigneeId?: number | null;
  updatedAt: Date;
  createdAt: Date;
}

export const createTicketSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters")
    .trim(),
  body: z
    .string()
    .min(1, "Description is required")
    .min(1, "Description must be at least 1 characters")
    .max(1000, "Description must be less than 1000 characters")
    .trim(),
  assigneeId: z.number().optional(),
});

export const updateTicketSchema = createTicketSchema.extend({
  status: z.enum(["open", "ack", "resolved"]),
});

export type CreateTicketFormDataT = z.infer<typeof createTicketSchema>;
export type UpdateTicketFormDataT = z.infer<typeof updateTicketSchema>;
