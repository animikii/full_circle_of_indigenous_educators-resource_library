<script>
  import { createComponent } from './';
  import store from '../store';

  export default createComponent({
    props: ['defaultRoute'],
    methods: {
      scrollTop() {
        window.scrollTo(0, 0);
      }
    }
  });
</script>

<template>
  <div class='pagination'>
    <span v-bind:class='{ visible: prevToken }' >
      <router-link v-on:click='scrollTop' :to="{ name: $route.name, query: { ...queryParams, token: prevToken }}">
        Previous
      </router-link>
    </span>
    <span v-bind:class='{ visible: nextToken }' style='margin-left: 16px;'>
      <router-link v-on:click='scrollTop' :to="{ name: $route.name, query: { ...queryParams, token: nextToken }}">
        Next
      </router-link>
    </span>
  </div>
</template>

<style>
  .pagination {
    display: flex;
    justify-content: flex-end;
    flex: 1;
  }

  .pagination a {
    background: white;
    border: 1px solid var(--color-primary);
    color: var(--color-primary);  
    padding: 8px 16px;
    color: var(--color-primary);  
    border-radius: 5px;
    text-decoration: none;

    visibility: hidden;
  }

  .pagination .visible a {
    visibility: visible; 
  }

  @media(max-width: 1024px) {
    .pagination {
      margin-top: 24px;
    }
  }
</style>
