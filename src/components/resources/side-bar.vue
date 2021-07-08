<script>
  import _ from 'lodash';

  import { createComponent } from '../';
  import LoadingSpinner from '../loading-spinner';

  import store from '../../store';

  export default createComponent({
    data() {
      return {
        categoryToggles: {},
        categoryLoading: {},
        loading: false,
        initialized: false,
      };
    },
    methods: {
      clickCategory(type) {
        if(!this.categoryToggles[type]) {
          this.categoryLoading[type] = true;
          store.actions.initializeFilter(type)
            .then(() =>
              this.categoryToggles[type] = !this.categoryToggles[type]
            ).then(() => 
              this.categoryLoading[type] = false
            ).then(() => 
              this.initialized = true
            );
        } else {
          this.categoryToggles[type] = !this.categoryToggles[type];
        }
      },
      clickFilter(category) {
        this.categoryToggles[category] = !this.categoryToggles[category];
      },
      selectCategory(categoryType, category) {
        this.currentToken = '';
        store.actions.setFilter(categoryType, category.Name);
        this.categoryToggles[category.Name] = true;
        this.$router.replace({
          name: 'resources',
          query: this.queryParams 
        });
      },
      removeFilter(filter) {
        store.actions.removeFilter(filter); 
        this.$router.replace({
          name: 'resources',
          query: this.queryParams 
        });

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
      this.loading = true;
      store.actions.initializeFilters()
        .then(() => this.loading = false); 
    },
    components: {
      LoadingSpinner,
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
          <div class="filter-pill">
            {{ filter.value }}

            <span class="remove-filter" v-on:click="removeFilter(filter)">
              X
            </span>
          </div>

        </li>
      </ul> 
    </div>

    <LoadingSpinner v-bind:enabled='loading'></LoadingSpinner>

    <div v-if="initialized" v-for="filter in filters">
      <div v-if="subCategories(filter.value, filter.type).length">
        <hr/>
        <div class="category-header" v-on:click="clickFilter(filter.value)">
          <span>
            {{ filter.value }}
          </span>
          <span v-if="categoryToggles[filter.value]">
            -
          </span>
          <span v-if="!categoryToggles[filter.value]">
            +
          </span>
        </div>
       
        <ul v-if="categoryToggles[filter.value]" class="category">
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
      <div class="category-header" v-on:click="clickCategory(categoryType)">
        <span>
          {{ categoryType }} 
        </span>
        <span v-if="categoryToggles[categoryType]">
          -
        </span>
        <span v-if="!categoryToggles[categoryType]">
          +
        </span>
      </div>

      <LoadingSpinner v-bind:enabled="categoryLoading[categoryType]">
      </LoadingSpinner>
      
      <ul v-if="categoryToggles[categoryType]" class="category">
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
    margin-top: 2em;
  }

  .side-bar-filters ul {
    padding: 0; 
  }

  .side-bar-filters li {
    display: block;
  }

  .filter-header {
    text-transform: uppercase;
    margin-bottom: 8px;
    font-weight: bold;
  }

  .filter-pill {
    background: #ddd;
    padding: 8px 16px; 
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
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

  .category-header:hover {
    cursor: pointer;
  }

  .category {
    padding: 0;
    margin: 0;
  }

  .category li {
    display: block;
  }  

  .category li:hover {
    cursor: pointer;
  }

  .remove-filter:hover {
    font-weight: bold;
    cursor: pointer;
  }
</style>
