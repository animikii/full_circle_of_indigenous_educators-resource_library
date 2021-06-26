<script>

  import store from '../store';
  import ResourceApi from '../api/resources';
  import ResourceList from './resource-list';
  import SideBar from './side-bar';

  export default {
    mounted() {
      ResourceApi.get().then(resources => store.setResources(resources));
    },
    components: {
      ResourceList,
      SideBar,
    }
  };
</script>

<template>
  <div id="root">
    <ResourceList></ResourceList>
  </div>
</template>

<style>
  #root {
    display: flex;
    flex-direction: row;
 
    --color-primary: #1a67b5;
    --color-text: rgb(91, 61, 61);

    --transition-time: 300ms;

    font-family: Lato, sans-serif;
    color: var(--color-text);


  }
</style>

