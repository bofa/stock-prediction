import { combineReducers } from 'redux';
import stockReducer from './stocks';
import filterReducer from './filter';

const rootReducer = combineReducers({
  stockReducer,
  filterReducer
});

export default rootReducer;
