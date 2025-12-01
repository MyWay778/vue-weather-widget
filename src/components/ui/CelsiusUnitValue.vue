<script setup lang="ts">
const { value } = defineProps<{ value: number }>();
</script>

<template>
  <span>{{ value }}<sup class="celsius">o</sup>C</span>
</template>

<style scoped>
.celsius {
  vertical-align: middle;
  position: relative;
  top: -0.6em;
  font-size: 0.6em;
}
</style>
