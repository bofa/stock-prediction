import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import es6promise from 'es6-promise';

import configureStore  from './store';
import routes from './routes';
import '../styles/styles.scss';


const store = configureStore();
const rootElement = document.getElementById('app');

let ComponentEl;

es6promise.polyfill();

if (process.env.NODE_ENV !== 'production') {
  const DevTools = require('./containers/DevTools').default;

  // If using routes
  ComponentEl = (
    <div>
      <Router history={browserHistory} routes={routes} />
      <DevTools />
    </div>
  );
} else {
  ComponentEl = (
    <div>
      <Router history={browserHistory} routes={routes} />
    </div>
  );
}

// Render the React application to the DOM
ReactDOM.render(
  <Provider store={store}>
    {ComponentEl}
  </Provider>,
  rootElement
);
