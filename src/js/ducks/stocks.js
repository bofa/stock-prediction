import axios from 'axios';
import { fromJS, Map } from 'immutable';

import { data as companies } from '../../data/companies.json';

const currentYear = 2017;

// const companies = [
//   {
//     CountryUrlName: 'hm'
//   }
// ];

// console.log('companies', companies);

function delayApiCall(comp, delay = 20000) {
  // return axios.get(`https://borsdata.se/api/ratio?companyUrlName=${comp.CountryUrlName}&ratioType=1`);
  return new Promise((resolve, reject) => {
    setTimeout(() => axios.get(`https://borsdata.se/api/ratio?companyUrlName=${comp.CountryUrlName}&ratioType=1`)
      .then(response => resolve(response))
      // .catch(delayApiCall(comp))
    , delay);
  });
}

// Promise.all(companies
//   // .filter((v, index) => index < 100)
//   .map((comp, index) => delayApiCall(comp, 300*index))
// ).then(allResponse => allResponse.map(response => fromJS(response.data)
//   .map(item => item.update('Sparkline', lineString => lineString.split(',')
//     .map((value, index, array) => ({
//       year: currentYear + index - array.length,
//       yield: Number(value)
//     })))
//   ).toJS())
// ).then(console.log);



const initialState = fromJS({

});

export const STOCK_APP_SET_TIME_DURATION = 'STOCK_APP_SET_TIME_DURATION';
export const STOCK_APP_LOAD_DATA = 'STOCK_APP_LOAD_DATA';

export function setTimeDuration(duration) {
  return {
    type: STOCK_APP_SET_TIME_DURATION,
    duration
  };
}

// export function loadBorsdata(name) {
//   return (dispatch) => {
//     axios.get(`https://borsdata.se/api/ratio?companyUrlName=${name}&ratioType=1`).then((response) => {
//       console.log(response);
//       return dispatch({
//         type: STOCK_APP_LOAD_DATA,
//         name,
//         data: fromJS(response.data)
//       });
//     });
//   };
// }

// const yieldArray = stocks
//   .getIn([stock, 5, 'Sparkline'], '')
//   .split(',')
//   .map((value, index, array) => ({
//     year: 2017 + index - array.length,
//     yield: Number(value)
//   }));

export function loadBorsdata(name) {
  return (dispatch) => {
    axios.get(`https://borsdata.se/api/ratio?companyUrlName=${name}&ratioType=1`).then((response) => {
      console.log(response);
      return dispatch({
        type: STOCK_APP_LOAD_DATA,
        name,
        data: fromJS(response.data).map(item => item.update('Sparkline', lineString => lineString.split(',')
          .map((value, index, array) => ({
            year: currentYear + index - array.length,
            yield: Number(value)
          }))))
      });
    });
  };
}

export default function (state = initialState, action) {
  switch (action.type) {
    case STOCK_APP_LOAD_DATA: {
      return state.set(action.name, action.data);
    }
    default:
      return state;
  }
}
