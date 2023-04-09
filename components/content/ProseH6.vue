<template>
    <h6 :id="id">
        <NuxtLink :href="`#${id}`">
            <Icon name="solar:hashtag-circle-line-duotone"/>
            <slot/>
        </NuxtLink>
    </h6>
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
h6 {
    @apply text-lg;
    @apply my-2;
}
</style>