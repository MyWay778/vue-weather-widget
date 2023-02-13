<script setup lang="ts"></script>

<template>
  <button
    :class="styles.button"
    type="button">
    <slot></slot>
  </button>
</template>

<style module="styles" lang="scss">
@import '@/styles/mixins.scss';

.button {
  @include common-button;
  width: 20px;
  height: 20px;
}
</style>
