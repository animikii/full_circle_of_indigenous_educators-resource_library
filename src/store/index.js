const store = {
  state: Vue.reactive({
    resources: []
  }),

  setResources(resources) {
    this.state.resources = resources;
  }
};

export default store;

