<script setup lang="ts">
import { onMounted, ref, watch, watchEffect } from 'vue';
import { setElementTransform, swapArrayItems } from '@/helpers/';
import { HamburgerIcon, TrashIcon } from '@/components/icons/';
import { IconButton } from '@/components/ui/';
import type CityEntity from '@/typings/models/CityEntity';
import useDraggableList from '@/composables/useDraggableList';

const props = defineProps<{ cities: CityEntity[] }>();
const emit = defineEmits<{
  (event: 'reorderCities', updatedCities: CityEntity[]): void;
  (event: 'removeCity', cityId: string): void;
}>();

const localCities = ref<CityEntity[]>(props.cities);
watchEffect(() => {
  localCities.value = props.cities;
});

const list = ref<HTMLElement>();
const items = ref<HTMLElement[]>([]);
const activeIndex = ref(-1);

let draggable: ReturnType<typeof useDraggableList> | null = null;

onMounted(() => {
  if (list.value && items.value) {
    draggable = useDraggableList(list.value, items.value, onItemPositionChanged);
  }
});

const onDragStart = (event: MouseEvent, index: number) => {
  if (draggable) {
    activeIndex.value = index;

    draggable.onDragStart(event, index);
  }
};

const onDragEnd = () => {
  if (draggable) {
    draggable.onDragEnd();

    activeIndex.value = -1;
  }
};

const onItemPositionChanged = (oldIndex: number, newIndex: number): void => {
  localCities.value = swapArrayItems(localCities.value, oldIndex, newIndex);
  activeIndex.value = newIndex;
  emit('reorderCities', localCities.value);
};

const onRemoveCity = (cityId: string): void => {
  emit('removeCity', cityId);
};
</script>

<template>
  <ul
    :class="styles.cityList"
    ref="list">
    <li
      v-for="(city, index) in localCities"
      :key="city.id"
      :class="styles.itemContainer">
      <div
        :class="[styles.cityItem, { [styles.draggable]: activeIndex === index }]"
        @mouseup="onDragEnd()"
        ref="items">
        <div
          :class="styles.hamburger"
          @mousedown="onDragStart($event, index)">
          <HamburgerIcon />
        </div>

        <span :class="styles.cityName">{{ city.name }}, {{ city.country }}</span>

        <IconButton
          :class="styles.cityItemTrash"
          @click="onRemoveCity(city.id)">
          <TrashIcon />
        </IconButton>
      </div>
    </li>
  </ul>
</template>

<style module="styles" lang="scss">
@import '@/styles/mixins.scss';

.cityList {
  position: relative;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  row-gap: 10px;
}

.itemContainer {
  border: 1px solid var(--gray-light);
}

.cityItem {
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  padding: 6px 5px;
  column-gap: 5px;
  background-color: var(--gray-light);

  &Trash {
    margin-left: auto;
    flex-shrink: 0;
  }

  &.draggable {
    z-index: 1;
    box-shadow: 2px 2px 4px 1px var(--shadow);
    cursor: grabbing;

    .hamburger {
      cursor: inherit;
    }
  }
}

.hamburger {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: grab;
}

.cityName {
  @include text-overflow;
  user-select: none;
}
</style>
