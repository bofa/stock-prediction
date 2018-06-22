import { Map, fromJS } from 'immutable';
import { average } from './statistics';
import { leastSquarceEstimate } from './ls';
import { intrest as investmentIntrestGroups, saftyMargin } from '../data/manualData';

export function setModel(company, time) {
  const revenue = company.get('revenue').slice(-time);
  const earnings = company.get('earnings').slice(-time);
  const freeCashFlow = company.get('freeCashFlow').slice(-time);

  // console.log('company', company.toJS());
  // console.log(company.get('earningsLs'), leastSquarceEstimate(earnings.toJS()));

  return company
    .set('avgEarnings', average(earnings))
    .set('avgRevenue', average(revenue))
    .set('revenueLs', fromJS(leastSquarceEstimate(revenue.toJS())))
    .set('earningsLs', fromJS(leastSquarceEstimate(earnings.toJS())))
    .set('freeCashFlowLs', fromJS(leastSquarceEstimate(freeCashFlow.toJS())));
}

export function parseMargin(marginType, company) {
  if(marginType === 'none') {
    return [1, 0, 'none'];
  } else if(marginType === 'best') {
    const maxMargin = company.get('margin', Map()).max();
    const key = company.get('margin', Map()).keyOf(maxMargin);
    const intrest = investmentIntrestGroups.get(key);
    const leverage = 1/(1-saftyMargin*maxMargin);
    const cost = intrest*(leverage - 1);

    return maxMargin ? [leverage, cost, key] : [1, 0, 'none'];
  } else {
    const margin = company.getIn(['margin', marginType], 0);
    const intrest = investmentIntrestGroups.get(marginType);
    const leverage = 1/(1-saftyMargin*margin);
    const cost = intrest*(leverage - 1);

    return [leverage, cost, marginType];
  }
}
