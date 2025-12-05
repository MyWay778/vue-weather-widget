<script setup lang="ts">
import { SunLoader } from '@/components/shared/'
import CityWeatherDisplay from './components/CityWeatherDisplay.vue'
import type { City } from '@/entities/city/types'
import { useFetchWeather } from '@/composables'

const props = defineProps<{ city: City }>()

const MIN_RESPONSE_DURATION = 1000
const { data, isError, isLoading } = useFetchWeather(props.city, MIN_RESPONSE_DURATION)
</script>

<template>
  <li class="city-panel">
    <SunLoader v-if="isLoading" />

    <div
      v-else-if="isError"
      class="error-message u-absolute-center">
      Oops... something went wrong!
    </div>

    <CityWeatherDisplay
      v-else-if="data"
      :weather="data"
      :current-position="props.city.currentPos" />
  </li>
</template>

<style scoped>
.city-panel {
  position: relative;
  min-height: var(--widget-min-height);
}

.error-message {
  width: 100%;
  text-align: center;
}
</style>
