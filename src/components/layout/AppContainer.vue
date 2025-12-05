<script setup lang="ts"></script>

<template>
  <div class="app-container">
    <slot></slot>
  </div>
</template>

<style scoped>
  .app-container {
    position: relative;
    display: flex;
    flex-direction: column;
    row-gap: 50px;
    width: 260px;
    min-height: var(--widget-min-height);
    padding: var(--padding);
    border-radius: var(--border-radius);
    background-color: var(--white);
    box-shadow: 2px 2px 5px 2px var(--shadow);
  }
</style>
