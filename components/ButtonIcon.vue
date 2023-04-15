<template>
    <button class="hover:scale-125 opacity-25 focus:opacity-100">
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