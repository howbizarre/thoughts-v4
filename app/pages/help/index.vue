<script lang="ts" setup>
const { t, locale } = useI18n();

const { data: help } = await useAsyncData(() => queryCollection('static').path(`/static/${locale.value}/help`).first())

const title = {
  "bg": "Как да се ориентирам",
  "en": "How to navigate"
};

const description = {
  "bg": "Статии, предимно за Vue, Nuxt, TailwindCSS, TypeScript, но не само. Повече за front-end и по-малко за back-end.",
  "en": "Articles mostly about Vue, Nuxt, TailwindCSS, and TypeScript, but not limited to — more on the front-end and less on the back-end."
};

useHead({
  title: title[(locale.value as 'bg' | 'en')],
  meta: [{ name: 'description', content: description[(locale.value as 'bg' | 'en')] }]
});
</script>

<template>
  <div>
    <h1>{{ t('LBL_INFO') }}</h1>

    <ContentRenderer v-if="help" :value="help" />
    <div v-else>Home not found</div>
  </div>
</template>