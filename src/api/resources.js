import { get } from '.';

const ResourceApi = { 
  mapRecords(records) {
    return records.map(record => {
      return { 
        ...record.fields, 
        _id: record.id,
        _createdTime: record.createdTime
      };
    });
  },
  get() {
    return get('Resource').then(data => this.mapRecords(data.records));
  }
};

export default ResourceApi;
