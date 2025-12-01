<script setup lang="ts">
import { computed } from 'vue';
import { TitleUi } from '@/components/ui/';
import { CityList } from '@/components/settings/cityList/';
import { AddCityForm } from '@/components/settings/addCityForm/';
import type CityEntity from '@/typings/models/CityEntity';

const MAX_CITIES = 3;

const props = defineProps<{
  cities: CityEntity[];
}>();

const emit = defineEmits<{
  (event: 'reorderCities', cities: CityEntity[]): void;
  (event: 'removeCity', cityId: string): void;
  (event: 'addCity', city: CityEntity): void;
}>();

const onAddCity = (city: CityEntity): void => {
  emit('addCity', city);
};

const isShownAddCityForm = computed(() => props.cities.length < MAX_CITIES);
</script>

<template>
  <TitleUi>Settings</TitleUi>

  <CityList
    :cities="cities"
    @reorder-cities="$emit('reorderCities', $event)"
    @remove-city="$emit('removeCity', $event)" />

  <AddCityForm
    v-if="isShownAddCityForm"
    @add-city="onAddCity" />

  <div
    v-else
    class="message">
    The maximum number of cities has been selected. Please remove one or more to add a new one.
  </div>
</template>

<style scoped>
.message {
  margin-top: 15px;
  text-align: center;
}
</style>
