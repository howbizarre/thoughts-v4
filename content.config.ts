import { defineContentConfig, defineCollection, z } from '@nuxt/content';

export default defineContentConfig({
  collections: {
    static: defineCollection({
      type: 'page',
      source: 'static/**/*.md'
    })
  }
});