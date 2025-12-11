import { z } from 'zod';

export const updateCurrencyValidationSchema = z.object({
  name: z.string({
    required_error: 'name is required',
  }),
  symbol: z.string({
    required_error: 'symbol is required',
  }),
  exchangeRate: z.number({
    required_error: 'exchangeRate is required',
  }),
});
