<script>
  import _ from 'lodash';
  import { createComponent } from '../';
  import store from '../../store';

  export default createComponent({
    methods: {
      loadCategory(category) {
        store.actions.initializeFilter(category);
      },
      selectCategory(categoryType, category) {
        store.actions.setFilter(categoryType, category.Name);
      },
      removeFilter(filter) {
        store.actions.removeFilter(filter); 
      },
      topLevelCategories(categoryType) {
        if(this.categories[categoryType]) {
          return this.categories[categoryType].filter(category => {
            return !category.Related
          });
        }
      },
      subCategories(category, categoryType) {
        const findRelated = (id) => 
           this.categories[categoryType].find(c => c._id === id);


        if(!this.categories[categoryType]) {
          return;
        }

        const categoryValue = this.categories[categoryType].find(c =>
          c.Name === category
        ); 

        if(!categoryValue) {
          return;
        }

        return this.categories[categoryType].filter(c => {
          return _.includes(c.Related, categoryValue._id);
        });
      }

    },
    created() {
      store.actions.initializeFilters(); 
    }
  });
</script>

<template>
  <div id="side-bar">
    <div class="side-bar-filters">
      <div class="filter-header">
        Filters:
      </div>
      <ul>
        <li v-for="filter in filters">
          {{ filter.value }}

          <span v-on:click="removeFilter(filter)">
            X
          </span>

        </li>
      </ul> 
    </div>

    <div v-for="filter in filters">
      <div v-if="subCategories(filter.value, filter.type).length">
        <hr/>
        <div class="category-header">
          <span>
            {{ filter.value }}
          </span>
          <span>
            +
          </span>
        </div>
       
        <ul class="category">
          <li v-for="category in subCategories(filter.value, filter.type)" v-on:click="selectCategory(filter.type, category)">
            {{ category.Name }}

            <span v-if="subCategories(category.Name, filter.type).length">
              ({{subCategories(category.Name, filter.type).length}})
            </span>

          </li>
        </ul>
      </div>
    </div>
 
    <div v-for="categoryType in categoryTypes">
      <hr/>
      <div class="category-header" v-on:click="loadCategory(categoryType)">
        <span>
          {{ categoryType }} 
        </span>
        <span>
          +
        </span>
      </div>
      
      <ul class="category">
        <li v-for="category in topLevelCategories(categoryType)" v-on:click="selectCategory(categoryType, category)">
          {{ category.Name }}

          <span v-if="subCategories(category.Name, categoryType).length">
            ({{subCategories(category.Name, categoryType).length}})
          </span>

        </li>
      </ul>
    </div>
        
  </div>
</template>

<style>
  #side-bar {
    width: 200px;
    height: 400px;
    margin-top: 2em;
  }

  .filter-header {
    text-transform: uppercase;
    margin-bottom: 8px;
    font-weight: bold;
  }

  .category-header {
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
  }

  .category-header:hover, .category-header:active, .category-header:focus {
    cursor: pointer;
  }

  .category {
    padding: 0;
    margin: 0;
  }

  .category li {
    display: block;
  }  
</style>
