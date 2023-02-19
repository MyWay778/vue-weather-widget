<script setup lang="ts">
import { SettingsIcon } from '@/components/icons/';
</script>
<template>
  <p :class="styles.message">Click on <SettingsIcon :class="styles.messageIcon" /> to add a city!</p>
</template>
<style module="styles" lang="scss">
@import '@/styles/mixins.scss';

.message {
  @include absolute-center;
  text-align: center;
  font-size: 18px;

  &Icon {
    width: 18px;
    height: 18px;
    vertical-align: middle;
  }
}
</style>
