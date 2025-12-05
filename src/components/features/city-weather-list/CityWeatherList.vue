<script setup lang="ts">
  import type { City } from '@/entities/city'
  import CityWeatherBlock from './components/city-weather-block/CityWeatherBlock.vue'

  const props = defineProps<{
    cities: City[]
  }>()
</script>

<template>
  <ul class="city-list">
    <CityWeatherBlock
      v-for="city in props.cities"
      :key="city.id"
      :city="city" />
  </ul>
</template>

<style scoped>
  .city-list {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }
</style>
