<template>
    <nuxt-img :src="src" loading="lazy" class="my-2"/>
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
