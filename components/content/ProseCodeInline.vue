<template>
    <div class="code-in-line">
        <code>
            <slot/>
        </code>
    </div>
</template>

<style lang="postcss" scoped>
.code-in-line {
    @apply bg-gray-100/50;
    @apply px-1;
    @apply rounded;
    @apply w-max;
    /*@apply select-all;*/
}
</style>
<script setup lang="ts">
</script>