<template>
    <ul>
        <slot/>
    </ul>
</template>

<style lang="postcss" scoped>
ul {
    @apply list-disc;
    @apply list-inside;
    @apply my-2;
}
</style>
