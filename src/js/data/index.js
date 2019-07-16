import axios from 'axios';
// import earningsData from './earnings.json';
// import earningsUsData from './us-earnings.json';
import { fromJS, Map } from 'immutable';
import manualData from './manualData';

export default function importStockData () {
  // console.log('fetch data');
  const stockData$ = axios.get('/stock-prediction/earnings.json')
    .catch(() => axios.get('/images/earnings.json'))
    .then(({data}) => Map(data.map(v => [v.CountryUrlName, fromJS(v)]))
      // .merge(Map(earningsUsData.map(v => [v.CountryUrlName, fromJS(v)])))
      .mergeDeep(manualData));

  // const theData = Map(earningsData.map(v => [v.CountryUrlName, fromJS(v)]))
    // .merge(Map(earningsUsData.map(v => [v.CountryUrlName, fromJS(v)])))
    // .mergeDeep(manualData);

  // const promise = new Promise((resolve, reject) => resolve(theData));
  return stockData$;
}

// export default Map(earningsData.map(v => [v.CountryUrlName, fromJS(v)]))
//   // .merge(Map(earningsUsData.map(v => [v.CountryUrlName, fromJS(v)])))
//   .mergeDeep(manualData);

// Debug
// export default Map(earningsUsData.map(v => [v.CountryUrlName, fromJS(v)]))
//   .mergeDeep(manualData);
