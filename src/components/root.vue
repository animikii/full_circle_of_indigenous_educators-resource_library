<script>
  import { nextTick } from 'vue';
  import { createComponent } from './';
  import store from '../store';

  import Header from './header';
  import Notifications from './notifications';
  import { route as resourcesRoute } from './resources/page';

  export default createComponent({
    components: {
      Header,
      Notifications
    },
    created() {
      store.actions.initializeResources(resourcesRoute);
    }
  });

</script>

<template>

  <div id="root">
    <Notifications></Notifications>
    <Header></Header>

    <router-view></router-view>
  </div>

</template>

<style>
  #app {
    display: flex;
    flex-direction: column;
  }

  #root {
    --color-primary: #1a67b5;
    --color-text: rgb(91, 61, 61);

    --transition-time: 300ms;
    --header-size: 1.4em;

    font-family: Lato, sans-serif;
    color: var(--color-text);

    height: auto;
  }

  @media(max-width: 1220px) {
    #root {
      padding: 0 1em;
    }
  }
</style>
