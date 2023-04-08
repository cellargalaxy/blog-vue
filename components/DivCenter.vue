<template>
    <div class="div-center">
        <slot/>
    </div>
</template>

<div-center></div-center>

<style lang="postcss" scoped>
.div-center {
    @apply relative;
    @apply top-1/2;
    @apply left-1/2;
    transform: translate(-50%, -50%);
}
</style>