<script>
  import _ from 'lodash';

  import ResourceTags from './tags';

  export default {
    props: ['resource'],
    computed: {
      nameRoles: function() {
        return _.zip(
          this.resource['Creator Roles'],
          this.resource['Creators Display Name']
        );
      } 
    },
    components: {
      ResourceTags
    },
  };
</script>

<template>
  <div class="resource-tile">
    <div class="image">
      <img aria-hidden=true v-bind:src="resource.Image[0].url"/>
    </div>
    <div class="details">
      <router-link :to="{ name: 'resource', params: { id: resource._id }}" class="title">
        {{ resource.Title }}
      </router-link>

      <div class="details-grid" v-for="nameRole in nameRoles">
        <span class="role">{{ nameRole[0] }}&nbsp</span>
        <span class="name">{{ nameRole[1] }}</span>
      </div>

      <div class="details-grid">
        <ResourceTags
          category="Type"
          v-bind:tags="resource['Type Lookup']"></ResourceTags>

        <ResourceTags
          category="Subject"
          v-bind:tags="resource['Subject Lookup']"></ResourceTags>

        <ResourceTags
          category="Theme"
          v-bind:tags="resource['Theme Lookup']"></ResourceTags>

        <ResourceTags
          category="Nation"
          v-bind:tags="resource['Nation Lookup']"></ResourceTags>

        <ResourceTags
          category="Age Range"
          v-bind:tags="resource['Age Range']"></ResourceTags>
      </div>
    </div>
  </div>
</template>

<style>

  .resource-tile {
    height: 100%;
    display: flex;
    flex-direction: row;
  }

  .resource-tile .image {
    height: 100%;
    width: 33%;
    margin: auto;
    display: inline-block;
  }

  .resource-tile .image img {
    object-fit: contain;
    object-position: center;
    width: 100%;
    max-height: 100%;
  }

  .resource-tile .details {
    flex: 1; 
    display: flex;
    flex-direction: column;
    padding: 1em;
  }


  .resource-tile .title {
    font-weight: bold;
    font-size: 1.4em;
    color: var(--color-primary);
    text-decoration: none;
  }

  .resource-tile .title:hover, .resource-tile .title:focus {
    text-decoration: underline;
  }


  .resource-tile .role {
    font-weight: bold;
  }

  .resource-tile ul {
    padding: 0;
  } 

  .resource-tile ul > li {
    display: inline-block;
  }

  .resource-tile .details-grid {
    display: grid;
    grid-template-columns: 1fr 3fr;  
    row-gap: 8xp;
  }

</style>
