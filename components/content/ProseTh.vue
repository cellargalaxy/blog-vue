<template>
    <th>
        <slot/>
    </th>
</template>

<style lang="postcss" scoped>
th {
    @apply p-1;
    @apply border-dashed;
    @apply border;
}
</style>
