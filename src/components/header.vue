<script>
  import { createComponent } from './';

  export default createComponent({
  });
</script>
<template>
  <h1 class="resource-header">The Full Circle Library</h1>
  <router-link v-if='$route.name != "resources"' :to="{ name: 'resources', query: queryParams}" class='link-home'>
    <h1 class="resource-header">Back</h1>
  </router-link>

</template>

<style>
  .link-home {
    text-decoration: none;
  }

  .link-home h1 {
    font-weight: bold;
  }

  .link-home:focus, .link-home:hover {
    text-decoration: underline;
    color: var(--color-primary);
  }

  .resource-header {
    font-family: 'Alegreya', serif;
    font-size: 1.68em;
    color: var(--color-primary);
    font-weight: 300;
  }
</style>
