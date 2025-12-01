<script setup lang="ts">
import { CloseIcon } from '@/components/icons/';
import { IconButton } from '@/components/ui';

const emit = defineEmits<{
  (e: 'close-modal'): void;
}>();
</script>

<template>
  <aside class="modal">
    <IconButton
      class="close"
      @click="emit('close-modal')">
      <CloseIcon />
    </IconButton>

    <slot />
  </aside>
</template>

<style scoped>
.modal {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: var(--white);
  border-radius: var(--border-radius);
}

.close {
  position: absolute;
  top: 20px;
  right: 20px;
}
</style>
