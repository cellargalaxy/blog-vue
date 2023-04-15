<template>
    <NuxtLink :to="href" :target="target">
        <slot/>
    </NuxtLink>
</template>

<script setup lang="ts">
defineProps({
    href: {
        type: String,
        default: ''
    },
    target: {
        type: String,
        default: undefined,
        required: false
    }
})
</script>

<style lang="postcss" scoped>
a {
    @apply text-blue-500;
    @apply hover:underline;
    @apply break-words;
}
</style>
