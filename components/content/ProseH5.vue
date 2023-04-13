<template>
    <h5 :id="id">
        <NuxtLink :href="`#${id}`">
            <Icon name="solar:hashtag-circle-linear"/>
        </NuxtLink>
        <slot/>
    </h5>
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
h5 {
    @apply text-lg;
    @apply my-2;
}
</style>