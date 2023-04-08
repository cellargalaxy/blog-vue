<template>
    <h5 :id="id">
        <NuxtLink :href="`#${id}`">
            <Icon name="line-md:hash-small"/>
            <slot/>
        </NuxtLink>
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
    @apply text-xl;
}
</style>