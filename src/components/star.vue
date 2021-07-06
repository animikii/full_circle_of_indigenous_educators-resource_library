<script>
  export default {
    props: ['rating'],
    computed: {
      ratingPercentage() {
        return `${this.rating/5 * 100}%`;
      }
    }
  };
</script>
<template>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css" rel="stylesheet" />
    <span v-if='rating' class="score">
        <div class="score-wrap">
            <span class="stars-active" v-bind:style="{ width: ratingPercentage }">
                <i class="fa fa-star" aria-hidden="true"></i>
                <i class="fa fa-star" aria-hidden="true"></i>
                <i class="fa fa-star" aria-hidden="true"></i>
                <i class="fa fa-star" aria-hidden="true"></i>
                <i class="fa fa-star" aria-hidden="true"></i>
            </span>
            <span class="stars-inactive">
                <i class="fa fa-star-o" aria-hidden="true"></i>
                <i class="fa fa-star-o" aria-hidden="true"></i>
                <i class="fa fa-star-o" aria-hidden="true"></i>
                <i class="fa fa-star-o" aria-hidden="true"></i>
                <i class="fa fa-star-o" aria-hidden="true"></i>
            </span>
        </div>
  </span>
</template>
<style>
.score {
  display: flex;
  align-items: center;
  font-size: 16px;
  position: relative;
  overflow: hidden;
}

.score-wrap {
  display: inline-block;
  position: relative;
  height: 19px;
}

.score .stars-active {
  color: var(--color-text);
  position: relative;
  z-index: 10;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
}

.score .stars-inactive {
  color: grey;
  position: absolute;
  top: 0;
  left: 0;
  -webkit-text-stroke: initial;
  /* overflow: hidden; */
}

</style>
