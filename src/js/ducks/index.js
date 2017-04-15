import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import stockReducer from './stocks';
import filterReducer from './filter';
import returnReducer from './return';

const rootReducer = combineReducers({
  stockReducer,
  filterReducer,
  returnReducer
});

export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(thunkMiddleware),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  );

  // Enable Webpack hot module replacement for reducers
  // if (module.hot) {
  //   module.hot.accept('./ducks', () =>
  //     store.replaceReducer(require('./ducks').default)
  //   );
  // }

  return store;
}
