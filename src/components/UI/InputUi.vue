<script setup lang="ts">
import { ref } from 'vue';

export interface InputUiRef {
  focusInput: () => void;
}

const props = withDefaults(
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

const inputEl = ref<HTMLInputElement>();
const focusInput = () => {
  if (inputEl.value) {
    inputEl.value.focus();
  }
};

defineExpose({
  focusInput
});

const inputHandler = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const newValue = target.value;

  target.value = props.modelValue;

  emit('update:modelValue', newValue);
};
</script>

<template>
  <input
    :value="modelValue"
    @input="inputHandler"
    :class="styles.input"
    :type="type"
    :placeholder="placeholder"
    :disabled="disabled"
    ref="inputEl" />
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
