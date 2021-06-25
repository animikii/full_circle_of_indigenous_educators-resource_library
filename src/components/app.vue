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
    <SideBar></SideBar>
    <ResourceList></ResourceList>
  </div>
</template>

<style>
  #root {
    display: flex;
    flex-direction: row;
  }
</style>

