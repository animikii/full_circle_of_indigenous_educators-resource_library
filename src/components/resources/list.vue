<script>
  import _ from 'lodash';

  import { createComponent } from '../';
  import ResourceItem from './list-item';

  export default createComponent({
    props: ["loading"],
    components: {
      ResourceItem,
    },
  });
</script>

<template>
  <div class="resource-list-container">
      <div v-if='!resources.length && !loading' class='not-found'>
        No resources found.
      </div>
      <ul class='resource-list'>
        <li v-for="resource in resources">
          <ResourceItem v-bind:resource="resource"></ResourceItem>
        </li>
      </ul>
  </div>
</template>

<style>
  .resource-list-container {
    background: transparent;
    margin: 0;
    padding: 1em;
    flex: 1;
    max-width: 100%;
  }

  .resource-list {
    display: grid;
    grid-template-columns: 50% 50%; 
    grid-auto-rows: auto;
    row-gap: 1em;

    max-width: 100%;
    padding: 0;
  }

  .resource-list > li {
    height: 100%;
    display: block;
  }

  .resource-list-container .not-found {
    font-size: 1.5em;
    font-weight: bold; 
  }
</style>
