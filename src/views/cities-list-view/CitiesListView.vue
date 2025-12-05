<script setup lang="ts">
  import { SettingsButton } from '@/components/shared'
  import EmptyListMessage from './components/EmptyListMessage.vue'
  import type { City } from '@/entities/city/types'
  import { CityWeatherList } from '@/components/feature'

  const props = defineProps<{
    cities: City[]
  }>()
  const emit = defineEmits<{
    'go-to-settings': []
  }>()

  function clickOnSettingsHandler() {
    emit('go-to-settings')
  }
</script>

<template>
  <div>
    <SettingsButton @click="clickOnSettingsHandler" />

    <EmptyListMessage v-if="props.cities.length === 0" />

    <CityWeatherList
      v-else
      :cities="props.cities" />
  </div>
</template>
