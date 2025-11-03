import { defineCollection, z } from 'astro:content';

const pagesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    locale: z.enum(['lt', 'en', 'ru']),
    publishDate: z.date().optional(),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = {
  pages: pagesCollection,
};
