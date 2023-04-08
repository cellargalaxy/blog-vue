<template>
    <h2 :id="id">
        <NuxtLink :href="`#${id}`">
            <Icon name="line-md:hash-small"/>
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
    @apply text-4xl;
}
</style>