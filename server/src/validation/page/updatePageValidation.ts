import { z } from 'zod';

export const updatePageValidation = z.object({
  title: z.string().max(255).optional(),
  slug: z.string().max(255).optional(),
  isHomePage: z.boolean().optional(),
  order: z.number().optional(),
  sections: z
    .array(
      z.object({
        id: z.string(),
        type: z.string(),
        settings: z.any().optional(),
        styles: z.any().optional(),
        disabled: z.boolean().optional(),
      }),
    )
    .optional(),
  metaTitle: z.string().max(255).optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  typography: z
    .object({
      fontFamily: z.string().optional(),
      headingFont: z.string().optional(),
      baseFontSize: z.number().optional(),
      headingFontFamily: z.string().optional(),
      headingFontWeight: z.string().optional(),
      headingFontSize: z.string().optional(),
      headingLineHeight: z.string().optional(),
      paragraphFontFamily: z.string().optional(),
      paragraphFontWeight: z.string().optional(),
      paragraphFontSize: z.string().optional(),
      paragraphLineHeight: z.string().optional(),
    })
    .optional()
    .nullable(),
  status: z.enum(['draft', 'published']).optional(),
});
