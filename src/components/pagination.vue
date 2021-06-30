<script>
  import { createComponent } from './';
  import store from '../store';

  export default createComponent({
    props: ['defaultRoute'],
  });
</script>

<template>
  <div class='pagination'>
    <span>
      <router-link v-if='prevToken' :to="{ name: $route.name, query: { token: prevToken, search: searchQuery }}">
        Previous
      </router-link>
    </span>
    <span>
      <router-link v-if='nextToken' :to="{ name: $route.name, query: { token: nextToken, search: searchQuery }}">
        Next
      </router-link>
    </span>
  </div>
</template>

<style>
  .pagination {
    display: flex;
    justify-content: space-between;
    max-width: 150px;
    margin: auto;
    width: 100%;
  }
</style>
