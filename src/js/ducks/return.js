import { Map, fromJS, List } from 'immutable';
import LS from 'local-storage';
import axios from 'axios';

const localStorageIndex = 'avanzaTransactions';

LS.clear();
const storageJson = LS.get(localStorageIndex);
// const storageJson = undefined;
const localStorage = storageJson ? JSON.parse(storageJson) :
{
  userGroups: {},
  customCompanies: []
};

const initialState = fromJS(localStorage);

const RETURN_LOAD_DATA = 'RETURN_LOAD_DATA';
const RETURN_CREATE_GROUP = 'RETURN_CREATE_GROUP';
const RETURN_ADD_TO_GROUP = 'RETURN_ADD_TO_GROUP';
const RETURN_ADD_CUSTOM_COMPANY = 'RETURN_ADD_CUSTOM_COMPANY';

function convertToNumber(str) {
  if(str) {
    return Number(str.replace(',', '.').replace(' ', ''));
  }
  return 0;
}

export function loadFile(acceptedFiles) {
  // console.log('acceptedFiles', acceptedFiles);
  return dispatch => {
    axios.get(acceptedFiles[0].preview)
      .then(response => {
        var csvJS = response.data
        .split('\n')
        .map(line => line.split(';'));

        const csv = fromJS(csvJS);
        // console.log('csvJS', csvJS);

        if (csvJS[0].length === 10) {
          // Avanza
          return new Map({
            headers: csv.get(0),
            dataPoints: csv
              .filter((item, index) => index > 0)
              .map(transaction => new Map({
                date: new Date(transaction.get(0)),
                type: transaction.get(2),
                currency: transaction.get(7),
                sum: convertToNumber(transaction.get(6)),
                amount: convertToNumber(transaction.get(4)),
                name: transaction.get(3),
                id: transaction.get(8),
              }))
          });
        } else if (csvJS[0].length === 22) {
          // Nordnet
          return new Map({
            headers: csv.get(0),
            dataPoints: csv
              .filter((item, index) => index > 0)
              .map(transaction => new Map({
                date: new Date(transaction.get(2)),
                type: transaction.get(4),
                currency: transaction.get(13),
                sum: convertToNumber(transaction.get(12)),
                amount: convertToNumber(transaction.get(8)),
                name: transaction.get(5),
                id: transaction.get(0),
              }))
          });
        }
      }).then(massagedData => dispatch({
        type: RETURN_LOAD_DATA,
        payload: massagedData
      }));
  };
}

export function createUserGroup(userGroup) {
  return {
    type: RETURN_CREATE_GROUP,
    userGroup
  };
}

export function addToUserGroup(userGroup, group) {
  return {
    type: RETURN_ADD_TO_GROUP,
    userGroup,
    group
  };
}

/**
 *
 * @param {String} userGroup
 * @param {Number} price
 */
export function addCustomCompany(userGroup, price) {
  console.log('price ä', price);
  return {
    type: RETURN_ADD_CUSTOM_COMPANY,
    payload: {
      // Name?
      CountryUrlName: userGroup,
      price,
    },
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
      newState = state.setIn(['userGroups', action.userGroup], new List());
      break;
    }

    case RETURN_ADD_TO_GROUP: {
      newState = state.setIn(
        ['userGroups', action.userGroup],
        action.group
      );
      break;
    }

    case RETURN_ADD_CUSTOM_COMPANY: {
      newState = state
        .update('customCompanies', comp => comp.concat(action.payload));
      break;
    }
  }

  // TODO Merge with excising localStorage
  LS(localStorageIndex, JSON.stringify(newState));

  return newState;
}
