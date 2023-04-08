<template>
    <div class="scrub">
        <slot/>
    </div>
</template>

<scrub></scrub>

<style lang="postcss" scoped>
.scrub {
    @apply w-full;
    @apply h-full;
    @apply backdrop-blur;
    @apply bg-gray-500/50;
}
</style>