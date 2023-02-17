<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { normalizeWeatherApi } from '@/helpers/';
import { useFetchWeather } from '@/composables/';
import { WeatherDisplay } from '@/components/weather';
import { LoaderUi as Loader } from '@/components/ui/';
import type CityEntity from '@/typings/models/CityEntity';

const props = defineProps<{ city: CityEntity }>();
const emit = defineEmits<{
  (e: 'update-city', city: CityEntity): void;
}>();

const weatherResponse = reactive(useFetchWeather(props.city, 1000));

const isNeedCityUpdate = (): boolean => !props.city.name || !props.city.country;
watch(weatherResponse, () => {
  if (weatherResponse.data && isNeedCityUpdate()) {
    emit('update-city', {
      ...props.city,
      name: weatherResponse.data.name,
      country: weatherResponse.data.sys.country
    });
  }
});

const normalizedWeather = computed(() => {
  if (!weatherResponse.data) {
    return;
  }

  return normalizeWeatherApi(weatherResponse.data);
});
</script>

<template>
  <section :class="styles.cityPanel">
    <Loader v-if="weatherResponse.isLoading" />

    <WeatherDisplay
      v-if="normalizedWeather"
      :weather="normalizedWeather"
      :current-position="city.currentPos" />

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
  min-height: var(--widget-min-height);
}

.errorMessage {
  @include absolute-center;

  width: 100%;
  text-align: center;
}
</style>
