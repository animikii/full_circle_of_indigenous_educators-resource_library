<script>
  import _ from 'lodash';

  import { createComponent } from '../';
  import ResourceItem from './list-item';

  export default createComponent({
    components: {
      ResourceItem,
    }
  });
</script>

<template>
  <div class="resource-list-container">
      <ul class='resource-list'>
        <li v-for="resource in resources">
          <ResourceItem v-bind:resource="resource"></ResourceItem>
        </li>
      </ul>
    <div class='pagination'>
      <a href='#'>Previous</a>
      <router-link v-if='nextToken' :to="{ name: 'resources', query: { next: nextToken }}">
        Next
      </router-link>
    </div>
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

  .resource-list-container .pagination {
    display: flex;
    justify-content: space-between;
    max-width: 150px;
    margin: auto;
  }
</style>
