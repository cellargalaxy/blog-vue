<template>
    <div class="overflow-auto my-2" style="max-height: 50vh">
        <table>
            <slot/>
        </table>
    </div>

</template>

<style lang="postcss" scoped>
table {
    @apply table-auto;
    @apply border-collapse;
    @apply w-full;
}
</style>
<script setup lang="ts">
</script>