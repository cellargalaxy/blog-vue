<template>
    <h1 :id="id">
        <NuxtLink :href="`#${id}`">
            <Icon name="solar:hashtag-circle-linear"/>
        </NuxtLink>
        <slot/>
    </h1>
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
h1 {
    @apply text-2xl;
    @apply my-2;
}
</style>