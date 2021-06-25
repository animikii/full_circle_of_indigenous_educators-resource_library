import { reactive, toRefs } from 'vue';
import store from '../store';

export function createComponent(component) {
  let data = {};

  if(component && component.data) {
    data = reactive(component.data());
    delete component.data;
  }
  return {
    data() {
      return {
        ...toRefs(data),
        ...toRefs(store.state)
      }
    },
    ...component
  };
} 
