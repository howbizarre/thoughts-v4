<template>
  <UContainer class="p-2 md:px-0">
    <LayoutLogos />
    <LayoutHeader />

    <main class="max-w-3xl mx-auto content">
      <slot />
    </main>

    <LayoutFooter />
  </UContainer>
</template>