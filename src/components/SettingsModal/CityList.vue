<script setup lang="ts">
import HamburgerIcon from '../icons/HamburgerIcon.vue';
import TrashIcon from '../icons/TrashIcon.vue';
import type { City } from '../SettingsModal.vue';

defineProps<{ cities: City[] }>();
</script>

<template>
  <ul :class="styles.cityList">
    <li
      v-for="city in cities"
      :key="city.id"
      :class="styles.cityItem">
      <HamburgerIcon />
      <span>{city.name}, {city.country}</span>
      <TrashIcon :class="styles.cityItemTrash" />
    </li>
  </ul>
</template>

<style module="styles" lang="scss">
.cityList {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  row-gap: 10px;
}

.cityItem {
  display: flex;
  align-items: center;
  padding: 6px 5px;
  column-gap: 5px;
  background-color: var(--shadow);

  &Trash {
    margin-left: auto;
  }
}
</style>
