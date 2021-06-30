<script>
  import store from '../../store';

  import { createComponent } from '../';
  import SearchBar from '../search-bar';
  import LoadingSpinner from '../loading-spinner';
  import ResourceList from './list';
  import SideBar from './side-bar';
  import Pagination from '../pagination';

  const routeConfig = { 
    path: '/',
    name: 'resources'
  };

  const ResourcesPage = createComponent({
    data() {
      return {
        loading: false
      };
    },
    computed: {
      route() {
        return routeConfig;
      }
    },
    methods: {
    },
    created() {
      store.actions.getResourcePage();

      this.$watch(
        () => this.$route.query,
        (to, from ) => {
          if(this.$route.name == 'resources') {
            if(this.$route.query.token) {
              this.currentToken = this.$route.query.token;
            }
            store.actions.getResourcePage();
          }
        }
      );
    },
    components: {
      ResourceList,
      SideBar,
      SearchBar,
      LoadingSpinner,
      Pagination
    }
  });

  const route = {
    ...routeConfig,
    component: ResourcesPage
  };

  export { route };
  export default ResourcesPage;

</script>

<template>
  <SearchBar>
    <LoadingSpinner v-bind:enabled='loading' fill='black'> </LoadingSpinner>
    <Pagination v-bind:defaultRoute="route" class='resources-pagination'></Pagination>
  </SearchBar>
  <ResourceList v-bind:loading="loading"></ResourceList>
</template>

<style>
  .resources-pagination {
    float: right;
  }
</style>

