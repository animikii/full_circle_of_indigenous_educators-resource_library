const BASE_URL = 'https://api.airtable.com/v0/appuVy798hQyevSty';
const API_KEY = 'keyHcUQA9jlV08F7o';

export function get(resource) {
  return fetch(`${BASE_URL}/${resource}?api_key=${API_KEY}`)
    .then(response => response.json());
}


