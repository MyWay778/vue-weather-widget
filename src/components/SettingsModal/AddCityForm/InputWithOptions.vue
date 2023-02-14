<script setup lang="ts">
import type CityEntity from '@/typings/models/CityEntity';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import InputUi, { type InputUiRef } from '@UI/InputUi.vue';
import sanitizeInput, { excludedChars } from '@/helpers/sanitizeInput';

export interface InputWithOptionsRef {
  focusInput: () => void;
}

const props = defineProps<{
  modelValue: string; // input value
  inputType: string;
  placeholder: string;
  options: CityEntity[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: string): void;
  (e: 'optionClick', value: CityEntity): void;
  (e: 'enterDown'): void;
}>();

onMounted(() => {
  window.addEventListener('click', onWindowClick);
});

onBeforeUnmount(() => {
  window.removeEventListener('click', onWindowClick);
});

// get a reference to the inputUi component to expose the focus method
const inputUiRef = ref<InputUiRef>();
const focusInput = () => {
  if (inputUiRef.value) {
    inputUiRef.value.focusInput();
  }
};

defineExpose({
  focusInput
});

// internal flag to show or not options
const isNeedShow = ref(true);
const isShowOptions = computed(() => Boolean(isNeedShow.value && props.options.length));

const onOptionClick = (option: CityEntity) => {
  emit('optionClick', option);
};

// hide options by clicking outside the input
const onWindowClick = () => {
  isNeedShow.value = false;
};

const onInputFocus = () => {
  isNeedShow.value = true;
};

const onUpdateModelValue = (value: string) => {
  const saveText = sanitizeInput(value, excludedChars.cityInput);
  emit('update:modelValue', saveText);
};
</script>

<template>
  <div
    :class="styles.container"
    @click.stop>
    <InputUi
      :model-value="modelValue"
      :type="inputType"
      :placeholder="placeholder"
      @click.stop
      @update:modelValue="onUpdateModelValue"
      @focus="onInputFocus"
      @keydown.enter="$emit('enterDown')"
      ref="inputUiRef"
      autocomplete="off" />

    <ul
      v-show="isShowOptions"
      :class="styles.suggestions">
      <button
        v-for="option in options"
        :key="option.id"
        :class="styles.button"
        @click="onOptionClick(option)"
        type="button">
        {{ option.name }}, {{ option.country }}
      </button>
    </ul>
  </div>
</template>

<style module="styles" lang="scss">
@import '@/styles/mixins.scss';

.container {
  position: relative;
}
.suggestions {
  position: absolute;
  left: 0;
  top: 115%;
  display: flex;
  flex-direction: column;
  row-gap: 5px;
  width: 100%;
  max-height: 100px;
  padding: 10px 8px;
  background-color: var(--white);
  border: 1px solid var(--gray-light);
  overflow: hidden scroll;
  scrollbar-width: thin;
  scrollbar-gutter: stable;

  &::-webkit-scrollbar {
    width: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #8cc7ff;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 10px;
  }
}

.button {
  @include common-button;
  text-align: left;
}
</style>
