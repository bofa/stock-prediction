import axios from 'axios';
import { fromJS } from 'immutable';
import writeJsonFile from 'write-json-file';
import { data as companyNames } from './companies.json';
import { leastSquarceEstimate } from '../src/js/services/ls';

// console.log('companies', companies);

const currentYear = 2017;
// const companies = [{
//   "CompanyId":923,
//   "Name":"A City Media",
//   "ShortName":"ACM",
//   "CountryUrlName":"a-city-media",
//   "CountryShortName":"SWE",
//   "KpisValues":[{"NumValue":-1.12570357,"StringValue":"-1,1 %"}],
//   "CountryId":1,
//   "MarketId":4,
//   "SectorId":8,
//   "BranchId":27,
//   "Instrument":0
// },{
//   "CompanyId":747,
//   "Name":"A Group of Retail",
//   "ShortName":"AGORA",
//   "CountryUrlName":"a-group-of-retail",
//   "CountryShortName":"SWE",
//   "KpisValues":[{"NumValue":-1.96078432,"StringValue":"-2,0 %"}],
//   "CountryId":1,
//   "MarketId":4,
//   "SectorId":1,
//   "BranchId":3,
//   "Instrument":0
// }];

// Get all the revenue and earnings

function reduceCompanyData(company, index, companyNames, priceArray) {
  const metaData = companyNames[index];
  // console.log('company', company);
  const priceObj = priceArray
    .find(screenerCompany => screenerCompany.ShortName === metaData.ShortName);

  const price = priceObj ? priceObj.Price : 0;

  const dividend = company[4].Sparkline;
  const earnings = company[5].Sparkline;
  const revenue = company[6].Sparkline;

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
    ...metaData,
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
}

function delayApiCall(comp, delay = 20000) {
  // return axios.get(`https://borsdata.se/api/ratio?companyUrlName=${comp.CountryUrlName}&ratioType=1`);
  return new Promise((resolve, reject) => {
    setTimeout(() => axios.get(`https://borsdata.se/api/ratio?companyUrlName=${comp.CountryUrlName}&ratioType=1`)
      .then(response => { console.log(comp.CountryUrlName); return resolve(response); })
      .catch(() => {
        setTimeout(() => axios.get(`https://borsdata.se/api/ratio?companyUrlName=${comp.CountryUrlName}&ratioType=1`)
          .then(response => resolve(response))
          , delay);
        console.log(`Retrying: ${comp.CountryUrlName}`);
      })
    , delay);
  });
}

function getHistoricData(prices) {
  Promise.all(companyNames
    // .filter((v, index) => index < 2)
    .map((comp, index) => delayApiCall(comp, 200*index))
  ).then(allResponse => allResponse.map(response => fromJS(response.data)
    .map(item => item.update('Sparkline', lineString => lineString.split(',')
      .map((value, index, array) => ({
        year: currentYear + index - array.length,
        yield: Number(value)
      })))
    ).toJS())
    .map((historicalData, index) => reduceCompanyData(historicalData, index, companyNames, prices))
  ).then((response) => writeJsonFile('src/js/data/earnings.json', response, { indent: null }))
  .then(() => console.log('done earnings'));
}

// Get the price

axios.post('https://borsdata.se/screener/GetCompaniesForScreener', {"filter":{"KpiFilter":[{"CategoryId":11,"AdditionalId":1001,"KpiId":1,"CalculationType":3,"Calculation":0,"CalcTime":0},{"CategoryId":9,"AdditionalId":1,"KpiId":151,"CalculationType":2,"Calculation":20,"CalcTime":0},{"CategoryId":10,"AdditionalId":157,"KpiId":157,"CalculationType":2,"Calculation":31,"CalcTime":19},{"CategoryId":9,"AdditionalId":151,"KpiId":151,"CalculationType":2,"Calculation":20,"CalcTime":6},{"CategoryId":0,"AdditionalId":1,"KpiId":1,"CalculationType":2,"Calculation":1,"CalcTime":0},{"CategoryId":0,"AdditionalId":2,"KpiId":2,"CalculationType":2,"Calculation":1,"CalcTime":0},{"CategoryId":0,"AdditionalId":3,"KpiId":3,"CalculationType":2,"Calculation":1,"CalcTime":0},{"CategoryId":0,"AdditionalId":4,"KpiId":4,"CalculationType":2,"Calculation":1,"CalcTime":0}],"OnlyStocks":true,"OnlyIndexes":true,"OnlyPref":true,"OnlyFinansSector":true}})
  // .then(console.log)
  .then(response => response.data.data.map(company => ({
    ShortName: company.ShortName,
    Price: company.KpisValues[1].NumValue
  })))
  .then(getHistoricData);
  // .then((reducedData) => writeJsonFile('price.json', reducedData, { indent: null }))
  // .then(() => console.log('done price'));

