<script setup lang="ts">
import ArrowLeftIcon from './icons/ArrowLeftIcon.vue';
import ButtonWIthIcon from './UI/ButtonWIthIcon.vue';
import TitleUi from './UI/TitleUi.vue';
import CityList from './SettingsModal/CityList.vue';
import AddCityForm from './SettingsModal/AddCityForm.vue';
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

defineEmits<{
  (event: 'reorderCities', cities: CityEntity[]): void;
}>();
</script>

<template>
  <TitleUi>Settings</TitleUi>

  <CityList
    :cities="cities"
    @reorder-cities="$emit('reorderCities', $event)" />

  <AddCityForm />
</template>

<style module="styles" lang="scss"></style>
