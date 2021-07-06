<script>
  import Star from '../star';

  export default {
    props: ['review'],
    components: {
      Star,
    },
  };
</script>

<template>
  <div class='review'>
    <div class='review-info'> 
        <span class='review-raiting'><Star v-bind:rating='review.Rating'></Star></span>
        <span class='reviewer-name'>{{ review['Reviewer Name'] }}</span>
    </div>
    <div class='review-content'>
      {{ review.Review }}
    </div>
  </div>
</template>

<style>
  .review .review-info {
    display: inline-flex;
    align-items: center;
    padding: 6px 3px;
    padding-left: 0;
    margin-bottom: 6px;
    border-bottom: 1px solid var(--color-text);
  }

  .review .reviewer-name {
    margin-left: 6px;
  }

  .review {
    margin-bottom: 16px;
  }
</style>
