<template>
  <router-link v-if='$route.name != "resources"' :to="{ path: '/' }" class='link-home'>
    <h1 class="resource-header">Resource Library</h1>
  </router-link>
  <h1 v-if='$route.name == "resources"' class="resource-header">Resource Library</h1>

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
