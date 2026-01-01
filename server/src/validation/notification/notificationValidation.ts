import { z } from 'zod';

export const notificationValidationSchema = z.object({
  userId: z.number({
    required_error: 'User is required',
  }),
  title: z.string({
    required_error: 'Title is required',
  }),
  offerUrl: z.string().url().optional(),
  type: z.string({
    required_error: 'Type is required',
  }),
  message: z.string({
    required_error: 'Message is required',
  }),
  isRead: z.boolean().optional(),
});
