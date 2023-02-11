<script setup lang="ts">
import type CityEntity from '@/typings/CityEntity';
import { computed, onBeforeUnmount, onMounted, ref, type Ref } from 'vue';
import InputUi from '../../UI/InputUi.vue';

const props = defineProps<{
  modelValue: string;
  type: string;
  placeholder: string;
  options: CityEntity[];
  isShowOptions: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: string): void;
  (e: 'optionClick', value: CityEntity): void;
}>();

onMounted(() => {
  window.addEventListener('click', onWindowClick);
});

onBeforeUnmount(() => {
  window.removeEventListener('click', onWindowClick);
});

const refs = ref<{ inputEl: Ref<HTMLElement> }>();
defineExpose({
  refs
});

const isShown = ref(true);
const isShow = computed(() => Boolean(isShown.value && props.options.length));

const onOptionClick = (option: CityEntity) => {
  emit('optionClick', option);
};

const onWindowClick = () => {
  isShown.value = false;
};

const onInputFocus = () => {
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
      @focus="onInputFocus"
      ref="refs"
      autocomplete="off" />
    <ul
      v-show="isShow"
      :class="styles.suggestions">
      <button
        v-for="option in options"
        :key="option.id"
        :class="styles.button"
        @click="onOptionClick(option)"
        class="button"
        type="button">
        {{ option.name }}, {{ option.country }}
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
