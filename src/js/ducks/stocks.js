// import fetch from 'universal-fetch';
import axios from 'axios';
import { fromJS, Map } from 'immutable';
import { transformDataByVolume, transformDataByPriceOverTime, transformDataByExchangeVolumeByMinutes } from './../helpers/dataTransformer';

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

// export function loadData() {
//   return (dispatch) => {
//     fetch('http://localhost:8080/data.json').then((response) => {
//       if (response.status >= 400) {
//         throw new Error("Bad response from server");
//       }
//       return response.json();
//     }).then((responseData) => dispatch({
//       type: STOCK_APP_LOAD_DATA,
//       stockData: responseData,
//       tradeVolumePerAccount: transformDataByVolume(responseData),
//       tradePriceOverTime: transformDataByPriceOverTime(responseData),
//       exchangeVolumeByMinutes: transformDataByExchangeVolumeByMinutes(responseData, 10)
//     }));
//   };
// }

export function loadBorsdata(name) {
  // return fetch('https://borsdata.se/api/ratio?companyUrlName=hm&ratioType=1').then(response => console.log(response));
  return (dispatch) => {
    axios.get(`https://borsdata.se/api/ratio?companyUrlName=${name}&ratioType=1`).then((response) => {
      console.log(response);
      return dispatch({
        type: STOCK_APP_LOAD_DATA,
        name,
        data: fromJS(response.data)
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
