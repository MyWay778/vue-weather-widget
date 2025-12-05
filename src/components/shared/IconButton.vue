<script setup lang="ts"></script>

<template>
  <button
    class="button c-button"
    type="button">
    <slot></slot>
  </button>
</template>

<style scoped>
  .button {
    width: 20px;
    height: 20px;
  }
</style>
