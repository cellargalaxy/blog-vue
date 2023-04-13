<template>
    <div :class="[`highlight-${language}`]" class="code">
        <slot/>
    </div>
</template>

<script setup lang="ts">
import type {PropType} from 'vue'
import type {Lang} from 'shiki-es'

defineProps({
    code: {
        type: String,
        default: ''
    },
    language: {
        type: String as PropType<Lang>,
        default: null
    },
    filename: {
        type: String,
        default: null
    },
})
</script>

<style lang="postcss" scoped>
.code {
    @apply bg-gray-100/50;
    @apply my-2;
    @apply p-2;
    @apply border-2;
    @apply rounded-lg;
    @apply shadow-inner;
}
</style>
