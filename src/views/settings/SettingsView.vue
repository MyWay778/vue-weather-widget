<script setup lang="ts">
  import { TitleUi } from '@/components/shared'
  import { CityDragAndDropList } from '@/components/feature/city-drag-and-drop-list'
  import { AddCityForm } from '@/components/feature/add-city-form'
  import type { City } from '@/entities/city/types'
  import { IconButton, LeftArrowIcon } from '@/components/shared'
  import { computed } from 'vue'

  const MAX_CITIES = 3

  const citiesModel = defineModel<City[]>('cities', { required: true })

  const emit = defineEmits<{
    'close-settings': []
  }>()

  function addCityHandler(city: City) {
    citiesModel.value = citiesModel.value.concat(city)
  }

  const isShowAddForm = computed(() => citiesModel.value.length < MAX_CITIES)
</script>

<template>
  <section class="settings-view">
    <div class="title-block">
      <TitleUi>Settings</TitleUi>
      <IconButton @click="emit('close-settings')"><LeftArrowIcon /></IconButton>
    </div>

    <CityDragAndDropList v-model:cities="citiesModel" />

    <AddCityForm
      v-if="isShowAddForm"
      @add-city="addCityHandler" />

    <div
      v-else
      class="message">
      The maximum number of cities has been selected. Please remove one or more to add a new one.
    </div>
  </section>
</template>

<style scoped>
  .settings-view {
    /* To fully overflow back layout */
    --width-offset: 2px;

    position: absolute;
    top: var(--padding);
    left: calc(var(--padding) - var(--width-offset));
    background-color: var(--background-color);
    width: calc(100% - (var(--padding) - var(--width-offset)) * 2);
    height: calc(100% - var(--padding) * 2);
    z-index: 10;
  }

  .title-block {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  }

  .message {
    margin-top: 15px;
    text-align: center;
  }
</style>
