import earningsEstimate, { leastSquarceEstimate } from '../services/ls';
import data from './data.json';
import { data as companyNames } from './companies.json';
import { data as screener } from './screener.json';
import { fromJS, Map } from 'immutable';

// console.log('data', data);
// console.log('companyNames', companyNames);
// console.log('screener', screener);

const mergeData = companyNames.map((company, index) => {
  const price = screener
    .find(screenerCompany => screenerCompany.ShortName === company.ShortName)
    .KpisValues[1].NumValue;

  const dividend = data[index][4].Sparkline;
  const earnings = data[index][5].Sparkline;

  const avgDividendRatio = dividend
    .map((d, i) => d.yield / earnings[i].yield)
    .filter(dividendRatio => dividendRatio > 0 && dividendRatio < 2)
    .reduce((out, ratio, i, array) => out + ratio/array.length, 0);

  const lsParams = leastSquarceEstimate(earnings
    .map(spark => spark.yield)
    .filter(value => value !== 0)
  );

  return {
    ...company,
    history: data[index],
    price,
    avgDividendRatio,
    dividend,
    earnings,
    lsParams
  };
})
// .filter((c1) => c1.avgDividendRatio)
// .sort((c1, c2) => c2.avgDividendRatio - c1.avgDividendRatio)
// .filter(c1 => !c1.earnings.find(e => e.yield < 0))
// .filter(c => !isNaN(c.estimate))
// .sort((c1, c2) => c2.estimate - c1.estimate)
.map(v => [v.ShortName, fromJS(v)])
// .filter((c, index) => index < 100);

// console.log('mergeData', mergeData);
// const fromJS(mergeData)

export default Map(mergeData);
