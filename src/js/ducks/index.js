import { combineReducers } from 'redux';
import stockReducer from './stocks';

const rootReducer = combineReducers({
  stockReducer
});

export default rootReducer;
