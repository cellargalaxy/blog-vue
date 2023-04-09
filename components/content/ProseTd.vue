<template>
    <td>
        <slot/>
    </td>
</template>

<style lang="postcss" scoped>
td {
    @apply hover:bg-gray-100/50;
    @apply p-1;
    @apply border-dashed;
    @apply border;
}
</style>
