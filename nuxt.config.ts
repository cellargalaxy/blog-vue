// https://v3.nuxtjs.org/api/configuration/nuxt.config
import highlightjs from 'highlight.js'
export default defineNuxtConfig({
    modules: [
        '@nuxtjs/tailwindcss',
        '@element-plus/nuxt',
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
