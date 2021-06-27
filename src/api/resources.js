import Api from './';

function mapRecord(record) {
  return { 
    ...record.fields, 
    _id: record.id,
    _createdTime: record.createdTime
  };
}

function mapRecords(records) {
  return records.map(mapRecord);
}

const ResourceApi = { 
  get({ id, pageToken = ''}) {

    if(id) {
      return Api.get(`Resource/${id}`).then(mapRecord);
    } else {
      return Api.getAll('Resource', { pageToken }).then(data => {
        return {
          offset: data.offset,
          records: mapRecords(data.records)
        };
      });
    }
  },
  search(fields, text) {
    return Api.search('Resource', fields, text).then(data => {
        return {
          offset: data.offset,
          records: mapRecords(data.records)
        };
      });
  }
};

export default ResourceApi;
