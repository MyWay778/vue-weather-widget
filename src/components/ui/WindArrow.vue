<script setup lang="ts">
import ArrowIcon from '../icons/ArrowIcon.vue';

defineProps<{ deg: number }>();
</script>

<template>
  <ArrowIcon :style="{ rotate: `${deg}deg` }" />
</template>
