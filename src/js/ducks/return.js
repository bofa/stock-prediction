import { Map, fromJS } from 'immutable';
import LS from 'local-storage';
import axios from 'axios';

const localStorageIndex = 'avanzaTransactions';

const storageJson = LS.get(localStorageIndex);
const localStorage = storageJson ? JSON.parse(storageJson) :
{ userGroups: [] };

const initialState = fromJS(localStorage);

const RETURN_LOAD_DATA = 'RETURN_LOAD_DATA';
const RETURN_CREATE_GROUP = 'RETURN_CREATE_GROUP';

function convertToNumber(str) {
  if(str) {
    return Number(str.replace(',', '.'));
  }

  return 0;
}

export function loadFile(acceptedFiles) {
  return dispatch => {
    axios.get(acceptedFiles[0].preview)
      .then(response => {
        var csvJS = response.data
        .split('\n')
        .map(line => line.split(';'));

        const csv = fromJS(csvJS);
        console.log('csvJS', csvJS);

        return new Map({
          headers: csv.get(0),
          dataPoints: csv
            .filter((item, index) => index > 0)
            .map(transaction => transaction
              .update(0, date => new Date(date))
              .update(4, convertToNumber)
              .update(5, convertToNumber)
              .update(6, convertToNumber))
        });
      }).then(massagedData => dispatch({
        type: RETURN_LOAD_DATA,
        payload: massagedData
      }));
  };
}

export function addToUserGroup(userGroup, group) {
  return {
    type: RETURN_CREATE_GROUP,
    userGroup,
    group
  };
}

export default function (state = initialState, action) {
  let newState = state;

  switch (action.type) {
    case RETURN_LOAD_DATA: {
      newState = state.set('transactions', action.payload);
      break;
    }

    case RETURN_CREATE_GROUP: {
      newState = state.updateIn(
        ['userGroups', action.userGroup],
        (list) => list.push(action.group),
        action.group);
      break;
    }
  }

  // TODO Merge with excising localStorage
  LS(localStorageIndex, JSON.stringify(newState));

  return newState;
}
