<script>
  import { ref } from 'vue';

  import { createComponent } from './';
  import ResourceApi from '../api/resources';
  import store from '../store';

  import LoadingSpinner from './loading-spinner';

  export default createComponent({
    data() {
      return {
      }
    },
    methods: {
      search(e) {
        this.searchQuery = e.target.value;
        this.currentToken = store.createStartToken(); 

        this.$router.replace({
          name: 'resources',
          query: this.queryParams 
        });
      }
    },
    components: {
      LoadingSpinner,
    },
    created() {
    }
  });
</script>

<template>
  <div class="resource-search-bar">
    <input
      type="text"
      placeholder="Search"
      v-on:input='search'
      v-on:keyup.enter='search'
      v-bind:value="searchQuery" >
      <LoadingSpinner v-bind:class="{ spinner: searching }" v-bind:enabled='searching' ></LoadingSpinner>
    <slot></slot>
  </div>
</template>

<style>

  .resource-search-bar {
    display: flex;
    align-items: center;
  }

  .resource-search-bar input {
    font-size: 1.5em;
    width: 50%;
    padding: 8px;
    box-sizing: border-box;
  }

  @media(max-width: 1024px) {
    .resource-search-bar {
      flex-direction: column;
      justify-content: center;
    }
    .resource-search-bar input {
      width: 100%;
    }

    .spinner {
      margin-bottom: -32px;
    }
  }

</style>
