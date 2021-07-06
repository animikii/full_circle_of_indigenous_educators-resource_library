import _ from 'lodash';
import { reactive } from 'vue';
import {unref} from 'vue';

import ResourceApi from '../api/resources';
import ReviewsApi from '../api/reviews';
import CategoriesApi from '../api/categories';

const CACHE_TTL = 24 * 60 * 60 * 1000; // Cache items for 24 hours.

const START_TOKEN = 'start-';
const ERROR_LIST_RECORDS_ITERATOR_NOT_AVAILABLE = 'LIST_RECORDS_ITERATOR_NOT_AVAILABLE';

let router;

const state = reactive({
  currentResource: null,
  reviews: {},
  resources: [],
  currentToken: createStartToken(),
  searchQuery: '',
  searchFields: [
    'Title',
    'Description',
    'Search Creators',
    'Search Nation',
    'Search Subject',
    'Search Theme',
    'Search Type'
  ],
  filters: [],
  categoryTypes: [],
  categories: {},
  nextToken: '',
  prevToken: '',
  nextTokens: {},
  prevTokens: {},
  defaultRoute: {},
  notifications: [],
});

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
    if(localStorage['nextTokens']) {
      state.nextTokens = JSON.parse(localStorage['nextTokens']);
    } else {
      state.nextTokens = {};
    }
    if(localStorage['prevTokens']) {
      state.prevTokens = JSON.parse(localStorage['prevTokens']);
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

    localStorage['nextTokens'] = JSON.stringify(state.nextTokens);
    localStorage['prevTokens'] = JSON.stringify(state.prevTokens);

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
  Object.keys(localStorage).forEach(key => {
    cacheLoad(key);
  });
}

function cacheLoad(hashKey) {
  const cachedData = localStorage.getItem(hashKey);

  if(!cachedData) {
    return;
  }

  const parsedData = JSON.parse(cachedData)

  if(parsedData.expiresAt < Date.now()) {
    localStorage.removeItem(hashKey);
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

  localStorage.setItem(hashKey, cachedData);
}

function cacheLoadPromise(hash, onCacheMiss) {
    const cached = cacheLoad(hash);

    if(cached) {
      return Promise.resolve(cached);
    } else {
      return onCacheMiss();
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
      getRouter().replace(state.defaultRoute); 
      clearNotification(notification);
    };

    state.notifications.push(notification);
  } 
}

const actions = {
  initialize() {
    evictStaleCacheItems();
  },
  initializeResources() {

    const params = new URLSearchParams(window.location.href.split("?")[1]);

    if(params.get('token')) {
      state.currentToken = params.get('token');
    }
    state.searchQuery = params.get('search'); 

    loadTokens();
  },
  initializeFilters() {
    CategoriesApi.getIndex().then(
      types => state.categoryTypes = types 
    );
  },
  initializeFilter(categoryType) {
    CategoriesApi.get(categoryType).then(categories =>
      state.categories[categoryType] = categories
    );
  },
  setFilter(field, value) {
    state.filters.push({
      type: field,
      value
    });
    this.getResourcePage();
  },
  removeFilter(filter) {
    state.filters = state.filters.filter(f => f != filter);
  },

  getResource(id) {
    state.currentResource = state.resources.find(
      resource => resource._id === id 
    );

    const getReviews = () => {
      if(!state.reviews[id]) {
        const reviewsHash = `GET_REVIEWS=${id}`;

        cacheLoadPromise(reviewsHash, () => 
          ReviewsApi.get(id).then(reviews => {
            cachePersist(reviews, reviewsHash); 
            return reviews;
          })
        ).then(reviews => {
          state.reviews[id] = reviews
        });
      }
    };

    if(state.currentResource) {
      return Promise.resolve(state.currentResource).then(getReviews);
    }

    const hash = `GET_RESOURCE=${id}`;
  
    return cacheLoadPromise(hash, () => 
      ResourceApi.get({id})
        .then(result => {
          cachePersist(result, hash);
          return result;
        })
    ).then(resource => state.currentResource = resource)
    .then(getReviews);
  },

  getReviews(resourceId) {
    const hash = `GET_REVIEWS=${resourceId}`;
  
    return cacheLoadPromise(hash, () => 
      ResourceApi.get({id})
        .then(result => {
          cachePersist(result, hash);
          return result;
        })
    );
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

    return cacheLoadPromise(hash, () => 
      ResourceApi.get({ pageToken: apiToken })
        .then(page => {
          cachePersist(page, hash);
          return page;
        })
    ).then(page => setResourcePage(pageToken, page));
  },

  searchResources() {
    const fields = state.searchFields;
    const query = state.searchQuery || '';
    const searchQuery = JSON.stringify({fields, query});
    const hash = `SEARCH_RESOURCES=${searchQuery}`;

    return cacheLoadPromise(hash, () => 
      ResourceApi.search(fields, query)
        .then(page => {
          cachePersist(page, hash)
          return page;
        })
    ).then(page => {
      setResourcePage(createStartToken(), page);
    })
  },
  resetSession() {
    localStorage.clear();

    localStorage.removeItem('nextTokens');
    localStorage.removeItem('prevTokens');
    state.nextTokens = {};
    state.prevTokens = {};
    state.currentToken = createStartToken();
  },
};

export default { state, actions, isStartToken, createStartToken, setRouter };

