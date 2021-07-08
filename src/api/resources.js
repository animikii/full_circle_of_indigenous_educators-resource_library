import Api from './';

const SORT = '&sort%5B0%5D%5Bfield%5D=Title&sort%5B0%5D%5Bdirection%5D=asc';

const ResourceApi = { 
  get({ id, pageToken = ''}, serializer) {
    if(id) {
      return Api.get(`Resource/${id}`);
    } else {
      return Api.getAll('Resource', { pageToken, sort: SORT, serializer });
    }
  },
  search(fieldQueries, serializer) {
    return Api.search('Resource', fieldQueries, { sort: SORT, serializer});
  }
};

export default { ...ResourceApi };
