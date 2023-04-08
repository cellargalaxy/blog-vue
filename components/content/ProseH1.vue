<template>
    <h1 :id="id">
        <NuxtLink :href="`#${id}`">
            <Icon name="line-md:hash-small"/>
            <slot/>
        </NuxtLink>
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
    @apply text-5xl;
}
</style>