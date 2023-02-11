<script setup lang="ts">
import normalizeWeatherApi from '@/helpers/normalizeWeatherApi';
import useFeatchWeather, { type CityApiData } from '@/hooks/useFetchWeather';
import type CityEntity from '@/typings/CityEntity';
import { computed, reactive, ref, unref, watchEffect } from 'vue';
import WeatherDisplay from './CityPanel/WeatherDisplay.vue';
import SunLoader from './UI/SunLoader.vue';

const props = defineProps<{ city: CityEntity }>();
const response = reactive(useFeatchWeather(props.city));

// watchEffect(() => {
//   if (!props.city.weatherId) {
//     response.value = useFeatchWeather(props.city);
//   }
// });

const weather = computed(() => {
  // if (!response.value) {
  //   return;
  // }

  // const data = unref(response.value?.data);
  // if (!data) {
  //   return;
  // }

  if (!response.data) {
    return;
  }

  return normalizeWeatherApi(response.data);
});
</script>

<template>
  <section :class="styles.cityPanel">
    <SunLoader v-if="response?.isLoading" />

    <WeatherDisplay
      v-if="weather"
      :weather="weather" />
  </section>
</template>

<style module="styles" lang="scss">
.cityPanel {
  position: relative;
  min-height: 236px;
}
</style>
