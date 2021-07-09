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
      this.loading = true;

      store.actions.getResourcePage().finally(() => this.loading = false);

      this.$watch(
        () => this.$route.query,
        (to, from ) => {
          if(this.$route.name == 'resources') {
            if(this.$route.query.token) {
              this.currentToken = this.$route.query.token;
            }
            this.loading = true;
            store.actions.getResourcePage().finally(() => this.loading = false);
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
    <Pagination v-if='nextToken || prevToken' v-bind:defaultRoute="route" class='resources-pagination'></Pagination>
  </SearchBar>

  <div class='resources-page-content'>
    <SideBar></SideBar>
    <div style='flex: 1'>
      <ResourceList v-bind:loading="loading"></ResourceList>
      <Pagination style='margin-bottom: 32px; justify-content: center;' v-bind:defaultRoute="route" class='resources-pagination bottom'></Pagination>
    </div>
  </div>
</template>

<style>

  .resources-page-content {
    display: flex;
  }

  .resources-pagination.bottom {
    display: none;
  }


  @media(max-width: 1024px) {
    .resources-page-content {
      flex-direction: column;
    }

    .resources-pagination.bottom {
      display: flex; 
    }
  }
</style>

