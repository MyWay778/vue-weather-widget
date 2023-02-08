<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import InputUi from './InputUi.vue';

const props = defineProps<{
  modelValue: string;
  type: string;
  placeholder: string;
  suggestions: string[];
  isShowOptions: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: string): void;
  (e: 'suggestionClick', value: string): void;
}>();

const suggestionClickHandler = (suggestion: string) => {
  emit('suggestionClick', suggestion);
};

const isShown = ref(true);

const isShow = computed(() => Boolean(isShown.value && props.suggestions.length));

onMounted(() => {
  window.addEventListener('click', windowClickHandler);
});

onBeforeUnmount(() => {
  window.removeEventListener('click', windowClickHandler);
});

const windowClickHandler = () => {
  isShown.value = false;
};

const focusInputHandler = () => {
  console.log('focus');
  isShown.value = true;
};
</script>

<template>
  <div
    :class="styles.container"
    @click.stop>
    <InputUi
      :model-value="modelValue"
      :type="type"
      :placeholder="placeholder"
      @click.stop
      @update:modelValue="$emit('update:modelValue', $event)"
      @focus="focusInputHandler"
      autocomplete="off" />
    <ul
      v-show="isShow"
      :class="styles.suggestions">
      <button
        v-for="suggestion in suggestions"
        :key="suggestion"
        :class="styles.button"
        @click="suggestionClickHandler(suggestion)"
        class="button"
        type="button">
        {{ suggestion }}
      </button>
    </ul>
  </div>
</template>

<style module="styles" lang="scss">
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
  text-align: left;
}
</style>
