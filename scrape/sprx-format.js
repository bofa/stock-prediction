import companiesJS from './sprx-raw.json';
import { fromJS } from 'immutable';

const notSwedish = fromJS([
  'AstraZeneca',
  'ABB',
  'Nokia',
]);

const compaines = fromJS(companiesJS)
  .filter(c => !notSwedish.includes(c.get('name')))
  .sort(c => c.get('marketCap'))
  .filter((c, i) => i < 20)
  // .filter(c => c.get('marketCap') > 1e4);

const sum = compaines.reduce((sum, c) => sum + c.get('marketCap'), 0);

const out = compaines
  .map(c => c
    .set('index', Math.min(0.1, c.get('marketCap')/sum))
    .update('marketCap', marketCap => marketCap.toFixed(0))
  )
  .sortBy(c => -c.get('index'));

const level40 = out.filter(c => c.get('index') >= 0.05).reduce((agg, obj) => agg + obj.get('index',), 0);

console.log(out.toJS());
console.log('Size: ', out.size);
console.log('level40', level40);

