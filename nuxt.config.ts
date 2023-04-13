// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    modules: [
        '@nuxtjs/tailwindcss',
        '@nuxt/content',
        'nuxt-icon',
        '@nuxt/image-edge',
    ],
    content: {
        highlight: {
            preload: [
                'cpp',
                'go',
                'ini',
                'java',
                'sql',
                'vue',
            ],
            theme: {
                dark: 'github-dark',
                default: 'github-light'
            }
        },
    },
})
