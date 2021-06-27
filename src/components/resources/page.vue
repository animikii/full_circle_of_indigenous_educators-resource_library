<script>
  import store from '../../store';

  import { createComponent } from '../';
  import SearchBar from '../search-bar';
  import LoadingSpinner from '../loading-spinner';
  import ResourceList from './list';
  import SideBar from './side-bar';

  export default createComponent({
    data() {
      return {
        loading: false,
      };
    },
    methods: {
      searchResources() {
        this.loading = true;

        const fields = [
          'Title',
          'Description',
          'Search Creators',
          'Search Nation',
          'Search Subject',
          'Search Theme',
          'Search Type'
        ];

        store.actions.searchResources(fields, this.searchQuery)
          .then(() => this.loading = false);

      },
      loadResources() {
        this.loading = true;

        store.actions.getResourcePage(this.currentToken)
          .finally(() => this.loading = false);
      },
    },
    created() {
      this.currentToken = this.$route.query.next;

      if(!store.state.resources.length) {
        this.loadResources();
      }

      this.$watch(
        () => this.currentToken,
        () => {
          this.$route.query.next = this.currentToken
}
      );

      this.$watch(
        () => this.$route.query,
        (to, from ) => {
          if(to.next) {
            let nextToken = to.next;
            store.actions.associateTokens(this.currentToken, nextToken);
            this.currentToken = pageToken;
          } else if (to.search) {
            this.searchResources(); 
            return;
          }

          this.loadResources();
        }
      );
    },
    components: {
      ResourceList,
      SideBar,
      SearchBar,
      LoadingSpinner
    }
  });
</script>

<template>
  <SearchBar>
    <LoadingSpinner v-bind:enabled='loading' fill='black'> </LoadingSpinner>
  </SearchBar>
  <ResourceList></ResourceList>
</template>

<style>
</style>

