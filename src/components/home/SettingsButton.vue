<script setup lang="ts">
import { SettingsIcon } from '@/components/icons/';
import { IconButton } from '@/components/ui';
</script>
<template>
  <IconButton :class="styles.settingsBtn">
    <SettingsIcon />
  </IconButton>
</template>
<style module="styles" lang="scss">
.settingsBtn {
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
