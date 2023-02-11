<script setup lang="ts">
import CloseIcon from '../icons/CloseIcon.vue';
import ButtonWIthIcon from './ButtonWIthIcon.vue';
</script>

<template>
  <aside :class="styles.modal">
    <ButtonWIthIcon
      :class="styles.close"
      @click="$emit('closeModal')">
      <CloseIcon />
    </ButtonWIthIcon>

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
}

.close {
  position: absolute;
  top: 20px;
  right: 20px;
}
</style>
