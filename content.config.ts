import { defineContentConfig, defineCollection, z } from '@nuxt/content';

const articleSchema = z.object({
  title: z.string().min(3).max(100),
  date: z.date(),
  draft: z.boolean().default(false),
  tags: z.array(z.string()),
  slug: z.string(),
  navigation: z.boolean().default(false),
  competence: z.array(z.string()),
  excerpt: z.object({
    type: z.string(),
    children: z.any()
  })
});

export default defineContentConfig({
  collections: {
    static: defineCollection({
      type: 'page',
      source: 'static/**/*.md'
    }),
    articles_bg: defineCollection({
      type: 'page',
      source: {
        include: 'articles/bg/**',
        prefix: ''
      },
      schema: articleSchema
    }),
    articles_en: defineCollection({
      type: 'page',
      source: {
        include: 'articles/en/**',
        prefix: ''
      },
      schema: articleSchema
    })
  }
});
