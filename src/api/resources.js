import Api from './';

const SORT = '&sort%5B0%5D%5Bfield%5D=Title&sort%5B0%5D%5Bdirection%5D=asc';

const ResourceApi = { 
  get({ id, pageToken = ''}) {
    if(id) {
      return Api.get(`Resource/${id}`);
    } else {
      return Api.getAll('Resource', { pageToken, sort: SORT });
    }
  },
  search(fields, text) {
    return Api.search('Resource', fields, text, { sort: SORT});
  }
};

export default { ...ResourceApi };
