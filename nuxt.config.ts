export default defineNuxtConfig({
  modules: ['nitro-cloudflare-dev', '@nuxt/ui'],

  css: ['~/assets/css/main.css'],

  nitro: {
    preset: 'cloudflare_module',

    cloudflare: {
      deployConfig: true,
      nodeCompat: true
    }
  },

  ssr: true,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false }
});