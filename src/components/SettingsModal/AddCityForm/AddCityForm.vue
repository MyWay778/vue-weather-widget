<script setup lang="ts">
import TitleUi from '@UI/TitleUi.vue';
import ArrowLeftIcon from '../../icons/ArrowLeftIcon.vue';
import ButtonWIthIcon from '@UI/ButtonWIthIcon.vue';
import InputWithOptions, { type InputWithOptionsRef } from './InputWithOptions.vue';
import { computed, ref, watch } from 'vue';
import useFetchCityOptions from '@/hooks/useFetchCityOptions';
import type CityEntity from '@/typings/models/CityEntity';

const emit = defineEmits<{
  (event: 'addCity', city: CityEntity): void;
}>();

const inputWithOptionsRef = ref<InputWithOptionsRef>(); // a reference to the inputWithOprions component
const cityInput = ref('');
const cityRequest = ref('');
const { options, isError } = useFetchCityOptions(cityRequest, 600);
let selectedOption = ref<CityEntity>();
let isOptionSelected = false; // flag to know if the user has selected an option
let message = ref('');
let isSubmitDisabled = computed(() => !selectedOption.value);

watch(isError, () => {
  if (isError.value) {
    message.value = 'Request faild.';
  }
});

watch(cityInput, () => {
  message.value = '';

  // if the user selects an option, nothing needs to be done,
  // otherwise reset the values and request new options
  if (isOptionSelected) {
    isOptionSelected = false;
    return;
  }

  selectedOption.value = undefined;
  options.value = [];
  cityRequest.value = cityInput.value;
});

const addCity = () => {
  if (!selectedOption.value) return;

  emit('addCity', selectedOption.value);
  cityInput.value = '';
};

const showMessage = () => {
  if (cityInput.value.length) {
    message.value = 'City not found, try changing its name.';
  } else {
    message.value = 'Enter the name of the city, for example "Moscow, RU"';
  }
};

const onSubmit = (event: Event): void => {
  // to prevent hiding options
  event.stopPropagation();

  if (selectedOption.value) {
    addCity();
  } else {
    // if there are options focus on the input field to show options
    if (options.value.length) {
      inputWithOptionsRef.value?.focusInput();
    } else {
      showMessage();
    }
  }
};

const onOptionClick = (option: CityEntity): void => {
  selectedOption.value = option;

  cityInput.value = `${option.name}, ${option.country}`; // set the selected option in the input field
  cityRequest.value = '';
  isOptionSelected = true;

  inputWithOptionsRef.value?.focusInput();
};

const onEnterDown = () => {
  if (selectedOption.value) {
    addCity();
  } else {
    showMessage();
  }
};
</script>

<template>
  <form
    :class="styles.addCityForm"
    @submit.prevent>
    <TitleUi :class="styles.title">Add Location:</TitleUi>

    <div :class="styles.cityName">
      <InputWithOptions
        v-model.trim="cityInput"
        :class="styles.input"
        :options="options"
        @option-click="onOptionClick"
        @enter-down="onEnterDown"
        ref="inputWithOptionsRef"
        inputType="search"
        placeholder="Enter city..." />

      <ButtonWIthIcon
        :class="[styles.arrowBtn, { [styles.disabled]: isSubmitDisabled }]"
        @click="onSubmit">
        <ArrowLeftIcon />
      </ButtonWIthIcon>
    </div>

    <div
      v-show="message && !options.length"
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
