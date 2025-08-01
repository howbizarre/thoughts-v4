export default defineNuxtConfig({
  app: {
    baseURL: '/',
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'preload', as: 'style', onload: "this.onload = null; this.rel = 'stylesheet';", href: 'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap' }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  modules: ['nitro-cloudflare-dev', '@nuxt/ui', '@nuxtjs/i18n', '@nuxt/content'],

  css: ['~/assets/css/main.css'],

  nitro: {
    preset: 'cloudflare_module',

    cloudflare: {
      deployConfig: true,
      nodeCompat: true
    },

    prerender: {
      crawlLinks: true
    },

    serverAssets: [
      {
        baseName: 'content',
        dir: 'content'
      }
    ]
  },

  vite: {
    css: { devSourcemap: true },
    build: { sourcemap: false }
  },

  i18n: {
    locales: [
      {
        code: 'en',
        language: 'en',
        name: 'EN',
        file: 'locales/en-US.json'
      },
      {
        code: 'bg',
        language: 'bg',
        name: 'БГ',
        file: 'locales/bg-BG.json'
      }
    ],
    baseUrl: 'https://photostudionana.com',
    langDir: './',
    defaultLocale: 'bg',
    vueI18n: './i18n.config.ts',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    },
    strategy: 'prefix',
    experimental: {
      localeDetector: 'localeDetector.ts'
    }
  },

  content: {
    database: {
      type: 'd1',
      bindingName: 'hbs_thoughts_data'
    },
    build: {
      markdown: {
        highlight: {
          theme: {
            default: 'github-light',
            dark: 'github-dark'
          }
        }
      }
    }
  },

  ssr: true,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  // Add experimental options for better Cloudflare compatibility
  experimental: {
    payloadExtraction: false, // Disable payload extraction for Cloudflare
    watcher: 'chokidar' // Use chokidar for file watching
  }
});
