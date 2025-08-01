<script lang="ts" setup>
const { locale } = useI18n();

const { data: articles } = await useLazyAsyncData('articles-' + locale.value, async () => {
  return await queryCollection(`articles_${locale.value}`).order('date', 'DESC').limit(3).all();
}, { watch: [locale] });

const description = {
  "bg": "Статии, предимно за Vue, Nuxt, TailwindCSS, TypeScript, но не само. Повече за front-end и по-малко за back-end.",
  "en": "Articles mostly about Vue, Nuxt, TailwindCSS, and TypeScript, but not limited to — more on the front-end and less on the back-end."
};

useHead({
  title: "",
  meta: [{ name: 'description', content: description[(locale.value as 'bg' | 'en')] }]
});
</script>

<template>
  <div class="content">
    <template v-if="articles">
      <template v-for="article in articles" :key="article.path">
        <h2>{{ article.title }}</h2>
        <ContentRenderer v-if="'excerpt' in article" :value="article.excerpt" />
      </template>
    </template>
  </div>
</template>