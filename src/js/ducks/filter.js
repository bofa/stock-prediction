import { fromJS } from 'immutable';
import LS from 'local-storage';

const storageJson = LS.get('filter');
const localStorage = storageJson ? JSON.parse(storageJson) : {};

const initialState = fromJS({
  positiveEarningsGrowth: true,
  positiveRevenuGrowth: true,
  positiveFreeCashFlowGrowth: false,
  minHistoryLength: 6,
  minCorrelation: 0.4,
  sortOn: 'dividend',
  intrest: 0.00,
  projectionTime: 7,
  leverage: 'none',
  ...localStorage
});

const FILTER_SET_PARAM = 'FILTER_SET_PARAM';

export function setPositiveEarningsGrowth(active) {
  return {
    type: FILTER_SET_PARAM,
    path: ['positiveEarningsGrowth'],
    value: active
  };
}

export function setPositiveRevenuGrowth(active) {
  return {
    type: FILTER_SET_PARAM,
    path: ['positiveRevenuGrowth'],
    value: active
  };
}

export function setPositiveFreeCashFlowGrowth(active) {
  return {
    type: FILTER_SET_PARAM,
    path: ['positiveFreeCashFlowGrowth'],
    value: active
  };
}

export function setMinHistoryLength(years) {
  return {
    type: FILTER_SET_PARAM,
    path: ['minHistoryLength'],
    value: years
  };
}

export function setMinCorrelation(years) {
  return {
    type: FILTER_SET_PARAM,
    path: ['minCorrelation'],
    value: years
  };
}

export function setSortOn(value) {
  return {
    type: FILTER_SET_PARAM,
    path: ['sortOn'],
    value
  };
}

export function setLeverage(value) {
  return {
    type: FILTER_SET_PARAM,
    path: ['leverage'],
    value
  };
}

export function setIntrest(value) {
  return {
    type: FILTER_SET_PARAM,
    path: ['intrest'],
    value
  };
}

export function setProjectionTime(value) {
  return {
    type: FILTER_SET_PARAM,
    path: ['projectionTime'],
    value
  };
}

export default function (state = initialState, action) {
  let newState = state;

  switch (action.type) {
    case FILTER_SET_PARAM: {
      newState = state.setIn(action.path, action.value);
      break;
    }
  }

  // TODO Merge with excising localStorage
  LS('filter', JSON.stringify(newState));

  return newState;
}
