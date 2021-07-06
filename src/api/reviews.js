import Api from './';

const PAGE_SIZE = 100;

const SORT = '&sort%5B0%5D%5Bfield%5D=Created+At&sort%5B0%5D%5Bdirection%5D=asc';

const ReviewsApi = { 
  get(resourceId) {
    return Api.search('Review', ['Resource ID'], resourceId, {sort: SORT, pageSize: 100}).then(page => page.records);
    //return Api.getAll('Review');
  }
};

export default { ...ReviewsApi };
