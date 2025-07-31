<script setup lang="ts">
const i18nHead = useLocaleHead({
  seo: true,
  lang: true,
});

useHead({
  titleTemplate: (titleChunk) => titleChunk ? `${titleChunk} | HB's Thoughts` : "How Bizarre's Thoughts",
  htmlAttrs: {
    lang: i18nHead.value.htmlAttrs!.lang
  },
  link: [...(i18nHead.value.link || [])],
  meta: [...(i18nHead.value.meta || [])]
});
</script>

<template>
  <UApp>
    <NuxtRouteAnnouncer />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>      
  </UApp>
</template>