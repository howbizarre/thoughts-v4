<script setup lang="ts">
const localePath = useLocalePath();
const path = computed(() => localePath('/'));
const logo = ref<HTMLElement | null>(null);

const route = useRoute();
const isHomePage = ref(((route.path).split("/")).length === 2)

watch(() => route.path, (newPath) => {
  if ((newPath.split("/")).length === 2) {
    isHomePage.value = true;
  } else {
    isHomePage.value = false;
  }
});

function doRound() {
  logo.value?.addEventListener('mouseover', function rotateImage(event: MouseEvent) {
    const target = event.target as HTMLElement;

    target?.classList.add('rotate');
    target?.removeEventListener('mouseover', rotateImage);
  });
}

onMounted(() => doRound());
</script>

<template>
  <div class="max-w-3xl mx-auto my-4 px-1 sm:flex sm:justify-between leading-5 z-0">
    <div class="flex justify-center sm:justify-start">
      <NuxtLink :to="path" title="HB's Thoughts">
        <img ref="logo" src="/images/logo.svg" alt="HB's Thoughts" class="size-12 rounded-full scale-95" />
      </NuxtLink>

      <div class="ml-3">
        <h1 v-if="isHomePage" class="text-2xl font-medium">
          HB's Thoughts
        </h1>

        <div v-else class="hN text-2xl font-medium">
          <NuxtLink :to="path" title="HB's Thoughts">
            HB's Thoughts
          </NuxtLink>
        </div>

        <p class="text-gray-500">If the Universe Is the Answer, What Is the Question?!</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rotate {
  @apply rotate-[360deg] transition-transform	duration-500;
}

.rotate:hover {
  @apply scale-100;
}
</style>