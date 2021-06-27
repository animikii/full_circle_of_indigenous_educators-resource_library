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
      <a href="#" class="resource-tag" v-for="(tag, i) in tags">
        {{ tag }}<span v-if="i + 1 < tags.length">, </span>
      </a>
    </div>
</template>

<style>
/*
  .resource-tag {
    border-radius: 20px;
    border: 2px solid var(--color-primary);
    background: var(--color-primary);
    color: white;
    padding: 0px 12px;
    font-weight: bold;
    display: inline-block;
    text-decoration: none;
    margin: 2px;

    transition: background var(--transition-time), color var(--transition-time);
  }

  .resource-tag:hover, .resource-tag:focus {
    background: white;
    color: var(--color-primary);
  }
*/

  .resource-tag {
    color: var(--color-primary);
    text-decoration: none;
  }

  .resource-tag:hover, .resource-tag:focus {
    text-decoration: underline;
  }

  .resource-category {
    font-weight: bold;
    display: inline-block;
    height: 100%;
  }

</style>
