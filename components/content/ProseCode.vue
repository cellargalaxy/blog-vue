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
    highlights: {
        type: Array as () => number[],
        default: () => []
    }
})
</script>

<template>
    <div :class="[`highlight-${language}`]" class="prose-code">
        <span v-if="filename" class="filename"> {{ filename }}  </span>
        <slot/>
    </div>
</template>

<style lang="ts" scoped>

</style>
