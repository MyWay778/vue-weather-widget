<script setup lang="ts">
  import SunIcon from '../shared/icons/SunIcon.vue'
</script>

<template>
  <div class="loader">
    <SunIcon class="loader-icon" />
  </div>
</template>

<style scoped>
  .loader {
    position: absolute;
    inset: 0;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
  }

  .loader-icon {
    width: 60px;
    height: 60px;
    animation: rotation 2s linear infinite;
  }
</style>
