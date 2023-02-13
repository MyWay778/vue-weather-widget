<script setup lang="ts">
defineProps<{ value: number }>();
</script>

<template>
  <span>{{ value }}<sup :class="styles.celsius">o</sup>C</span>
</template>

<style module="styles" lang="scss">
.celsius {
  vertical-align: middle;
  position: relative;
  top: -0.6em;
  font-size: 0.6em;
}
</style>
