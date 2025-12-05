<script setup lang="ts">
import { SettingsIcon } from '@/components/icons/';
</script>

<template>
  <p class="message u-absolute-center">Click on <SettingsIcon class="message-icon" /> to add a city!</p>
</template>

<style scoped>
.message {
  text-align: center;
  font-size: 18px;
}

.message-icon {
  width: 18px;
  height: 18px;
  vertical-align: middle;
}
</style>
