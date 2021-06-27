<script>
  import { createComponent } from './';

  import Header from './header';

  export default createComponent({
    components: {
      Header,
    }
  });

</script>

<template>

  <div id="root">
    <Header></Header>

    <router-view></router-view>
  </div>

</template>

<style>
  #root {
    --color-primary: #1a67b5;
    --color-text: rgb(91, 61, 61);

    --transition-time: 300ms;

    font-family: Lato, sans-serif;
    color: var(--color-text);
  }

</style>
