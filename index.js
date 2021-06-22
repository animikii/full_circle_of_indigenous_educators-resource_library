// my-first-snowpack/index.js
import {helloWorld} from './hello-world.js';
import Airtable from 'airtable';

helloWorld();

const BASE_URL = 'https://api.airtable.com/v0/appuVy798hQyevSty';
const API_KEY = 'keyHcUQA9jlV08F7o';

function get(resource) {
  return fetch(`${BASE_URL}/${resource}?api_key=${API_KEY}`)
    .then(response => response.json());
}


get('Resource').then(data => {
    var app = new Vue({
      el: '#app',
      data: {
        message: `Records ${data.records.length}`
      }
    });
  }
);
