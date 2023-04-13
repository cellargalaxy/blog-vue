<template>
    <h3 :id="id">
        <NuxtLink :href="`#${id}`">
            <Icon name="solar:hashtag-circle-linear"/>
        </NuxtLink>
        <slot/>
    </h3>
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
h3 {
    @apply text-xl;
    @apply my-2;
}
</style>