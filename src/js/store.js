import { createStore } from 'redux';

import rootReducer from './ducks';

export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

  // Enable Webpack hot module replacement for reducers
  if (module.hot) {
    module.hot.accept('./ducks', () =>
      store.replaceReducer(require('./ducks').default)
    );
  }

  return store;
}
