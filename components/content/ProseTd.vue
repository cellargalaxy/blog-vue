<template>
    <td>
        <slot/>
    </td>
</template>

<style lang="postcss" scoped>
td {
    @apply hover:bg-gray-500/50;
    @apply p-1;
    @apply border-dashed;
    @apply border-l;
    @apply border-r;
    @apply border-t;
}
</style>
