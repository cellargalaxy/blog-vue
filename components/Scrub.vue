<template>
  <div class="scrub">
    <slot/>
  </div>
</template>

<scrub></scrub>

<script>
export default {
  name: "Scrub"
}
</script>

<style scoped>
.scrub {
  width: 100%;
  height: 100%;
  backdrop-filter: blur(6px);
  background: rgba(190, 190, 190, 0.5);
}
</style>