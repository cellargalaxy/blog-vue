<template>
    <ol>
        <slot/>
    </ol>
</template>

<style lang="postcss" scoped>
ol {
    @apply list-decimal;
    @apply list-inside;
    @apply my-2;
}
</style>
