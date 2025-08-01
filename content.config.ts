import { defineContentConfig, defineCollection, z } from '@nuxt/content';

export default defineContentConfig({
  collections: {
    static: defineCollection({
      type: 'page',
      source: 'static/**/*.md'
    }),
    articles: defineCollection({
      type: 'page',
      source: 'articles/**/*.md',
      schema: z.object({
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
      })
    })
  }
});