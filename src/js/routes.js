import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import App from './components/App';
import StockApp from './containers/StockApp/StockApp';
import NotFoundView from './views/NotFoundView';

export default (
  <Route path="/stock-prediction" component={App}>
    <IndexRoute component={StockApp} />
    <Route path="404" component={NotFoundView} />
    <Redirect from="*" to="404" />
  </Route>
);
