<script setup lang="ts">
import TitleUi from '../UI/TitleUi.vue';
import CityList from './CityList/CityList.vue';
import AddCityForm from './AddCityForm/AddCityForm.vue';
import type CityEntity from '@/typings/CityEntity';

export interface SettingsProps {
  cities: City[];
}

export interface City {
  id: number;
  name: string;
  country: string;
}

defineProps<{
  cities: CityEntity[];
}>();

const emit = defineEmits<{
  (event: 'reorderCities', cities: CityEntity[]): void;
  (event: 'removeCity', cityId: number): void;
  (event: 'addCity', city: CityEntity): void
}>();

const onAddCity = (city: CityEntity): void => {
  emit('addCity', city);
};
</script>

<template>
  <TitleUi>Settings</TitleUi>

  <CityList
    :cities="cities"
    @reorder-cities="$emit('reorderCities', $event)"
    @remove-city="$emit('removeCity', $event)" />

  <AddCityForm @add-city="onAddCity"/>
</template>

<style module="styles" lang="scss"></style>
