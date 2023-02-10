<script setup lang="ts">
import setElementTransform from '@/helpers/setElementTransform';
import swapArrayItems from '@/helpers/swapArrayItems';
import type CityEntity from '@/typings/CityEntity';
import { computed, onMounted, ref, watch, watchEffect } from 'vue';
import HamburgerIcon from '@/components/icons/HamburgerIcon.vue';
import TrashIcon from '../../icons/TrashIcon.vue';
import ButtonWIthIcon from '../../UI/ButtonWIthIcon.vue';

const props = defineProps<{ cities: CityEntity[] }>();
const emit = defineEmits<{
  (event: 'reorderCities', updatedCities: CityEntity[]): void;
  (event: 'removeCity', cityId: number): void;
}>();

const localCities = ref<CityEntity[]>(props.cities);

watchEffect(() => {
  localCities.value = props.cities;
});

const list = ref<HTMLElement>();
let listReact: DOMRect | null = null;
// onMounted(() => {
//   if (list.value) {
//     listReact = list.value.getBoundingClientRect();
//   }
// });

const TRANSFORM_SCALE = 1.03;
const items = ref<HTMLElement[]>([]);

let initialX = 0;
let initialY = 0;
let activeEl: HTMLElement | null = null;
let activeIndex = ref(-1);

const dragStartHandler = (event: MouseEvent, index: number) => {
  if (!items.value) return;
  initialX = event.x;
  initialY = event.y;

  activeEl = items.value[index];
  activeIndex.value = index;

  if (list.value) {
    listReact = list.value.getBoundingClientRect();
  }

  setElementTransform(activeEl, { scale: TRANSFORM_SCALE });

  window.addEventListener('mousemove', dragHandler);
};

const dragHandler = (event: MouseEvent) => {
  if (!activeEl || !items.value) return;

  const x = event.x - initialX;
  const y = event.y - initialY;

  setElementTransform(activeEl, { x, y, scale: TRANSFORM_SCALE });

  const activeRect = activeEl.getBoundingClientRect();

  items.value.forEach((target, targetIndex) => {
    if (target === activeEl) return;

    const targetRect = target.getBoundingClientRect();

    if (activeBelowTarget() || activeAboveTarget()) {
      swapActiveAndTarget();
    }

    function activeBelowTarget(): boolean {
      return (
        // eslint-disable-next-line prettier/prettier
        activeIndex.value < targetIndex &&
        targetRect.top < activeRect.top &&
        targetRect.bottom < activeRect.bottom
      );
    }

    function activeAboveTarget(): boolean {
      return (
        // eslint-disable-next-line prettier/prettier
        activeIndex.value > targetIndex && 
        targetRect.top > activeRect.top && 
        targetRect.bottom > activeRect.bottom
      );
    }

    function swapActiveAndTarget(): void {
      localCities.value = swapArrayItems(localCities.value, activeIndex.value, targetIndex);
      items.value = swapArrayItems(items.value, activeIndex.value, targetIndex);

      activeIndex.value = targetIndex;

      updateActivePos();
    }

    function updateActivePos(): void {
      if (!activeEl) return;

      const scaleXDiff = getScaleDiff(activeRect.width);
      const actualX = activeRect.x - targetRect.x + scaleXDiff;
      initialX = event.x - actualX;

      const scaleYDiff = getScaleDiff(activeRect.height);
      const actualY = activeRect.y - targetRect.y + scaleYDiff;
      initialY = event.y - actualY;

      setElementTransform(activeEl, { x: actualX, y: actualY, scale: TRANSFORM_SCALE });
    }

    function getScaleDiff(size: number): number {
      const RECTANGLE_SIDES = 2;
      return (size - size / TRANSFORM_SCALE) / RECTANGLE_SIDES;
    }
  });

  if (activeIsOutOfBounds()) {
    dragEndHandler();
  }

  function activeIsOutOfBounds(): boolean {
    if (!listReact) return false;

    return (
      // eslint-disable-next-line prettier/prettier
      listReact.left > activeRect.right || 
      listReact.top > activeRect.bottom ||
      listReact.right < activeRect.left ||
      listReact.bottom < activeRect.top
    );
  }
};

const dragEndHandler = () => {
  if (!activeEl) return;

  activeEl.style.transform = '';
  initialX = 0;
  initialY = 0;
  activeEl = null;
  activeIndex.value = -1;

  window.removeEventListener('mousemove', dragHandler);
  emit('reorderCities', localCities.value);
};

const onRemoveCity = (cityId: number): void => {
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
        @mouseup="dragEndHandler"
        ref="items">
        <div
          :class="styles.hamburger"
          @mousedown="dragStartHandler($event, index)">
          <HamburgerIcon />
        </div>
        <span :class="styles.cityName">{{ city.name }}, {{ city.country }}</span>
        <ButtonWIthIcon :class="styles.cityItemTrash" @click="onRemoveCity(city.id)">
          <TrashIcon />
        </ButtonWIthIcon>
      </div>
    </li>
  </ul>
</template>

<style module="styles" lang="scss">
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
  user-select: none;
}
</style>
