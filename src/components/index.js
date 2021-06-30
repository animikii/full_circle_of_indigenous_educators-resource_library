import { reactive, toRefs } from 'vue';
import store from '../store';

export function createComponent(component) {
  let data = reactive({});
  let componentCreated = () => {};

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
    created() {
      componentCreated.call(this);
    },
    ...component
  };
} 
