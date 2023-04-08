<template>
    <th>
        <slot/>
    </th>
</template>

<style lang="postcss" scoped>
th {
    @apply hover:bg-gray-500/50;
    @apply p-1;
    @apply border-dashed;
    @apply border-l;
    @apply border-r;
    @apply border-b;
}
</style>
