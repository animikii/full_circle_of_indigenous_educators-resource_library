import store from '../store';

export function createSimpleComponent() {
  return {
    data() {
      return store.state;
    }
  };
} 
