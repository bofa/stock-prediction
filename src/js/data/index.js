import earningsData from './earnings.json';
import { fromJS, Map } from 'immutable';
import manualData from './manualData';

export default Map(earningsData.map(v => [v.ShortName, fromJS(v)]))
  .mergeDeep(manualData);
