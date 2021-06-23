import store from '../store';
import ResourceApi from '../api/resources';

const App = Vue.createApp({
  data() {
    return store.state;
  },
  mounted() {
    ResourceApi.get().then(resources => store.setResources(resources));
  }
});

export default App;
