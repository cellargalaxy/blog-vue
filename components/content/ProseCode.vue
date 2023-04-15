<template>
    <div v-if="code">
        <div class="flex bg-gray-500/50 p-1">
            <div class="flex-grow text-left w-max">
                <ProseCodeInline v-if="language">
                    {{ language }}
                </ProseCodeInline>
            </div>
            <div class="flex-shrink-0 text-center w-max">
                <ProseCodeInline v-if="filename">
                    {{ filename }}
                </ProseCodeInline>
            </div>
            <div class="flex-grow text-right w-max">
                <ButtonCopy :text="code"/>
            </div>
        </div>

        <div :class="[`highlight-${language}`]" class="bg-gray-100/50 p-1">
            <slot/>
        </div>
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
    @apply p-1;
    /*@apply border-2;*/
    /*@apply rounded-lg;*/
    /*@apply shadow-inner;*/
}
</style>
