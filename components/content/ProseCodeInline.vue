<template>
    <code>
        <slot/>
    </code>
</template>

<style lang="postcss" scoped>
code {
    @apply bg-red-300/50;
    @apply px-1;
    @apply rounded;
    @apply select-all;
}
</style>
