<script setup lang="ts">
import ArrowIcon from '../shared/icons/ArrowIcon.vue'

const { deg } = defineProps<{ deg: number }>()
</script>

<template>
  <ArrowIcon :style="{ rotate: `${deg}deg` }" />
</template>
