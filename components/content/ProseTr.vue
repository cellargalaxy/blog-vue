<template>
    <tr>
        <slot/>
    </tr>
</template>

<style lang="postcss" scoped>
thead tr {
    @apply bg-gray-100/80;
}
tbody tr {
    @apply hover:bg-gray-100/50;
}
</style>
