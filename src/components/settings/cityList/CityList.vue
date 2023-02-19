<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { setElementTransform, swapArrayItems } from '@/helpers/';
import { HamburgerIcon, TrashIcon } from '@/components/icons/';
import { IconButton } from '@/components/ui/';
import type CityEntity from '@/typings/models/CityEntity';

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
let listReact: DOMRect | null = null;

const TRANSFORM_SCALE = 1.03;
const items = ref<HTMLElement[]>([]);

// values for the drag and drop feature
let initialX = 0;
let initialY = 0;

// activeEl - the element being dragged
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

  // make active element visually active
  setElementTransform(activeEl, { scale: TRANSFORM_SCALE });

  window.addEventListener('mousemove', dragHandler);
};

const dragHandler = (event: MouseEvent) => {
  if (!activeEl || !items.value) return;

  const x = event.x - initialX;
  const y = event.y - initialY;

  // moving active element
  setElementTransform(activeEl, { x, y, scale: TRANSFORM_SCALE });

  // get position of activeEl(draggable)
  const activeRect = activeEl.getBoundingClientRect();

  // loop through elements to find intersection with activeEl(dragabble)
  items.value.forEach((target, targetIndex) => {
    if (target === activeEl) return;

    // get target(target for drop) position
    const targetRect = target.getBoundingClientRect();

    // if active (draggable) element is in position (above or below target) - swap elements
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
      // need to synchronize localCities (data to render) and elements (dom elements)
      localCities.value = swapArrayItems(localCities.value, activeIndex.value, targetIndex);
      items.value = swapArrayItems(items.value, activeIndex.value, targetIndex);

      activeIndex.value = targetIndex;

      // by changing the order of the elements, we need to update the position of the active element
      updateActivePos();
    }

    function updateActivePos(): void {
      if (!activeEl) return;

      // we are using scaling in the transform that resizes the element, so we need to resolve this difference
      const scaleXDiff = getScaleDiff(activeRect.width);
      // after changing the order of the elements, the active element is set to the place of the target element,
      // but the active element can be shifted from the target, and we need to get this offset
      const actualX = activeRect.x - targetRect.x + scaleXDiff;
      // initialX - the current mouse position without the x offset of the active element
      initialX = event.x - actualX;

      const scaleYDiff = getScaleDiff(activeRect.height);
      const actualY = activeRect.y - targetRect.y + scaleYDiff;
      initialY = event.y - actualY;

      // update active element position
      setElementTransform(activeEl, { x: actualX, y: actualY, scale: TRANSFORM_SCALE });
    }

    function getScaleDiff(size: number): number {
      const RECTANGLE_SIDES = 2;
      return (size - size / TRANSFORM_SCALE) / RECTANGLE_SIDES;
    }
  });

  // if the active (draggable) element is outside the list, stop dragging
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
        @mouseup="dragEndHandler"
        ref="items">
        <div
          :class="styles.hamburger"
          @mousedown="dragStartHandler($event, index)">
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
