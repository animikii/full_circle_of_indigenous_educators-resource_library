<script>
  import store from '../store';

  export default {
    data() { return store.state }
  } 
</script>

<template>
  <div>
    <p>
      <div>Test!?!</div>
      <span>Quoi?</span>
    </p>
  </div>
</template>


<style scoped>
  div {
    background: orange;
  }
  span {
    background: #777;
  }
  p {
    border: 2px solid black;
  }
</style>


