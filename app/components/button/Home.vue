<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();
</script>

<template>
  <NuxtLink :to="localePath('/')"
            :active-class="'nav-link-active'"
            role="button"
            class="flex items-center justify-center rounded-xl p-2 text-sm font-medium transition-colors duration-150 ease-in hover:bg-gray-100 dark:hover:bg-gray-800">
    <UIcon name="i-heroicons-home" class="size-5" />
  </NuxtLink>
</template>