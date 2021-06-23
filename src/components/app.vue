<script>
  import store from '../store';
  import ResourceApi from '../api/resources';
  import ResourceList from './resource-list';
  import Test from './test';

  export default {
    mounted() {
      ResourceApi.get().then(resources => store.setResources(resources));
    },
    components: {
      ResourceList,
      Test
    }
  };
</script>

<template>
  <ResourceList></ResourceList>
  <Test></Test>
</template>

<style scoped>
  div {
    background: orange;
  }
</style>

