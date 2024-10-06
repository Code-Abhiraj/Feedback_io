import { z } from 'zod';

// Update the message schema for Zod validation
export const messageSchema = z.object({
  content: z
    .string()
    .min(10, { message: 'Content must be at least 10 characters.' })
    .max(300, { message: 'Content must not be longer than 300 characters.' }),
  senderName: z.string().optional(),
  stars: z.string().min(1).max(5).optional(),
});
