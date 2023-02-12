<script setup lang="ts">
import normalizeWeatherApi from '@/helpers/normalizeWeatherApi';
import useFeatchWeather from '@/hooks/useFetchWeather';
import type CityEntity from '@/typings/models/CityEntity';
import { computed, reactive } from 'vue';
import WeatherDisplay from './WeatherDisplay.vue';
import SunLoader from '../UI/SunLoader.vue';

const props = defineProps<{ city: CityEntity }>();
const weatherResponse = reactive(useFeatchWeather(props.city));

const normalizedWeather = computed(() => {
  if (!weatherResponse.data) {
    return;
  }

  return normalizeWeatherApi(weatherResponse.data);
});
</script>

<template>
  <section :class="styles.cityPanel">
    <SunLoader v-if="weatherResponse.isLoading" />

    <WeatherDisplay
      v-if="normalizedWeather"
      :weather="normalizedWeather" />

    <div
      v-if="weatherResponse.isError"
      :class="styles.errorMessage">
      Oops... something went wrong!
    </div>
  </section>
</template>

<style module="styles" lang="scss">
@import '@/styles/mixins.scss';

.cityPanel {
  position: relative;
  min-height: 236px;
}

.errorMessage {
  @include absolute-center;

  width: 100%;
  text-align: center;
}
</style>
