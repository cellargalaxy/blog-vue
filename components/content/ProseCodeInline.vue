<template>
    <code class="code-in-line">
        <slot/>
    </code>
</template>

<style lang="postcss" scoped>
.code-in-line {
    @apply bg-gray-100/50;
    @apply px-1;
    @apply rounded;
    /*@apply w-max;*/
    /*@apply select-all;*/
}
</style>
<script setup lang="ts">
</script>