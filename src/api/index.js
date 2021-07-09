import _ from 'lodash';

import store from '../store';

const BASE_URL = 'https://api.airtable.com/v0/appuVy798hQyevSty';
const API_KEY = 'keyHcUQA9jlV08F7o';
const PAGE_SIZE = 8;

const SORT = {
  RESOURCES_ASC: '&sort%5B0%5D%5Bfield%5D=Title&sort%5B0%5D%5Bdirection%5D=asc',
  REVIEWS_ASC: '&sort%5B0%5D%5Bfield%5D=createdTime&sort%5B0%5D%5Bdirection%5D=desc'
}

const THROTTLE_TIME = 1000;
let throttleUntil = Date.now();
let throttleQueue = [];

function checkThrottleQueue() {
  
  let delay = throttleUntil - Date.now();

  if(delay > 0) {
    setTimeout(checkThrottleQueue, delay);
  } else if(throttleQueue.length) {
    var next = throttleQueue[throttleQueue.length - 1];
    throttleQueue.pop();

    if(!next.serializer || !next.serializer.isExpired()) {
      next.fetch();
      throttleUntil = Date.now() + THROTTLE_TIME;
    }
  }
  
}

const throttledFetch = (url, serializer) => {
  
  const createDelayedFetch = (resolve, reject) => {
    fetch(url)
        .then(response => {
          checkThrottleQueue();
          return response;
        })
        .then(response => {
          if(serializer && serializer.isExpired()) {
            reject('call expired');
          }
          return response;
        })
        .then(response => {
          if(200 <= response.status && response.status <= 299) {
            return response.json().then(resolve);;
          } else {
            return response.json().then(data => reject(data.error));
          }
        });
  };

  return new Promise((resolve, reject) => {
    throttleQueue.push({
      fetch: () => createDelayedFetch(resolve, reject),
      serializer
    });
    checkThrottleQueue();
  });
  
};

function mapRecord(record) {
  return { 
    ...record.fields, 
    _id: record.id,
    _createdTime: record.createdTime
  };
}

function mapRecords(data) {
  return {
    offset: data.offset,
    records: data.records.map(mapRecord)
  };
}

function get(resource) {
  return throttledFetch(`${BASE_URL}/${resource}?api_key=${API_KEY}`)
    .then(mapRecord);
}

function getAll(resource, { pageToken = '', sort = '', fields='', pageSize = PAGE_SIZE, serializer } = {} ) {
  return throttledFetch(`${BASE_URL}/${encodeURIComponent(resource)}?api_key=${API_KEY}${sort}&pageSize=${pageSize}&offset=${pageToken}${fields}`, serializer)
    .then(mapRecords);
}

function search(resource, fieldQueries, { sort = '', pageSize = PAGE_SIZE, serializer } = {}) {

  const createFieldFormula = fieldQuery => {
    const fieldSearch = fieldQuery.query.map(query => {
      return `SEARCH("${query.toLowerCase()}", LOWER({${fieldQuery.field}}))`;
    }).join(',');
    return `AND(${fieldSearch})`; 
  };

  let conjunctiveQueries = fieldQueries.filter(fq => fq.conjunctive)
    .map(createFieldFormula);

  let disjunctiveQueries = fieldQueries.filter(fq => !fq.conjunctive)
    .map(createFieldFormula);

  let formulas = [];

  if(disjunctiveQueries.length) {
    formulas.push(`OR(${disjunctiveQueries})`);
  }
  if(conjunctiveQueries.length) {
    formulas.push(conjunctiveQueries);
  }
  
  const filterFormula = `AND(${formulas.join(',')})`;

  const queryParams = [
    `api_key=${API_KEY}`,
    `filterByFormula=${encodeURI(filterFormula)}`,
    `&pageSize=${pageSize}`,
    sort
  ].join('&');

  return throttledFetch(`${BASE_URL}/${resource}?${queryParams}`, serializer)
    .then(mapRecords);
}

function createCallSerializer() {
  let currentCallId = 0;
  

  const newCall = () => {
    let id = ++currentCallId;
    
    return {
      isExpired: () => {
        return id != currentCallId;
      }
    }
  };

  return { newCall };      
}

export default { get, getAll, search, SORT, createCallSerializer }
