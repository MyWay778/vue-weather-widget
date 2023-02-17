<template>
  <h2 :class="styles.title"><slot /></h2>
</template>

<style module="styles" lang="scss">
.title {
  font-size: 15px;
  font-weight: 600;
}
</style>
