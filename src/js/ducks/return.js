import { Map, fromJS } from 'immutable';
import LS from 'local-storage';
import axios from 'axios';

const localStorageIndex = 'avanzaTransactions';

const storageJson = LS.get(localStorageIndex);
const localStorage = storageJson ? JSON.parse(storageJson) : {};

const initialState = fromJS(localStorage);

const RETURN_LOAD_DATA = 'RETURN_LOAD_DATA';

export function loadFile(acceptedFiles) {
  return dispatch => {
    axios.get(acceptedFiles[0].preview)
      .then(response => {
        var csvJS = response.data
        .split('\n')
        .map(line => line.split(';'));

        const csv = fromJS(csvJS);

        return new Map({
          headers: csv.get(0),
          dataPoints: csv
            .filter((item, index) => index > 0)
        });
      }).then(massagedData => dispatch({
        type: RETURN_LOAD_DATA,
        payload: massagedData
      }));
  };
}

export default function (state = initialState, action) {
  let newState = state;

  switch (action.type) {
    case RETURN_LOAD_DATA: {
      newState = state.set('transactions', action.payload);
      break;
    }
  }

  // TODO Merge with excising localStorage
  LS(localStorageIndex, JSON.stringify(newState));

  return newState;
}
