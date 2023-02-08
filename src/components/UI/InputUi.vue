<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string;
    type: string;
    placeholder: string;
    disabled?: boolean;
  }>(),
  {
    type: 'text',
    placeholder: '',
    disabled: false
  }
);
const emit = defineEmits(['update:modelValue']);

const inputHandler = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
};
</script>

<template>
  <input
    :value="modelValue"
    @input="inputHandler"
    :class="styles.input"
    :type="type"
    :placeholder="placeholder"
    :disabled="disabled" />
</template>

<style module="styles" lang="scss">
.input {
  width: 100%;
  height: 35px;
  padding-left: 8px;
  font-size: 16px;
  color: var(--black);
  outline-color: var(--active);
}
</style>
