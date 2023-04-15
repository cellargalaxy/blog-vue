<template>
    <button class="hover:scale-125 opacity-50 focus:opacity-100 mx-px">
        <Icon :name="name"/>
    </button>
</template>

<script setup lang="ts">
defineProps({
    name: {
        default: ''
    },
})
</script>

<style lang="postcss" scoped>

</style>