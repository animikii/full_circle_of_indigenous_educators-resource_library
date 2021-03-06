import _ from 'lodash';
import { reactive } from 'vue';
import {unref} from 'vue';

import Api from '../api';
import ResourceApi from '../api/resources';
import ReviewsApi from '../api/reviews';
import CategoriesApi from '../api/categories';

const CACHE_TTL = 24 * 60 * 60 * 1000; // Cache items for 24 hours.

const START_TOKEN = 'start-';
const ERROR_LIST_RECORDS_ITERATOR_NOT_AVAILABLE = 'LIST_RECORDS_ITERATOR_NOT_AVAILABLE';

const SEARCH_PREFIX = 'Search ';

const DEFAULT_FIELDS_CONTENT = [
 'Title',
 'Description',
];

const DEFAULT_FIELDS_CATEGORIES = [
 SEARCH_PREFIX + 'Creators',
 SEARCH_PREFIX + 'Nation',
 SEARCH_PREFIX + 'Subject',
 SEARCH_PREFIX + 'Theme',
 SEARCH_PREFIX + 'Type'
];


const DEFAULT_FIELDS = [ ...DEFAULT_FIELDS_CONTENT, ...DEFAULT_FIELDS_CATEGORIES ];

let router;

function createInitialState() {
  return {
    currentResource: null,
    reviews: {},
    resources: [],
    currentToken: createStartToken(),
    searchQuery: '',
    searchFields: [...DEFAULT_FIELDS],
    filters: [],
    categoryTypes: [],
    categories: {},
    nextToken: '',
    prevToken: '',
    nextTokens: {},
    prevTokens: {},
    defaultRoute: {},
    notifications: [],
  };
}

class LocalStorage {
  static _ROOT_KEY = 'fice-resource-library';

  getItem(key) {
   return window.localStorage.getItem(LocalStorage._ROOT_KEY + '-' + key); 
  }

  setItem(key, value) {
   return window.localStorage.setItem(LocalStorage._ROOT_KEY + '-' + key, value);
  };

  removeItem(key) {
    window.localStorage.removeItem(LocalStorage._ROOT_KEY + '-' + key);
  }

  getKeys() {
    const keyPattern = new RegExp('^' + LocalStorage._ROOT_KEY);

    return Object.keys(window.localStorage).filter(key => key.match(keyPattern));
  }

  clear() {
    this.getKeys().forEach(key => window.localStorage.removeItem(key));
  }
}

const libraryStorage = new LocalStorage();

const state = reactive(createInitialState());

function setRouter(r) {
  router = r;
}

function getRouter() {
  return router;
}

function getRoute() {
  return unref(getRouter().currentRoute);
}

function createStartToken() {
  return `${START_TOKEN}${Date.now()}`;
}

function isStartToken(token) {
  return token && token.match(START_TOKEN);
}

function loadTokens() {
    if(libraryStorage.getItem('nextTokens')) {
      state.nextTokens = JSON.parse(libraryStorage.getItem('nextTokens'));
    } else {
      state.nextTokens = {};
    }
    if(libraryStorage.getItem('prevTokens')) {
      state.prevTokens = JSON.parse(libraryStorage.getItem('prevTokens'));
    } else {
      state.prevTokens = {};
    }
}

function setPagingTokens(token, page) {

    if(isStartToken(token) || !token) {
      state.prevTokens = {};
      state.nextTokens = {};
      if(!token) {
        token = createStartToken();
      }
    } 

    state.nextTokens[token] = page.offset;
    state.prevTokens[page.offset] = token;
    state.currentToken = token;

    libraryStorage.setItem('nextTokens', JSON.stringify(state.nextTokens));
    libraryStorage.setItem('prevTokens', JSON.stringify(state.prevTokens));

    state.nextToken = state.nextTokens[state.currentToken];

    if(isStartToken(state.currentToken)) {
      state.prevToken = '';
    } else if(!state.prevTokens[state.currentToken]) {
      state.staleSession = true;
    }  else {
      state.prevToken = state.prevTokens[state.currentToken];
    }
}

function setResourcePage(token, page) {
  state.resources = page.records;
  setPagingTokens(token, page);
};

function evictStaleCacheItems() {
  libraryStorage.getKeys().forEach(key => {
    cacheLoad(key);
  });
}

function cacheLoad(hashKey) {
  const cachedData = libraryStorage.getItem(hashKey);

  if(!cachedData) {
    return;
  }

  const parsedData = JSON.parse(cachedData)

  if(parsedData.expiresAt < Date.now()) {
    libraryStorage.removeItem(hashKey);
    return;
  }

  return parsedData.payload;
}

function cachePersist(payload, hashKey) {
  const expiresAt = CACHE_TTL + Date.now();

  const cachedData = JSON.stringify({
    payload,
    expiresAt
  });

  libraryStorage.setItem(hashKey, cachedData);
}

function cacheLoadPromise(hash, onCacheMiss) {
    const cached = cacheLoad(hash);

    if(cached) {
      return Promise.resolve(cached);
    } else {
      return onCacheMiss().then(data => {
        cachePersist(data, hash);
        return data;
      });
    }
}

function handleResourcesError(error) {
  const clearNotification = (notification) => {
    state.notifications = state.notifications.filter(n => {
      n.id != notification.id
    });
  };
  
  if(error.type == ERROR_LIST_RECORDS_ITERATOR_NOT_AVAILABLE) {
    state.nextToken = '';
    state.prevToken = '';

    const notification = {
      id: Math.random(),
      message: 'Session timed out!',
      actionLabel: 'Reset Search',
    };

    notification.action = () => {
      actions.resetSession();    
      clearNotification(notification);
    };

    state.notifications.push(notification);
  } 
}

const resourcesSerializer = Api.createCallSerializer();

const actions = {
  initialize() {
    evictStaleCacheItems();

    // Load query params
    
    const params = new URLSearchParams(window.location.href.split("?")[1]);

    if(params.get('token')) {
      state.currentToken = params.get('token');
    }
    state.searchQuery = params.get('search'); 

    if(params.get('filters')) {
      state.filters = decodeURIComponent(params.get('filters'))
        .split(',')
        .map(param => {
          const type = param.split('|')[0];
          const value = param.split('|')[1];

          return { type, value };
        });
    }
  },
  initializeResources() {
    loadTokens();
  },
  initializeFilters() {
    const hash = "CATEGORY_FILTERS";
    return cacheLoadPromise(hash, () => 
      CategoriesApi.getIndex()
    ).then(
      types => {
        state.categoryTypes = types;
        state.searchFields = [
          ...DEFAULT_FIELDS_CONTENT,
          ...types.map(category => SEARCH_PREFIX + category)
        ];
        return state.categoryTypes;
      } 
    );
  },
  initializeFilter(categoryType) {
    const hash = `CATEGORY_${categoryType}`;
    return cacheLoadPromise(
      hash,
      () => CategoriesApi.get(categoryType)
    ).then(categories =>
      state.categories[categoryType] = categories
    );
  },
  setFilter(field, value) {
    const filterExists = state.filters.find(f => f.value === value && f.type === field);
    
    if(!filterExists) {
      state.filters.push({
        type: field,
        value
      });
      this.getResourcePage();
    }
  },
  removeFilter(filter) {
    state.filters = state.filters.filter(f => f != filter);
    this.getResourcePage();
  },

  getResource(id) {
    state.currentResource = state.resources.find(
      resource => resource._id === id 
    );

    const getReviews = () => {
      if(!state.reviews[id]) {
        const reviewsHash = `GET_REVIEWS=${id}`;

        cacheLoadPromise(reviewsHash, () => ReviewsApi.get(id))
          .then(reviews => {
            state.reviews[id] = reviews
          });
      }
    };

    if(state.currentResource) {
      return Promise.resolve(state.currentResource).then(getReviews);
    }

    const hash = `GET_RESOURCE=${id}`;
  
    return cacheLoadPromise(hash, () => ResourceApi.get({id}))
      .then(resource => state.currentResource = resource)
      .then(getReviews);
  },

  getReviews(resourceId) {
    const hash = `GET_REVIEWS=${resourceId}`;
  
    return cacheLoadPromise(hash, () => ResourceApi.get({id}));
  },

  getResourcePage() {

    const isSearch = state.searchQuery || state.filters.length;
    let apiCall;

    if(isSearch  && isStartToken(state.currentToken)) {
      apiCall = this.searchResources();
    } else {
      apiCall = this.getResources();
    }

    return apiCall.catch(handleResourcesError);
  },

  getResources() {
    let pageToken = state.currentToken;
    let apiToken = pageToken; 

    if(isStartToken(pageToken)) {
      apiToken = '';
    }

    const hash = `GET_RESOURCE_PAGE=${apiToken}`; 

    let serializer = resourcesSerializer.newCall()
    return cacheLoadPromise(
        hash,
        () => ResourceApi.get({ pageToken: apiToken }, serializer)
      ).then(page => setResourcePage(pageToken, page));
  },

  searchResources() {
    const query = state.searchQuery || '';

    const filterQueries = state.searchFields.map(field => {
      const matchingFilters = state.filters.filter(
        filter => {
            return SEARCH_PREFIX + filter.type === field;
          }
      );

      if(matchingFilters.length) {
        return {
          conjunctive: true,
          field,
          query: [...matchingFilters.map(filter => filter.value)]
        };
      }
    }).filter(fq => fq);

    let searchQueries = [];

    if(query) {
      searchQueries = state.searchFields.map(field => {
        return {
          conjunctive: false,
          field, 
          query: [query]
        }
      });
    }


    const queries = [ ...searchQueries, ...filterQueries ];
    const hash = `SEARCH_RESOURCES=${JSON.stringify(queries)}`;

    let serializer = resourcesSerializer.newCall();
    return cacheLoadPromise(hash, () => ResourceApi.search(queries, serializer))
      .then(page => { setResourcePage(createStartToken(), page); })
  },
  resetSession() {
    libraryStorage.clear();

    libraryStorage.removeItem('nextTokens');
    libraryStorage.removeItem('prevTokens');
    state.nextTokens = {};
    state.prevTokens = {};
    state.currentToken = createStartToken();
    state.nextToken = '';
    state.prevToken = '';
    state.resources = [];
    state.filters = [];
    state.searchQuery = '';
    state.searchFields = [...DEFAULT_FIELDS];
    state.notifications = [];

    getRouter().replace(state.defaultRoute); 
    this.getResourcePage();
    this.initializeFilters();
  },
};

actions.initialize();

export default { state, actions, isStartToken, createStartToken, setRouter };

