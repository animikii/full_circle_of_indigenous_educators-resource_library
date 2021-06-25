import _ from 'lodash';

import store from '../store';

const BASE_URL = 'https://api.airtable.com/v0/appuVy798hQyevSty';
const API_KEY = 'keyHcUQA9jlV08F7o';
const SORT ='&sort%5B0%5D%5Bfield%5D=Title&sort%5B0%5D%5Bdirection%5D=desc';


const throttledFetch = _.throttle((url, resolve, reject) => {
    return fetch(url)
      .then(response => resolve(response))
      .catch(error => reject(error));
  },
  1000
);

const call = (url) => {
  return new Promise((resolve, reject) => {
    throttledFetch(url, resolve, reject);
  });
}

export function get(resource) {
  return call(`${BASE_URL}/${resource}?api_key=${API_KEY}${SORT}`)
    .then(response => response.json());
}

export function searchText(resource, fields, text) {

  const searchFields = fields.map(field => `SEARCH("${text.toLowerCase()}", LOWER({${field}}))`).join(',');
  const formula = `OR(${searchFields})`;

  const queryParams = [
    `api_key=${API_KEY}`,
    `filterByFormula=${encodeURI(formula)}`,
    SORT
  ].join('&');

  store.set

  return call(`${BASE_URL}/${resource}?${queryParams}`)
    .then(response => response.json());
}


