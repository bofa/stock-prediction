import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import App from './App';
import Index from './views/Index';
import Company from './views/Company';
import NotFoundView from './views/NotFoundView';

// const gitHubRepoName = 'stock-prediction';
// // The domain for your site
// // SET THIS: e.g. http://subdomain.example.tld, or http://www.example.tld
// const domain = 'https://bofa.github.io';
// function redirectToDomain() {
//   window.location.replace(domain);
// }

// function parseRedirectQuery(query, replace) {
//   let redirectTo = {};

//   if (typeof query.pathname === 'string' && query.pathname !== '') {
//     redirectTo.pathname = query.pathname;
//   }

//   if (typeof query.query === 'string' && query.query !== '') {
//     let queryObject = {};
//     query.query.split('&').map(q => q.split('=')).forEach(arr => {
//       queryObject[arr[0]] = arr.slice(1).join('=');
//     })
//     redirectTo.query = queryObject;
//   }

//   if (typeof query.hash === 'string' && query.hash !== '') {
//     redirectTo.hash = `#${query.hash}`;
//   }

//   replace(redirectTo);
// }

// function checkForRedirect(nextState, replace) {
//   const location = nextState.location;
//   if (location.query.redirect === 'true') {
//     parseRedirectQuery(location.query, replace);
//   } else if (location.pathname.split('/')[1] === gitHubRepoName) {
//     redirectToDomain();
//   }
// }

export default (
  <Route path="/stock-prediction" component={App} /*onEnter={checkForRedirect}*/>
    <IndexRoute component={Index} />
    <Route path="company/:company" component={Company} />
    <Route path="404" component={NotFoundView} />
    <Redirect from="*" to="404" />
  </Route>
);
