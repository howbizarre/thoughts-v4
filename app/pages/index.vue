<script lang="ts" setup>
const { locale } = useI18n();

// Ensure locale is reactive and available on both server and client
const currentLocale = computed(() => locale.value || 'bg');

const { data: articles, pending, error } = await useAsyncData(
  `articles-${currentLocale.value}`, 
  async () => {    
    try {
      const collectionName = `articles_${currentLocale.value}` as 'articles_bg' | 'articles_en';      
      const result = await queryCollection(collectionName)
        .order('date', 'DESC')
        .limit(3)
        .all();
      
      return result || [];        
    } catch (error) {
      console.error('Error fetching articles:', error);
      return [];
    }
  },
  { 
    watch: [currentLocale],
    server: true, // Ensure it runs on server
    default: () => [], // Provide default value
    lazy: false, // Force immediate execution
    transform: (data) => {
      console.log('Transform called with data:', data);
      return Array.isArray(data) ? data : [];
    }
  }
);

const description = {
  "bg": "Статии, предимно за Vue, Nuxt, TailwindCSS, TypeScript, но не само. Повече за front-end и по-малко за back-end.",
  "en": "Articles mostly about Vue, Nuxt, TailwindCSS, and TypeScript, but not limited to — more on the front-end and less on the back-end."
};

useHead({
  title: "",
  meta: [{ name: 'description', content: description[(currentLocale.value as 'bg' | 'en')] }]
});
</script>

<template>
  <div class="content">    
    <!-- Loading state -->
    <div v-if="pending" class="text-center text-gray-500">
      {{ currentLocale === 'bg' ? 'Зареждане на статии...' : 'Loading articles...' }}
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="text-center text-red-500">
      {{ currentLocale === 'bg' ? 'Грешка при зареждане на статии.' : 'Error loading articles.' }}
    </div>
    
    <!-- Articles content -->
    <template v-else-if="articles && Array.isArray(articles) && articles.length > 0">
      <template v-for="(article, index) in articles" :key="article.path || article.slug || `article-${index}`">
        <h2>{{ article.title }}</h2>
        <ContentRenderer v-if="article.excerpt" :value="article.excerpt" />
      </template>
    </template>
    
    <!-- No articles fallback -->
    <template v-else>
      <div class="text-center text-gray-500">
        {{ currentLocale === 'bg' ? 'Няма статии за показване.' : 'No articles to display.' }}
      </div>
    </template>
  </div>
</template>