<script setup lang="ts">
  import { ref, shallowRef, watch } from 'vue'
  import { getStorage } from '@/helpers/'
  import { AppContainer } from '@/components/layout'
  import { CitiesListView } from '@/views/cities-list-view'
  import { SettingsView } from './views/settings'
  import type { City } from './entities/city/models/City'
  import { useGeoPositionCity } from '@/entities/city'

  // Get cities from storage
  const STORAGE_KEY = 'weather-widget-cities'
  const cityStorage = getStorage<City[]>(STORAGE_KEY)
  const cityFromStorage = cityStorage.get({ isStringify: true }) ?? []

  const cities = shallowRef<City[]>(cityFromStorage)

  // Update cities in localstorage
  watch(cities, newCities => {
    cityStorage.save(newCities)
  })

  // Geo Position
  useGeoPositionCity(cities)

  // Settings View
  const showSettings = ref(false)
</script>

<template>
  <main id="root">
    <AppContainer>
      <CitiesListView
        :cities="cities"
        @open-settings="showSettings = true" />

      <SettingsView
        v-if="showSettings"
        v-model:cities="cities"
        @close-settings="showSettings = false" />
    </AppContainer>
  </main>
</template>

<style>
  @import './styles/index.css';
</style>
