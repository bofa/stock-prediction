import { createStore } from 'redux';

import rootReducer from './ducks';

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState);

  // Enable Webpack hot module replacement for reducers
  if (module.hot) {
    module.hot.accept('./ducks', () =>
      store.replaceReducer(require('./ducks').default)
    );
  }

  return store;
}
