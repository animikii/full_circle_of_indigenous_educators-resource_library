<script>
  import store from '../../store';
  import ResourceApi from '../../api/resources';

  import { createComponent } from '../';
  import LoadingSpinner from '../loading-spinner';
  import ResourceItem from '../resources/list-item';
  import Review from './review';
  import ReviewSubmission from './review-submission';

  const ResourcePage = createComponent({
    data() {
      return {
        loading: false,
      }
    },
    computed: {
      resourceId() {
        return this.$route.params.id;
      },
      resourceReviews () {
        let reviews =  this.reviews[this.resourceId];

        if(reviews) {
          return reviews;
        } else {
          return [];
        }
      }
    },
    mounted() {
      this.loading = true;
      store.actions.getResource(this.resourceId)
        .finally(() => this.loading = false);
    },
    created() {
    },
    components: {
      LoadingSpinner,
      ResourceItem,
      Review,
      ReviewSubmission,
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
  <div v-if="currentResource" class='resource-page'>
    <ResourceItem v-bind:expanded="true" v-bind:resource="currentResource">
      <h2 class='review-header'>Reviews</h2>

      <div v-if='!resourceReviews.length'>
        No reviews have been posted for this resource.
      </div>
      <div v-for='review in resourceReviews' class='reviews'>
        <Review v-bind:review='review'></Review>
      </div>
      <ReviewSubmission class="review-submission"></ReviewSubmission>
    </ResourceItem>
  </div>
</template>

<style>
  .reviews {
  }

  .review-header {
    font-size: var(--header-size);
    margin-bottom: 8px;
  }

  .review-submission {
    margin-top: 8px;
  }
</style>
