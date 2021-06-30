import _ from 'lodash';

import store from '../store';

const BASE_URL = 'https://api.airtable.com/v0/appuVy798hQyevSty';
const API_KEY = 'keyHcUQA9jlV08F7o';
const SORT ='&sort%5B0%5D%5Bfield%5D=Title&sort%5B0%5D%5Bdirection%5D=asc';
const SORT_REV ='&sort%5B0%5D%5Bfield%5D=Title&sort%5B0%5D%5Bdirection%5D=desc';
const PAGE_SIZE = 2;

const ERRORS = {
  LIST_RECORDS_ITERATOR_NOT_AVAILABLE: 'LIST_RECORDS_ITERATOR_NOT_AVAILABLE'
};

const throttledFetch = _.throttle((url, resolve, reject) => {
    return fetch(url)
      .then(response => {
        if(200 <= response.status && response.status <= 299) {
          response.json().then(data => resolve(data));
        } else {
          response.json().then(data => reject(data.error));
        }
      });
  },
  1000
);

const call = (url) => {
  return new Promise((resolve, reject) => {
    throttledFetch(url, resolve, reject);
  });
}
/*
const handleExpiredIterator = (error) => {
  if(error.type == ERRORS.LIST_RECORDS_ITERATOR_NOT_AVAILABLE) {

  } 
};*/

function get(resource) {
  return call(`${BASE_URL}/${resource}?api_key=${API_KEY}`)
}

function getAll(resource, { pageToken = '', sort = SORT } ) {
  return call(`${BASE_URL}/${resource}?api_key=${API_KEY}${SORT}&pageSize=${PAGE_SIZE}&offset=${pageToken}`)
}

function search(resource, fields, text) {
  const searchFields = fields.map(field => `SEARCH("${text.toLowerCase()}", LOWER({${field}}))`).join(',');
  const formula = `OR(${searchFields})`;

  const queryParams = [
    `api_key=${API_KEY}`,
    `filterByFormula=${encodeURI(formula)}`,
    `&pageSize=${PAGE_SIZE}`,
    SORT
  ].join('&');

  return call(`${BASE_URL}/${resource}?${queryParams}`)
}

export default { get, getAll, search }
