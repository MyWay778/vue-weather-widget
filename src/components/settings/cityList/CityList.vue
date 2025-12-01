<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { swapArrayItems } from '@/helpers/';
import { HamburgerIcon, TrashIcon } from '@/components/icons/';
import { IconButton } from '@/components/ui/';
import type CityEntity from '@/typings/models/CityEntity';
import { draggableList } from '@/modules/cityList/';

const props = defineProps<{ cities: CityEntity[] }>();
const emit = defineEmits<{
  (event: 'reorderCities', updatedCities: CityEntity[]): void;
  (event: 'removeCity', cityId: string): void;
}>();

const localCities = ref<CityEntity[]>(props.cities);
watch(props, () => {
  localCities.value = props.cities;
});

const list = ref<HTMLElement>();
const items = ref<HTMLElement[]>([]);
const activeIndex = ref(-1);
let draggable: ReturnType<typeof draggableList> | null = null;

onMounted(() => {
  if (list.value && items.value) {
    draggable = draggableList(list.value, items.value, onItemPositionChanged);
  }
});

const onItemPositionChanged = (oldIndex: number, newIndex: number): void => {
  localCities.value = swapArrayItems(localCities.value, oldIndex, newIndex);
  activeIndex.value = newIndex;
  emit('reorderCities', localCities.value);
};

const onDragStart = (event: MouseEvent, index: number) => {
  if (draggable) {
    activeIndex.value = index;
    draggable.onDragStart(event, index);
  }
};

const onDragEnd = () => {
  if (draggable) {
    activeIndex.value = -1;
    draggable.onDragEnd();
  }
};

const onRemoveCity = (cityId: string): void => {
  emit('removeCity', cityId);
};
</script>

<template>
  <ul
    class="city-list"
    ref="list">
    <li
      v-for="(city, index) in localCities"
      :key="city.id"
      class="item-container">
      <div
        class="city-item"
        :class="{ draggable: activeIndex === index }"
        @mouseup="onDragEnd()"
        ref="items">
        <div
          class="hamburger"
          @mousedown="onDragStart($event, index)">
          <HamburgerIcon />
        </div>

        <span class="city-name u-text-overflow">{{ city.name }}, {{ city.country }}</span>

        <IconButton
          class="city-item-trash-icon"
          @click="onRemoveCity(city.id)">
          <TrashIcon />
        </IconButton>
      </div>
    </li>
  </ul>
</template>

<style scoped>
.city-list {
  position: relative;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  row-gap: 10px;
}

.item-container {
  border: 1px solid var(--gray-light);
}

.city-item {
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  padding: 6px 5px;
  column-gap: 5px;
  background-color: var(--gray-light);

  &.draggable {
    z-index: 1;
    box-shadow: 2px 2px 4px 1px var(--shadow);
    cursor: grabbing;

    .hamburger {
      cursor: inherit;
    }
  }
}

.city-item-trash-icon {
  margin-left: auto;
  flex-shrink: 0;
}

.hamburger {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: grab;
}

.city-name {
  user-select: none;
}
</style>
