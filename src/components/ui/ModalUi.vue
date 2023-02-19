<script setup lang="ts">
import { CloseIcon } from '@/components/icons/';
import { IconButton } from '@/components/ui';

defineEmits<{
  (e: 'closeModal'): void;
}>();
</script>

<template>
  <aside :class="styles.modal">
    <IconButton
      :class="styles.close"
      @click="$emit('closeModal')">
      <CloseIcon />
    </IconButton>

    <slot />
  </aside>
</template>

<style module="styles" lang="scss">
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
