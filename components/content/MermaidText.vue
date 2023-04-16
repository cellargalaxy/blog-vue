<template>
    <pre class="mermaid" v-if="show">
        {{text}}
    </pre>
</template>

<script setup lang="ts">
defineProps({
    text: {
        type: String,
        default: ''
    },
})

let show = ref(false)

const {$mermaid} = useNuxtApp()

onMounted(async () => {
    show.value = true
    $mermaid().initialize({startOnLoad: true})
    await nextTick()
    $mermaid().init()
})
</script>