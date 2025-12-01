<script setup lang="ts">
import { SettingsIcon } from '@/components/icons/';
import { IconButton } from '@/components/ui';
</script>

<template>
  <IconButton class="settings-btn">
    <SettingsIcon />
  </IconButton>
</template>

<style scoped>
.settings-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1;

  &:hover {
    svg {
      transform: rotate(45deg);
    }
  }

  svg {
    transition: 0.5s;
  }
}
</style>
