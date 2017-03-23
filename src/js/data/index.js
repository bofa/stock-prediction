import { leastSquarceEstimate } from '../services/ls';
import data from './data.json';
import { data as companyNames } from './companies.json';
import { data as screener } from './screener.json';

function earningsEstimate(earnings) {
  const [bias, slop, cov] = leastSquarceEstimate(earnings.map(spark => spark.yield));
  return [bias, [bias, slop, cov]];
}

console.log('data', data);
console.log('companyNames', companyNames);
console.log('screener', screener);

const mergeData = companyNames.map((company, index) => {
  const price = screener.find(screenerCompany => screenerCompany.ShortName === company.ShortName).KpisValues[1].NumValue;
  const [estimate, params] = earningsEstimate(data[index][5].Sparkline);

  return {
    ...company,
    history: data[index],
    price,
    params,
    lsEarnings: estimate / price
  };
}).sort((c1, c2) => c2.lsEarnings - c1.lsEarnings)
  .filter((c, index) => index < 100);

console.log('mergeData', mergeData);

export default mergeData;
