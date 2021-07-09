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
        showFilters: false,
      };
    },
    methods: {
      resetSession() {
        store.actions.resetSession();
      },
      toggleFilters() {
        this.showFilters = !this.showFilters;
      },
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
          return [];
        }

        const categoryValue = this.categories[categoryType].find(c =>
          c.Name === category
        ); 

        if(!categoryValue) {
          return [];
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
        Filtered By:
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

    <button class='toggle-filters' v-on:click='toggleFilters'>
      <span v-if='!showFilters'>
        Show
      </span>
      <span v-if='showFilters'>
        Hide
      </span>
        Menu 

    </button>

    <LoadingSpinner v-bind:enabled='loading'></LoadingSpinner>

  <div v-bind:class='{ hideFilters: !showFilters }'>
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
    <button class='btn' v-on:click='resetSession'>Reset Session</button>        
    <a target="_blank" href="https://airtable.com/shrN7dbggyC43DhUu">
      <button class='btn'>
        Submit Resource
      </button>
    </a>        
  </div>


  </div>
</template>

<style>
  #side-bar {
    width: 200px;
    margin-top: 2em;
  }

  @media(max-width: 1024px) {
    margin-top: 1em;
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
  
  .toggle-filters {
    display: none;
  }

  #side-bar a {
    text-decoration: none;  
  }
    
  .btn {
    margin: 0;
    margin-top: 16px;
    display: block;
    color: var(--color-primary);
    background: white;
    border: 1px solid var(--color-primary);
    padding: 8px 16px;
    border-radius: 5px;      
    transition: background 300ms, color 300ms;
    font-size: 1em;
    text-decoration: none;
  }

  .btn:hover, .btn:focus, .btn:active  {
    color: white;
    background: var(--color-primary);
    cursor: pointer;
  }


  @media(max-width: 1024px) {
    #side-bar {
      width: 100%;
    }

    .side-bar-filters ul {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
    }

    .side-bar-filters li {
      margin: 0 5px;
    }

    .remove-filter {
      margin-left: 8px;
      display: inline-block;
    }

    .hideFilters {
      display: none;
    }
 
    .toggle-filters {
      display: block;
      border: none;
      color: var(--color-primary);
      margin: 0;
      padding: 0;
      font-size: 1em;
      background: none;
    }   
  
    .toggle-filters:hover,
    .toggle-filters:focus,
    .toggle-filters:active {
      text-decoration: underline;
      cursor: pointer;
    }


/*
    .toggle-filters {
      display: block;
      margin-top: -8px;
      color: var(--color-primary);
      background: white;
      border: 1px solid var(--color-primary);
      padding: 8px 16px;
      border-radius: 5px;      
      transition: background 300ms, color 300ms;
      font-size: 1em;
    }

    .toggle-filters:hover, .toggle-filters:focus, .toggle-filters:active  {
      color: white;
      background: var(--color-primary);
      cursor: pointer;
    }

*/

  }
</style>
