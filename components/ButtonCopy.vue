<template>
    <ButtonIcon name="material-symbols:content-copy-outline" @click="copy"/>
</template>

<script setup lang="ts">
const props = defineProps({
    text: {
        type: String,
        default: ''
    },
})

import {useClipboard} from '@vueuse/core'

const {copy: copyToClipboard} = useClipboard()
const copy = (_e: MouseEvent) => {
    copyToClipboard(props.text)
        .then(() => {
        })
        .catch((err) => {
            console.warn("ButtonCopy", err)
        })
}
</script>

<style lang="postcss" scoped>

</style>