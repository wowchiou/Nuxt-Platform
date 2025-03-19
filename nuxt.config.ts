// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  ssr: false,
  runtimeConfig: {
    // 只在服務端可用
    tdxID: '',
    tdxKey: '',
    weatherAuth: '',
    public: {
      // public中的變數在客戶端和服務端都可用
      supabaseUrl: '',
      supabaseKey: '',
      supabaseProjectId: '',
    },
  },
  modules: [
    '@element-plus/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    '@pinia/nuxt',
    '@nuxtjs/leaflet',
    '@vueuse/nuxt',
  ],
  css: ['~/assets/css/global.css', '~/assets/css/element-plus.css'],
  elementPlus: {
    importStyle: 'css',
  },
});
