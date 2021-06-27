import _ from 'lodash';
import { reactive } from 'vue';

import ResourceApi from '../api/resources';

const CACHE_TTL = 24 * 60 * 60 * 1000; // Cache items for 24 hours.

const TOKEN_DIRECTIONS = {
  NEXT: 0,
  PREV: 1,
};


const state = reactive({
  resources: [],
  nextToken: '',
  currentToken: '',
  prevToken: '',
  searchQuery: '',
  pageTokenGraph: {}
});

function setResourcePage(page) {
  state.resources = page.records;
  state.nextToken = page.offset;
};

function evictStaleCacheItems() {
  Object.keys(localStorage).forEach(key => {
    cacheLoad(key);
  });
}

evictStaleCacheItems();

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

const actions = {
  associateTokens(fromToken, toToken) {
    state.pageTokenGraph[`${TOKEN_DIRECTIONS.NEXT}::${fromToken}`] = toToken;
    state.pageTokenGraph[`${TOKEN_DIRECTIONS.PREV}::${toToken}`] = fromToken;
  },

  getResource(id) {
    const hash = `GET_RESOURCE=${id}`;
  
    return cacheLoadPromise(hash, () => 
      ResourceApi.get({id})
        .then(result => {
          cachePersist(result, hash);
          return result;
        })
    );
  },

  getResourcePage(pageToken) {
    const hash = `GET_RESOURCE_PAGE=${pageToken}`; 
    
    return cacheLoadPromise(hash, () => 
      ResourceApi.get({ pageToken })
        .then(page => {
          cachePersist(page, hash);
          return page;
        })
    ).then(page => setResourcePage(page));
  },

  searchResources(fields, query) {
    const searchQuery = JSON.stringify({fields, query});
    const hash = `SEARCH_RESOURCES=${searchQuery}`;

    return cacheLoadPromise(hash, () => 
      ResourceApi.search(fields, query)
        .then(page => {
          cachePersist(page, hash)
          return page;
        })
    ).then(page => {
      setResourcePage(page);
      state.currentToken = '';
    });
  }
};

export default { state, actions };

