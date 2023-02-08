<script setup lang="ts"></script>

<template>
  <button
    class="button"
    :class="styles.button"
    type="button">
    <slot></slot>
  </button>
</template>

<style module="styles" lang="scss">
.button {
  width: 20px;
  height: 20px;
}
</style>
