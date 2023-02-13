<script setup lang="ts">
import SunIcon from '../icons/SunIcon.vue';
</script>

<template>
  <div :class="styles.loader">
    <SunIcon :class="styles.loaderIcon" />
  </div>
</template>

<style module="styles" lang="scss">
.loader {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;

  &Icon {
    width: 60px;
    height: 60px;

    :global {
      animation: rotation 2s linear infinite;
    }
  }
}
</style>
