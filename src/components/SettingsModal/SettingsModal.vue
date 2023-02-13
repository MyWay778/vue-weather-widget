<script setup lang="ts">
import TitleUi from '@UI/TitleUi.vue';
import CityList from './CityList/CityList.vue';
import AddCityForm from './AddCityForm/AddCityForm.vue';
import type CityEntity from '@/typings/models/CityEntity';
import { computed } from 'vue';

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

const isShowAddCityForm = computed(() => props.cities.length < MAX_CITIES);
</script>

<template>
  <TitleUi>Settings</TitleUi>

  <CityList
    :cities="cities"
    @reorder-cities="$emit('reorderCities', $event)"
    @remove-city="$emit('removeCity', $event)" />

  <AddCityForm
    v-if="isShowAddCityForm"
    @add-city="onAddCity" />

  <div
    v-else
    :class="styles.message">
    The maximum number of cities has been selected. Please remove one or more to add a new one.
  </div>
</template>

<style module="styles" lang="scss">
.message {
  margin-top: 15px;
  text-align: center;
}
</style>
