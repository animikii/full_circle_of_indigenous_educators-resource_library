<script>
  import { ref } from 'vue';

  import { createComponent } from './';
  import ResourceApi from '../api/resources';
  import store from '../store';

  import LoadingSpinner from './loading-spinner';
  import ResourceItem from './resource-item';

  export default createComponent({
    data() {
      return {
        searching: false
      }
    },
    methods: {
      search(e) {
        this.searching = true;
        const fields = [
          'Title',
          'Description',
          'Search Creators',
          'Search Nation',
          'Search Subject',
          'Search Theme',
          'Search Type'
        ];
        const text = e.target.value;

        ResourceApi.search(fields, text)
          .then(resources => store.setResources(resources))
          .then(() => this.searching = false);
      }
    },
    components: {
      LoadingSpinner,
      ResourceItem
    }
  });
</script>

<template>
  <div class="resource-list">
    <h1 class="header">Resource Library</h1>
    <div class="search-bar">
      <input type="text" v-on:input='search' placeholder="Search">
      <LoadingSpinner v-bind:enabled='searching' ></LoadingSpinner>
    </div>

    <ul>
      <li v-for="resource in resources">
        <ResourceItem v-bind:resource="resource"></ResourceItem>
      </li>
    </ul>
  </div>
</template>

<style>
  .resource-list {
    background: transparent;
    margin: 0;
    padding: 1em;
    flex: 1;

    max-width: 100%;
  }

  .resource-list .header {
    font-family: 'Alegreya', serif;
    font-size: 1.68em;
    color: var(--color-primary);
    font-weight: 300;
  }

  .resource-list > ul {
    display: grid;
    grid-template-columns: 50% 50%; 
    grid-auto-rows: auto;
    row-gap: 1em;

    max-width: 100%;
    padding: 0;
  }

  .resource-list > ul > li {
    height: 100%;
    display: block;
  }


  .search-bar {
    display: flex;
    align-items: center;
  }

  .search-bar input {
    font-size: 1.5em;
    width: 50%;
    padding: 8px;
  }
</style>
