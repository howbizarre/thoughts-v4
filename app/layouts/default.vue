<template>
  <div class="min-h-screen flex flex-col">
    <UContainer class="flex-1 flex flex-col">

      <main class="flex-1">
        <slot />
      </main>

      <LayoutFooter />
    </UContainer>
  </div>
</template>