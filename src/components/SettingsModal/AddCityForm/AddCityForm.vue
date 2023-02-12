<script setup lang="ts">
import TitleUi from '../../UI/TitleUi.vue';
import ArrowLeftIcon from '../../icons/ArrowLeftIcon.vue';
import ButtonWIthIcon from '../../UI/ButtonWIthIcon.vue';
import InputWithOptions, { type InputWithOptionsRef } from './InputWithOptions.vue';
import { computed, ref, watch } from 'vue';
import useFetchCityOptions from '@/hooks/useFetchCityOptions';
import type CityEntity from '@/typings/models/CityEntity';

const emit = defineEmits<{
  (event: 'addCity', city: CityEntity): void;
}>();

const inputWithOptionsRef = ref<InputWithOptionsRef>();
const cityInput = ref('');
const cityRequest = ref('');
const { options, isError } = useFetchCityOptions(cityRequest);
let selectedOption = ref<CityEntity>();
let isOptionSelected = false;
let message = ref('');
let isSubmitDisabled = computed(() => !selectedOption.value);

watch(isError, () => {
  if (isError.value) {
    message.value = 'Request faild.';
  }
});

watch(cityInput, () => {
  message.value = '';

  if (isOptionSelected) {
    isOptionSelected = false;
    return;
  }

  selectedOption.value = undefined;
  options.value = [];
  cityRequest.value = cityInput.value;
});

const submitHandler = (event: Event): void => {
  event.stopPropagation();

  if (!selectedOption.value) {
    if (!options.value.length) {
      message.value = 'City not found, try changing its name.';
    }

    inputWithOptionsRef.value?.focusInput();
  } else {
    emit('addCity', selectedOption.value);
    cityInput.value = '';
  }
};

const onOptionClick = (option: CityEntity): void => {
  selectedOption.value = option;
  cityInput.value = `${option.name}, ${option.country}`;
  cityRequest.value = '';
  isOptionSelected = true;
};

const isShowOptions = computed(() => {
  return Boolean(!selectedOption.value && options.value.length);
});
</script>

<template>
  <form :class="styles.addCityForm">
    <TitleUi :class="styles.title">Add Location:</TitleUi>

    <div :class="styles.cityName">
      <InputWithOptions
        v-model.trim="cityInput"
        :is-show-options="isShowOptions"
        :class="styles.input"
        :options="options"
        @option-click="onOptionClick"
        ref="inputWithOptionsRef"
        type="search"
        placeholder="Enter city..." />

      <ButtonWIthIcon
        :class="[styles.arrowBtn, { [styles.disabled]: isSubmitDisabled }]"
        @click="submitHandler">
        <ArrowLeftIcon />
      </ButtonWIthIcon>
    </div>

    <div
      v-show="message"
      :class="styles.message">
      {{ message }}
    </div>
  </form>
</template>

<style module="styles" lang="scss">
.addCityForm {
  margin-top: 40px;

  .cityName {
    position: relative;
    display: flex;
    align-items: center;
    column-gap: 5px;
    margin-top: 8px;
  }
}

.arrowBtn {
  flex-shrink: 0;
  width: 25px;
  height: 25px;

  &.disabled {
    opacity: 0.5;

    &:hover {
      color: inherit;
      cursor: default;
    }
  }
}

.message {
  margin-top: 15px;
}
</style>
