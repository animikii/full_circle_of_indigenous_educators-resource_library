import Api from './';

const PAGE_SIZE = 100;

const SORT_CATEGORIES = '&sort%5B0%5D%5Bfield%5D=Category%20Name&sort%5B0%5D%5Bdirection%5D=asc';
const SORT_SUBCATEGORIES = '&sort%5B0%5D%5Bfield%5D=Name&sort%5B0%5D%5Bdirection%5D=asc'
const FIELDS = '&fields%5B%5D=Name\&fields%5B%5D=Related';


const CategoriesApi = { 
  getIndex() {
    return Api.getAll('Category Index', { sort: SORT_CATEGORIES }).then(page => 
      page.records.map(record => record['Category Name'])
    );
  },
  get(category) {
    return Api.getAll(category, { pageSize: 100, fields: FIELDS, sort: SORT_SUBCATEGORIES }).then(page => page.records);
  }
};

export default { ...CategoriesApi };
