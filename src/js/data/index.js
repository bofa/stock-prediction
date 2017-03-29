import earningsEstimate, { leastSquarceEstimate, calculateMean } from '../services/ls';
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
  const revenue = data[index][6].Sparkline;

  const historyLength =  revenue
    .filter(spark => spark.yield !== 0)
    .length;

  const avgDividendRatio = dividend
    .map((d, i) => d.yield / earnings[i].yield)
    .filter(dividendRatio => dividendRatio > 0 && dividendRatio < 2)
    .reduce((out, ratio, i, array) => out + ratio/array.length, 0);

  const avgEarnings = earnings
    .map(spark => spark.yield)
    .filter(value => value !== 0)
    .reduce((out, ratio, i, array) => out + ratio/array.length, 0);

  const avgRevenue = revenue
    .map(spark => spark.yield)
    .filter(value => value !== 0)
    .reduce((out, ratio, i, array) => out + ratio/array.length, 0);

  const earningsLs = leastSquarceEstimate(earnings
    .map(spark => spark.yield)
    .filter(value => value !== 0)
  );

  const revenueLs = leastSquarceEstimate(revenue
    .map(spark => spark.yield)
    .filter(value => value !== 0)
  );

  return {
    ...company,
    history: data[index],
    historyLength,
    price,
    avgDividendRatio,
    dividend,
    earnings,
    avgEarnings,
    earningsLs,
    revenue,
    avgRevenue,
    revenueLs
  };
})
// .filter((c1) => c1.avgDividendRatio)
// .sort((c1, c2) => c2.avgDividendRatio - c1.avgDividendRatio)
// .filter(c1 => !c1.earnings.find(e => e.yield < 0))
// .filter(c => !isNaN(c.estimate))
// .sort((c1, c2) => c2.estimate - c1.estimate)
.map(company => { console.log(company); return company; })
.map(v => [v.ShortName, fromJS(v)])
// .filter((c, index) => index < 100);


// const fromJS(mergeData)

export default Map(mergeData);
