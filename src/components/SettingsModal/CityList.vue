<script setup lang="ts">
import type CityEntity from '@/typings/CityEntity';
import { nextTick, onMounted, ref, watch } from 'vue';
import HamburgerIcon from '../icons/HamburgerIcon.vue';
import TrashIcon from '../icons/TrashIcon.vue';

const props = defineProps<{ cities: CityEntity[] }>();

const localCities = ref(props.cities);

const list = ref(null);
const item = ref(null);
const target1 = ref(null);

let initialX = 0;
let initialY = 0;

let testX = 0;
let testY = 0;
// watch(
//   localCities,
//   () => {
//     console.log('reverse!!!');
//     initialX = testX;
//     initialY = testY;

//     item.value[0].style.transform = `translate(${testX}px, ${testY}px)`;
//   },
//   {
//     flush: 'sync'
//   }
// );

let activeItem = null;

onMounted(() => {
  target1.value[1].addEventListener('dragover', event => {
    // console.log('dragover', event.target);

    const { target } = event;
    const trg = target.getBoundingClientRect();
    // console.log('target:', targetBound.bottom);

    const source = activeItem.getBoundingClientRect();
    // console.log('source:', sourceBound.bottom);

    if (source.bottom > trg.bottom) {
      console.log('slip');

      localCities.value.reverse();

      initialX = event.x;
      initialY = event.y;

      // item.value[0].style.transform = `translate(${event.x}px, ${event.y}px)`;
      dragHandler(event);
    }
  });

  target1.value[1].style.zIndex = '2';
});

const dragStartHandler = (event: Event, id) => {
  console.log('drag start', id);
  // item.value[0].style.position = 'relative';
  item.value[0].style.zIndex = '1';

  activeItem = item.value[0];

  event.target?.removeEventListener('dragover', dragOverHandler);

  initialX = event.x;
  initialY = event.y;
};

const dragEndHandler = (event: Event) => {
  item.value[0].style.position = '';
  item.value[0].style.transform = '';

  initialX = 0;
  initialY = 0;
};

const dragHandler = (event: Event) => {
  console.log('dragging', event);
  const x = event.x - initialX;
  const y = event.y - initialY;

  item.value[0].style.transform = `translate(${x}px, ${y}px)`;
};

const dragOverHandler = (event: Event) => {
  event.stopPropagation();
  console.log('dragOver:', event);
};
</script>

<template>
  <ul
    :class="styles.cityList"
    ref="list">
    <li
      v-for="city in localCities"
      :key="city.id"
      :class="styles.itemContainer">
      <div
        :class="styles.cityItem"
        ref="item">
        <div
          :class="styles.hamburger"
          @dragstart="dragStartHandler($event, city.id)"
          @dragend="dragEndHandler"
          @drag="dragHandler"
          draggable="true">
          <HamburgerIcon />
        </div>
        <span>{{ city.name }}, {{ city.country }}</span>
        <TrashIcon :class="styles.cityItemTrash" />
        <div
          ref="target1"
          :class="styles.dragTarget"></div>
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
}

.hamburger {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: grab;
}

.dragTarget {
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
}
</style>
