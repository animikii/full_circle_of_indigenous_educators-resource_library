<script>
  import store from '../../store';
  import ResourceApi from '../../api/resources';

  import { createComponent } from '../';
  import LoadingSpinner from '../loading-spinner';
  import ResourceItem from '../resources/list-item';

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
      ResourceItem,
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
  <div v-if="resource" class='resource-page'>
    <ResourceItem v-bind:resource="resource">
      <div class='description'>
        <div>
          {{ resource.Description }}
        </div>
        <div>
          <a v-if='resource.Link' v-bind:href="resource.Link" class="resource-link">
            Link to Resource
          </a>
        </div>
      </div>
    </ResourceItem>
  </div>
</template>

<style>
  .resource-page .label {
    font-weight: bold;
  }

  .resource-page .description {
    white-space: pre-line;
    grid-column-start: 1;
    grid-column-end: 3;
    margin-top: 8px;
  }

  .resource-tile .details {
    padding-top: 0;
  }

  .resource-tile .image {
    margin: 0;
  }

  .resource-tile .image img {
    max-height: 300px;
  }

  .resource-tile .resource-link {
    font-size: 1.5em;
    font-weight: bold;
    color: var(--color-primary);
    margin: 8px 0px;
    display: block;
    text-decoration: none;
  }  

  .resource-tile .resource-link:focus, .resource-tile .resource-link:hover {
    text-decoration: underline;
  }

</style>
