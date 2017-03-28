import { fromJS } from 'immutable';
// import LS from 'local-storage';

// const storageJson = LS.get('stocks');
// const localStorage = storageJson ? JSON.parse(storageJson) : {};

const initialState = fromJS({
  positiveEarningsGrowth: true,
  positiveRevenueGrowth: true
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

export default function (state = initialState, action) {
  let newState = state;

  switch (action.type) {
    case FILTER_SET_PARAM: {
      newState = state.setIn(action.path, action.value);
      break;
    }
  }

  // TODO Merge with excising localStorage
  // LS('stocks', JSON.stringify(newState));

  return newState;
}
