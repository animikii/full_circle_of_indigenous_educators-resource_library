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
      initResources() {
        this.searchQuery = this.$route.query.search;

        if(this.$route.query.token) {
          this.currentToken = this.$route.query.token;
        }

        if(this.searchQuery && store.isStartToken(this.currentToken)) {
          this.searchResources(); 
        } else {
          this.loadResources(this.currentToken);
        }
      },
      searchResources() {
        this.loading = true;

        store.actions.searchResources()
          .then(() => this.loading = false);

      },
      loadResources(token) {
        this.loading = true;

        store.actions.getResourcePage(token)
          .finally(() => this.loading = false);
      },
    },
    created() {
      this.initResources();

      this.$watch(
        () => this.$route.query,
        (to, from ) => {
          if(this.$route.name == 'resources') {
            this.initResources();
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

