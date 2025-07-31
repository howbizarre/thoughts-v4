<script setup lang="ts">
const { t, locale, locales } = useI18n();
const availableLocales = computed(() => (locales.value).filter(i => i.code !== locale.value));

const switchLocalePath = useSwitchLocalePath();

watch(locale, () => useHead({ htmlAttrs: { lang: locale.value } }));
</script>

<template>
  <template v-for="locale in availableLocales" :key="locale.code">
    <UButton :to="switchLocalePath(locale.code)"
             :aria-label="t('BTN_LANG_SWITCH')"
             icon="i-heroicons-language"
             size="md"
             color="neutral"
             variant="ghost">
      {{ locale.name }}
    </UButton>
  </template>
</template>