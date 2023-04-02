<template>
    <div class="fence">
        <slot/>
    </div>
</template>

<fence></fence>

<script>
export default {
    name: "Fence"
}
</script>

<style lang="postcss" scoped>
.fence {
    @apply w-full;
    @apply h-full;
    @apply bg-repeat;
    @apply bg-auto;
    @apply bg-fixed;
    background-image: url('@/assets/img/fence.svg');
}
</style>