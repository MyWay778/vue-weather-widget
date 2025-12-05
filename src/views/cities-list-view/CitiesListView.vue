<script setup lang="ts">
  import { SettingsButton } from '@/components/shared'
  import EmptyListMessage from './components/EmptyListMessage.vue'
  import type { City } from '@/entities/city'
  import { CityWeatherList } from '@/components/features'

  const props = defineProps<{
    cities: City[]
  }>()

  const emit = defineEmits<{
    'open-settings': []
  }>()
</script>

<template>
  <div>
    <SettingsButton @click="emit('open-settings')" />

    <EmptyListMessage v-if="props.cities.length === 0" />

    <CityWeatherList
      v-else
      :cities="props.cities" />
  </div>
</template>
