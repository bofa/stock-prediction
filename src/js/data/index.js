import earningsData from './earnings.json';
import { fromJS, Map } from 'immutable';

export default Map(earningsData.map(v => [v.ShortName, fromJS(v)]));
