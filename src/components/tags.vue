<script>
  export default {
    props: ["category", "tags"],
  };
</script>

<template>
    <span class="resource-category" v-if="tags">
      {{ category }}
    </span>
    <div v-if="tags">
      <span class="resource-tag" v-for="(tag, i) in tags">
        {{ tag }}<span v-if="i + 1 < tags.length">, </span>
      </span>
    </div>
</template>

<style>


/*
  .resource-tag {
    color: var(--color-primary);
    text-decoration: none;
  }

  .resource-tag:hover, .resource-tag:focus {
    text-decoration: underline;
  }
*/

  .resource-category {
    font-weight: bold;
    display: inline-block;
    height: 100%;
  }

</style>
