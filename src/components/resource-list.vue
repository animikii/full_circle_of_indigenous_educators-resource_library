<script>
  import { ref } from 'vue';

  import { createComponent } from './';
  import ResourceApi from '../api/resources';
  import store from '../store';
  import LoadingSpinner from './loading-spinner';

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
      LoadingSpinner
    }
  });
</script>

<template>
  <div class="resource-list">
    <div class="search-bar">
      <input type="text" v-on:input='search'>
      <LoadingSpinner v-bind:enabled='searching' ></LoadingSpinner>
    </div>
    <ul>
      <li v-for="resource in resources">
        <div class="resource-tile">
          <img aria-hidden=true v-bind:src="resource.Image[0].url"/>
          <div>
            {{ resource.Title }}
          </div>
          <div>
            {{ resource['Creators Lookup'] }}
          </div>
          <div>
            {{ resource['Type Lookup'] }}
          </div>
          <div>
            {{ resource['Themes Lookup'] }}
          </div>
          <div>
            {{ resource['Types Lookup'] }}
          </div>
          <div>
            {{ resource['Age Range'] }}
          </div>
         
        </div>
      </li>
    </ul>
  </div>
</template>

<style>
  .resource-list {
    background: orange;
    margin: 0;
    padding: 1em;
    flex: 1;

    max-width: 100%;
  }

  .resource-list ul {
    display: grid;
    grid-template-columns: 1fr 1fr; 
    grid-template-rows: minmax(0px, 300px);
    max-width: 100%;
  }

  .resource-list li {
    height: 100%;
  }


  .search-bar {
    display: flex;
    align-items: center;
  }

  .resource-tile {
    height: 100%;
  }

  .resource-tile img {
    max-height: 100%;    
    max-width: 100%;
    object-fit: contain;
  }
</style>
