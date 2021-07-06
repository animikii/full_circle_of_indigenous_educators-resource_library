import _ from 'lodash';

import store from '../store';

const BASE_URL = 'https://api.airtable.com/v0/appuVy798hQyevSty';
const API_KEY = 'keyHcUQA9jlV08F7o';
const PAGE_SIZE = 8;

const SORT = {
  RESOURCES_ASC: '&sort%5B0%5D%5Bfield%5D=Title&sort%5B0%5D%5Bdirection%5D=asc',
  REVIEWS_ASC: '&sort%5B0%5D%5Bfield%5D=createdTime&sort%5B0%5D%5Bdirection%5D=desc'
}

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
  return call(`${BASE_URL}/${resource}?api_key=${API_KEY}`)
    .then(mapRecord);
}

function getAll(resource, { pageToken = '', sort = '', fields='', pageSize = PAGE_SIZE } = {} ) {
  return call(`${BASE_URL}/${encodeURIComponent(resource)}?api_key=${API_KEY}${sort}&pageSize=${pageSize}&offset=${pageToken}${fields}`)
    .then(mapRecords);
}

function search(resource, fields, text, { sort = '', pageSize = PAGE_SIZE } = {}) {
  const searchFields = fields.map(field => `SEARCH("${text.toLowerCase()}", LOWER({${field}}))`).join(',');
  const formula = `OR(${searchFields})`;

  const queryParams = [
    `api_key=${API_KEY}`,
    `filterByFormula=${encodeURI(formula)}`,
    `&pageSize=${pageSize}`,
    sort
  ].join('&');

  return call(`${BASE_URL}/${resource}?${queryParams}`)
    .then(mapRecords);
}

export default { get, getAll, search, SORT }
