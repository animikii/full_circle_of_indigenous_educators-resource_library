<script>
  import { createSimpleComponent } from './';
  export default createSimpleComponent();
</script>

<template>
  <ul class="resource-list">
    <li v-for="resource in resources">
      {{ resource.Title }}
      {{ resource.Description }}
    </li>
  </ul>
</template>

<style>
  .resource-list {
    background: orange;
  }
</style>
