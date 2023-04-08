<template>
    <div class="img-auto" :style="{backgroundImage:'url('+url+')'}"/>
</template>

<img-auto url="url"/>

<script setup lang="ts">
defineProps({
    url: {
        type: String,
        default: ''
    }
})
</script>

<style lang="postcss" scoped>
.img-auto {
    @apply w-full;
    @apply h-full;
    @apply bg-no-repeat;
    @apply bg-cover;
    @apply bg-center;
    @apply bg-scroll;
}
</style>