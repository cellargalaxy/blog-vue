<template>
    <h2 :id="id">
        <NuxtLink :href="`#${id}`">
            <Icon name="solar:hashtag-circle-line-duotone"/>
            <slot/>
        </NuxtLink>
    </h2>
</template>

<script setup lang="ts">
defineProps({
    id: {
        type: String,
        default: ''
    },
})
</script>

<style lang="postcss" scoped>
h2 {
    @apply text-2xl;
    @apply my-2;
}
</style>