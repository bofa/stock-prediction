import axios from 'axios';
import { fromJS } from 'immutable';

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

export function loadBorsdata(name) {
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
