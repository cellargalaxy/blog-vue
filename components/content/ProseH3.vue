<template>
    <h3 :id="id">
        <NuxtLink :href="`#${id}`">
            <Icon name="line-md:hash-small"/>
            <slot/>
        </NuxtLink>
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
    @apply text-3xl;
}
</style>