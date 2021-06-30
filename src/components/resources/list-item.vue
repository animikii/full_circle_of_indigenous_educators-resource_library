<script>
  import _ from 'lodash';

  import { createComponent } from '../';
  import ResourceTags from '../tags';

  const PREVIEW_DESCRIPTION_LENGTH = 30;

  export default createComponent({
    props: {
      resource: Object,
      expanded: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      nameRoles: function() {
        return _.zip(
          this.resource['Creator Roles'],
          this.resource['Creators Display Name']
        );
      },
      description() {
        if(!this.resource.Description) {
          return;
        }

        const words = this.resource.Description.split(" ");
        if(!this.expanded && words.length > PREVIEW_DESCRIPTION_LENGTH) {
          return words.slice(0, PREVIEW_DESCRIPTION_LENGTH).join(" ") + "...";
        } else {
          return this.resource.Description;
        }
      }
    },
    components: {
      ResourceTags
    },
  });
</script>

<template>
  <div :class="`resource-tile ${expanded ? 'expanded' : ''}`">
    <div class="image">
      <img v-if="resource.Image && resource.Image" aria-hidden=true v-bind:src="resource.Image[0].url"/>
    </div>
    <div class="details">
      <router-link v-if='$route.name == "resources"' :to="{ name: 'resource', params: { id: resource._id }, query: { search: searchQuery, token: currentToken} }" class="title">
        {{ resource.Title }}
      </router-link>
      <span v-if='$route.name != "resources"' :to="{ name: 'resource', params: { id: resource._id }}" class="title inactive">
        {{ resource.Title }}
      </span>


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

        <div class='description'>
          <div>
            {{ description }}
          </div>
          <div>
            <a v-if='resource.Link' v-bind:href="resource.Link" class="resource-link">
              Link to Resource
            </a>
          </div>
        </div>

        <slot></slot>
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
    max-height: 300px;
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
    margin-bottom: 8px;
  }

  .resource-tile .title.inactive {
    color: var(--color-text);
  }

  .resource-tile .title:hover, .resource-tile .title:focus {
    text-decoration: underline;
  }

  .resource-tile .title.inactive:hover, .resource-tile .title.inactive:focus {
    text-decoration: none; 
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

  .resource-tile .description {
    white-space: pre-line;
    grid-column-start: 1;
    grid-column-end: 3;
    margin-top: 8px;
  }

  .resource-tile.expanded .details {
    padding-top: 0;
  }

  .resource-tile.expanded .image {
    margin: 0;
  }

  .resource-tile .resource-link {
    font-size: 1.15em;
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
