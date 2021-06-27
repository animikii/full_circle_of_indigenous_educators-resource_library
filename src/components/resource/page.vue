<script>
  import store from '../../store';
  import ResourceApi from '../../api/resources';

  import { createComponent } from '../';
  import LoadingSpinner from '../loading-spinner';

  const ResourcePage = createComponent({
    data() {
      return {
        loading: false,
        resource: undefined
      }
    },
    computed: {
      resourceId() {
        return this.$route.params.id;
      } 
    },
    mounted() {
      this.resource = this.resources.find(
        resource => resource._id === this.resourceId
      );

      if(!this.resource) {
        this.loading = true;
        store.actions.getResource(this.resourceId)
          .then(resource => this.resource = resource)
          .then(() => this.loading = false);
      }
    },
    components: {
      LoadingSpinner,
    },
  })

  const route = { 
    path: '/resource/:id',
    name: 'resource',
    component: ResourcePage
  };

  export { route };
  export default ResourcePage;
  
</script>

<template>
  <LoadingSpinner v-bind:enabled="loading"></LoadingSpinner> 
  <div v-if="resource">
    {{ resource.Title }}
  </div>
</template>
