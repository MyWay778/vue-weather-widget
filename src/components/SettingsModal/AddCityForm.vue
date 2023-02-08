<script setup lang="ts">
import TitleUi from '../UI/TitleUi.vue';
import ArrowLeftIcon from '../icons/ArrowLeftIcon.vue';
import ButtonWIthIcon from '../UI/ButtonWIthIcon.vue';
import InputWithSuggestions from '../UI/InputWithSuggestions.vue';
import { ref, watch } from 'vue';
import useCitySuggestions from '@/hooks/useCitySuggestions';

const cityInput = ref('');
const city = ref('');
const suggestions = useCitySuggestions(city);
let selectedOption = '';
let isSubmitDisabled = true;
let message = ref('');

watch(cityInput, newInput => {
  if (newInput === selectedOption) return;
  selectedOption = '';
  isSubmitDisabled = true;
  message.value = '';
  city.value = newInput;
});

const submitHandler = () => {
  if (!selectedOption && cityInput.value.length) {
    message.value = 'City not found, try changing its name.';
  }
  console.log('submit');
};

const suggestionClickHandler = (suggestion: string) => {
  selectedOption = suggestion;
  isSubmitDisabled = false;
  cityInput.value = suggestion;
  suggestions.value = [];
};
</script>

<template>
  <form :class="styles.addCityForm">
    <TitleUi :class="styles.title">Add Location:</TitleUi>

    <div :class="styles.cityName">
      <InputWithSuggestions
        v-model.trim="cityInput"
        :class="styles.input"
        :suggestions="suggestions"
        @suggestion-click="suggestionClickHandler"
        type="search"
        placeholder="Enter city..." />

      <ButtonWIthIcon
        :class="[styles.arrowBtn, { [styles.disabled]: isSubmitDisabled }]"
        @click="submitHandler">
        <ArrowLeftIcon />
      </ButtonWIthIcon>
    </div>

    <div :class="styles.message">{{ message }}</div>
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
