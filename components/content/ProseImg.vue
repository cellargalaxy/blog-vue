<template>
    <nuxt-img :src="src" loading="lazy" class="my-1"/>
</template>

<script setup lang="ts">
defineProps({
    src: {
        type: String,
        default: '',
        required: true,
    },
})
</script>

<style lang="postcss" scoped>
</style>
