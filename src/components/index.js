import { reactive, toRefs } from 'vue';
import store from '../store';

export function createComponent(component) {
  let data = reactive({});
  let componentCreated = () => {};
  let computed = component.computed;
  delete component.computed;

  if(component && component.data) {
    data = reactive(component.data());
    delete component.data;
  }

  if(component && component.created) {
    componentCreated = component.created;
    delete component.created;
  }
  
  return {
    data() {
      return {
        ...toRefs(data),
        ...toRefs(store.state)
      }
    },
    computed: {
      ...computed,
      queryParams() {
        return {
          search: this.searchQuery,
          token: this.currentToken,
          filters: encodeURIComponent(
            this.filters
              .map(filter => `${filter.type}|${filter.value}`)
              .join(",")
          )
        }
      },
    },
    created() {
      componentCreated.call(this);
    },
    ...component
  };
} 
