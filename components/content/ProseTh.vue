<template>
    <th>
        <slot/>
    </th>
</template>

<style lang="postcss" scoped>
th {
    @apply hover:bg-gray-100/50;
    @apply p-1;
    @apply border-dashed;
    @apply border;
}
</style>
