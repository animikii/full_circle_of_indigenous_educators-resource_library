<template>
  <ul>
    <li v-for="resource in resources">
      <div>
        {{ resource.Title }}
        {{ resource.Description }}
      </div>
    </li>
  </ul>
  <test></test>
</template>

<script>
  import store from '../store';
  import ResourceApi from '../api/resources';
  import test from './test';

  export default {
    data() {
      return store.state;
    },
    mounted() {
      ResourceApi.get().then(resources => store.setResources(resources));
    },
    components: {
      test
    }
  };
</script>

