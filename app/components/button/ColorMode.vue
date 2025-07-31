<script setup lang="ts">
const { t } = useI18n();
const colorMode = useColorMode();

const isDark = computed({
  get() {
    return colorMode.value === 'dark';
  },
  set(_isDark) {
    colorMode.preference = _isDark ? 'dark' : 'light';
  }
});
</script>

<template>
  <ClientOnly v-if="!colorMode?.forced">
    <UButton :icon="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'"
             @click="isDark = !isDark"
             :aria-label="t('BTN_THEME_SWITCH')"
             color="neutral"
             variant="ghost" />

    <template #fallback>
      <div class="size-8" />
    </template>
  </ClientOnly>
</template>