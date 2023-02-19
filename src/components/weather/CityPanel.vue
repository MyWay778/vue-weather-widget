<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { normalizeWeatherApi } from '@/helpers/';
import { useFetchWeather } from '@/composables/';
import { WeatherDisplay } from '@/components/weather';
import { LoaderUi as Loader } from '@/components/ui/';
import type { CityEntity, CityWeatherEntity } from '@/typings/models/';

const props = defineProps<{ city: CityEntity }>();
const emit = defineEmits<{
  (e: 'update-city', city: CityEntity): void;
}>();

const MIN_RESPONSE_DURATION = 1000;

const weatherResponse = reactive(useFetchWeather(props.city, MIN_RESPONSE_DURATION));
watch(weatherResponse, () => {
  // if weather response is successful
  if (weatherResponse.data) {
    normalizedWeather.value = normalizeWeatherApi(weatherResponse.data);

    if (isNeedCityUpdate()) {
      emit('update-city', {
        ...props.city,
        name: weatherResponse.data.name,
        country: weatherResponse.data.sys.country
      });
    }
  }
});

// if the city does not have a name or country, this can happen when we get the city from geolocation
const isNeedCityUpdate = (): boolean => !props.city.name || !props.city.country;

// normalized weather data for rendering
const normalizedWeather = ref<CityWeatherEntity>();
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
