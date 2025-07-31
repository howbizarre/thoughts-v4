export default defineNuxtConfig({
  modules: ['nitro-cloudflare-dev'],

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