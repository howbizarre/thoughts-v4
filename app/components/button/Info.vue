<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();
</script>

<template>
  <NuxtLink :to="localePath('/info')"
            :active-class="'nav-link-active'"
            role="button"
            class="flex items-center justify-center rounded-xl py-2 px-4 text-sm font-medium transition-colors duration-150 ease-in hover:bg-gray-100 dark:hover:bg-gray-800">
    {{ t('LBL_INFO') }}
  </NuxtLink>
</template>