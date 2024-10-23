import { z } from "zod";

export const todoSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().optional(),
});

export type TodoFormData = z.infer<typeof todoSchema>;
