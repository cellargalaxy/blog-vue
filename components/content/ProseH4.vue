<template>
    <h4 :id="id">
        <NuxtLink :href="`#${id}`">
            <Icon name="solar:hashtag-circle-line-duotone"/>
            <slot/>
        </NuxtLink>
    </h4>
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
h4 {
    @apply text-xl;
    @apply my-2;
}
</style>