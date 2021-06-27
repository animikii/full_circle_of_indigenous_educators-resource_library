import _ from 'lodash';

import store from '../store';

const BASE_URL = 'https://api.airtable.com/v0/appuVy798hQyevSty';
const API_KEY = 'keyHcUQA9jlV08F7o';
const SORT ='&sort%5B0%5D%5Bfield%5D=Title&sort%5B0%5D%5Bdirection%5D=asc';
const PAGE_SIZE = 6;

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

function get(resource) {
  return call(`${BASE_URL}/${resource}?api_key=${API_KEY}`)
    .then(response => response.json());
}

function getAll(resource, { pageToken = ''} ) {
  return call(`${BASE_URL}/${resource}?api_key=${API_KEY}${SORT}&pageSize=${PAGE_SIZE}&offset=${pageToken}`)
    .then(response => response.json());
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
    .then(response => response.json());
}

export default { get, getAll, search }
