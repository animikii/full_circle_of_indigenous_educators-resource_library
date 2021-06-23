import { reactive } from 'vue';

const store = {
  state: reactive({
    resources: []
  }),

  setResources(resources) {
    this.state.resources = resources;
  }
};

export default store;

