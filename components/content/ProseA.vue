<template>
    <NuxtLink :to="href" :target="target">
        <slot/>
    </NuxtLink>
</template>

<script setup lang="ts">
defineProps({
    href: {
        type: String,
        default: ''
    },
    target: {
        type: String,
        default: undefined,
        required: false
    }
})
</script>

<style scoped>
a {
    background-color: #0047e1;
}
</style>
