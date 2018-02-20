import axios from 'axios';
import { fromJS, List, Map } from 'immutable';
import writeJsonFile from 'write-json-file';
import { data as companyNames } from './companies.json';
import { leastSquarceEstimate } from '../src/js/services/ls';
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retries: 3 });

function toNumber (string) {
  return Number(string
    .replace(',', '.')
    .replace(/\s/g, ''));
}

// console.log('companies', companies);
const Cookie = '__cfduid=de9cc98662ca3d4d696328ee8820a363d1513747353; ARRAffinity=4ee8329667445e85fddd42eaf6e3212550bb2188722e873b8cd7b7c0423843c5; __utma=182498229.761015667.1513747357.1513747357.1513747357.1; __utmc=182498229; __utmz=182498229.1513747357.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __utmt=1; ai_user=69AkY|2017-12-20T05:22:36.960Z; borsdata=050C40F5C71CD55E4797BD410C779A46753517A77CB805EF408334B375EC6F2DE77070F8E4901A7EBD46B855B0133A6EC09BC2ABA561A1D6C22BFB333B78BD1C70C773EA0B5E5B98B0C1466F99B2E61FF952EE8E; __RequestVerificationToken=rEaUC87J3Lp-HAaeFmI8zCwAKABMfpR_cZbZnM_MDnU9QX2VoTIF1UCv1GaXTbNriE6-1q9kWeMHeaGPRb5V3pQFCM81; __utmb=182498229.3.10.1513747357; ai_session=jhMta|1513747357174|1513747369780.94';
// const Cookie = 'ASP.NET_SessionId=nkh2ozmpktusomcuculak25y; i18next=en; ai_user=425A92BE-7314-4EF6-AB9A-8AACA09414DB; __RequestVerificationToken=evSgKWYHjmT4jZb-przHg5Z5hbNvuCWLRi-1iGX55g0E9GNThM4G0-N3-RnDiuIl55nQK7E0D8t2J-_RYVE6GAmuNIw1; borsdata=82382B0E3D25E43E383EEAA9FE9FB3AC7C7D2E170529FE50841292DD1B368D3E971E18123F1218F29398FA645A8FB180F58EEFE224B535D721E8B7532AA68465B354DBBC7C4BE65B124CCD956793F8617AFC3813; __utmt=1; __utma=182498229.2095511960.1389026130.1510254266.1510409414.633; __utmb=182498229.10.10.1510409414; __utmc=182498229; __utmz=182498229.1510247636.631.33.utmcsr=t.co|utmccn=(referral)|utmcmd=referral|utmcct=/FqoxYuC8mF; ARRAffinity=b07d64be9795235129d814a7e97ce6ff5cfdc5f4a69e47e7d129edc7dc1681e4; ASP.NET_SessionId=nkh2ozmpktusomcuculak25y; i18next=en; ai_user=425A92BE-7314-4EF6-AB9A-8AACA09414DB; __RequestVerificationToken=evSgKWYHjmT4jZb-przHg5Z5hbNvuCWLRi-1iGX55g0E9GNThM4G0-N3-RnDiuIl55nQK7E0D8t2J-_RYVE6GAmuNIw1; borsdata=E77287C6B7E53D38F551BD1A1B59FAA1C4AA3DAFF118B7B5DA92AE89F79305A76F5088296B8661B090E7018C7FDB58B6230FECB29DF50CA9AB3304156876B5A6E8FC3009160B694580C5935DDD24EC50185B26F9; ARRAffinity=4f1c6e22055df3492c58f8aa5bb0f4c241639487b0e0e8a70a669191b00aaf71; __utmt=1; __utma=182498229.2095511960.1389026130.1512306606.1512309301.647; __utmb=182498229.1.10.1512309301; __utmc=182498229; __utmz=182498229.1510483880.635.34.utmcsr=bofa.github.io|utmccn=(referral)|utmcmd=referral|utmcct=/stock-prediction/company/BRE2; ai_session=rfWa6|1512309290028|1512309303362.235';
// const Cookie = 'ASP.NET_SessionId=nkh2ozmpktusomcuculak25y; i18next=en; ai_user=425A92BE-7314-4EF6-AB9A-8AACA09414DB; __RequestVerificationToken=evSgKWYHjmT4jZb-przHg5Z5hbNvuCWLRi-1iGX55g0E9GNThM4G0-N3-RnDiuIl55nQK7E0D8t2J-_RYVE6GAmuNIw1; borsdata=82382B0E3D25E43E383EEAA9FE9FB3AC7C7D2E170529FE50841292DD1B368D3E971E18123F1218F29398FA645A8FB180F58EEFE224B535D721E8B7532AA68465B354DBBC7C4BE65B124CCD956793F8617AFC3813; __utmt=1; __utma=182498229.2095511960.1389026130.1510254266.1510409414.633; __utmb=182498229.10.10.1510409414; __utmc=182498229; __utmz=182498229.1510247636.631.33.utmcsr=t.co|utmccn=(referral)|utmcmd=referral|utmcct=/FqoxYuC8mF; ARRAffinity=b07d64be9795235129d814a7e97ce6ff5cfdc5f4a69e47e7d129edc7dc1681e4; ASP.NET_SessionId=nkh2ozmpktusomcuculak25y; i18next=en; ai_user=425A92BE-7314-4EF6-AB9A-8AACA09414DB; __RequestVerificationToken=evSgKWYHjmT4jZb-przHg5Z5hbNvuCWLRi-1iGX55g0E9GNThM4G0-N3-RnDiuIl55nQK7E0D8t2J-_RYVE6GAmuNIw1; borsdata=82382B0E3D25E43E383EEAA9FE9FB3AC7C7D2E170529FE50841292DD1B368D3E971E18123F1218F29398FA645A8FB180F58EEFE224B535D721E8B7532AA68465B354DBBC7C4BE65B124CCD956793F8617AFC3813; __utma=182498229.2095511960.1389026130.1510254266.1510409414.633; __utmb=182498229.13.10.1510409414; __utmc=182498229; __utmz=182498229.1510247636.631.33.utmcsr=t.co|utmccn=(referral)|utmcmd=referral|utmcct=/FqoxYuC8mF; ARRAffinity=e059329da4e95331ab281b991fbd32e9718efcd6453b116ac8bfdcacea31a3f0'
// const Cookie = 'ASP.NET_SessionId=nkh2ozmpktusomcuculak25y; i18next=en; ai_user=425A92BE-7314-4EF6-AB9A-8AACA09414DB; __RequestVerificationToken=evSgKWYHjmT4jZb-przHg5Z5hbNvuCWLRi-1iGX55g0E9GNThM4G0-N3-RnDiuIl55nQK7E0D8t2J-_RYVE6GAmuNIw1; borsdata=C810B8AAECA1442B8EAF375D0580F5723D8A7D607BF23081A4F4F42AE975F58137A30DF16CA08E4D830DCDDBBBD6654E3262AF1E07FE588E5F095E601FF38191B8B92E6BD4CAA421E11C31F0A718DC3AD721A96E; __utma=182498229.2095511960.1389026130.1507656939.1507669065.604; __utmc=182498229; __utmz=182498229.1507402223.600.26.utmcsr=localhost:3000|utmccn=(referral)|utmcmd=referral|utmcct=/stock-prediction/company/MATAS; ARRAffinity=e793e6e92b2de946cbb491c1ec2c5e67879a308f0b1c3bb1fb80e0e78e4ab02b';
// const Cookie2 = 'RRAffinity=96608800acd44d5cd2516e754baa37a29fb091dbb128bc779bbb9c711a9a06f1; borsdata=FA9462DAECB8EC4DAD681D7581C52F30C454CF4A39815B290A78C3C3456C156660A2BA8DFE4A339363F4568CC5EC5D911BB25EEA73791876225976F30C0555724E6779A7BC250D67BC9A8D6B6BF4F30EDA054DE3; __utmt=1; __utma=182498229.2055768505.1507986741.1508005753.1508056837.3; __utmb=182498229.2.10.1508056837; __utmc=182498229; __utmz=182498229.1508056837.3.3.utmcsr=localhost:3000|utmccn=(referral)|utmcmd=referral|utmcct=/stock-prediction/';

function formatAnalysisReport(response) {
  return fromJS(response.data).update('Rows', rows => rows.map(row => row.update('Data', data => data.map(toNumber))));
}

function formatKpisResponseMain (response) {
  return fromJS(response.data).map(item => item.update('Sparkline', lineString => lineString.split(',')
    .map((value, index, array) => ({
      year: currentYear + index - array.length,
      yield: Number(value)
    }))));
}

function formatKpisResponseSingle (response) {
  const data = fromJS(response.data);

  // const Sparkline = data.get('Data').map((value, index, array) => new Map({
  //   year: currentYear + index - array.length,
  //   yield: Number(value)
  // }));

  // return data.set('Sparkline', Sparkline);
  return data;
}

function formatStockPriceData (response) {
  const range = fromJS(response.data).slice(-90).map(item => item.get('y'));
  const [bias, slope] = leastSquarceEstimate(range.toJS());
  const relativeSlope = slope / range.get(-1);

  return relativeSlope;
}

function consolePipe (pipe, override) {
  console.log('pipe', pipe);

  if(override) {
    return override;
  }
  return pipe;
}

const empty = fromJS()

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

function reduceCompanyData(response, index, companyNames, priceArray) {
  const metaData = companyNames[index];

  try {
    // console.log('company', company.toJS());
    const priceObj = priceArray
      .find(screenerCompany => screenerCompany.ShortName === metaData.ShortName);

    const price = priceObj ? priceObj.Price : 0;

    const numberOfStocks = response[4].getIn(['Data']).toJS();

    // TODO fix!
    // const converstionFactor = response[0].getIn(['Headers', 0]) === 'MSEK' ? 1e6 : 1;
    const converstionFactor = 1e6;

    const dividend = response[0].getIn(['Rows', 8, 'Data'])
      .map((value, index) => value * numberOfStocks[index])
      .toJS();
    const earnings = response[0].getIn(['Rows', 1, 'Data']).toJS();
    const revenue = response[0].getIn(['Rows', 0, 'Data']).toJS();

    const freeCashFlow = response[1].getIn(['Data']).toJS();

    // const solidity = response[1].getIn(['Data', -1]);

    const netBrowing = response[2].getIn(['Data', -1]);

    const stockPriceMomentum = response[3];

    const historyLength =  revenue.length;

    const avgDividendRatio = dividend
      .map((d, i) => d / earnings[i])
      .filter(dividendRatio => dividendRatio > 0 && dividendRatio < 2)
      .reduce((out, ratio, i, array) => out + ratio/array.length, 0);

    const avgEarnings = earnings
      .reduce((out, ratio, i, array) => out + ratio/array.length, 0);

    const avgRevenue = revenue
      .reduce((out, ratio, i, array) => out + ratio/array.length, 0);

      const earningsLs = leastSquarceEstimate(earnings
        .filter(value => value !== 0)
      );

    const revenueLs = leastSquarceEstimate(revenue
      .filter(value => value !== 0)
    );

    const freeCashFlowLs = leastSquarceEstimate(freeCashFlow);

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
      revenueLs,
      freeCashFlow,
      freeCashFlowLs,
      netBrowing,
      stockPriceMomentum,
      numberOfStocks,
      converstionFactor
    };
  } catch (exception) {
    console.warn('error' + metaData.ShortName, exception);
    return metaData;
  }
}

function delayApiCall(comp, delay = 20000) {
  const call = () => Promise.all([
    axios.get(`https://borsdata.se/api/AnalysisReport?analysisTime=0&analysisType=1&companyUrl=${comp.CountryUrlName}`)
      .then(formatAnalysisReport)
      .catch(() => consolePipe('Error1!' + comp.CountryUrlName, new List())),
    axios.get(`https://borsdata.se/api/AnalysisHighChartSeries?analysisTime=0&companyUrl=${comp.CountryUrlName}&kpiId=63`, {
        headers: { Cookie }})
      .then(formatKpisResponseSingle)
      .catch(error => consolePipe('Error2!' + error + comp.CountryUrlName, new Map())),
    axios.get(`https://borsdata.se/api/AnalysisHighChartSeries?analysisTime=0&companyUrl=${comp.CountryUrlName}&kpiId=73`,{
        headers: { Cookie }})
      .then(formatKpisResponseSingle)
      .catch(error => consolePipe('Error3!' + error + comp.CountryUrlName, new Map())),
    axios.get(`https://borsdata.se/api/highchart?companyUrlName=${comp.CountryUrlName}`)
      .then(formatStockPriceData)
      .catch(() => {}),
    axios.get(`https://borsdata.se/api/AnalysisHighChartSeries?analysisTime=0&companyUrl=${comp.CountryUrlName}&kpiId=61`,{
        headers: { Cookie }})
      .then(formatKpisResponseSingle)
      .catch(error => consolePipe('Error3!' + error + comp.CountryUrlName, new Map())),
  ]);
  // .then(respone => { console.log('respone', respone.toJS()); return respone; })
  // .then(respones => respones[0].push(respones[1]).push(respones[2]));
  // .then(respone => { console.log('respone', respone.toJS()); return respone; })

  // const call = () => axios.get(`https://borsdata.se/api/ratio?companyUrlName=${comp.CountryUrlName}&ratioType=1`)
  //   .then(response => response.data)
  //   .then(fromJS);

  // return axios.get(`https://borsdata.se/api/ratio?companyUrlName=${comp.CountryUrlName}&ratioType=1`);
  return new Promise((resolve, reject) => {
    setTimeout(() => call()
    .then(response => resolve(response))
    .catch(() => {
      setTimeout(() => call()
        .then(response => resolve(response))
        , delay);
      console.log(`Retrying: ${comp.CountryUrlName}`);
    })
    , delay);
  });
}

function getHistoricalDataTest() {
  axios.post('https://borsdata.se/complist/GetCompanies', {"filter":{"KpiFilter":[{"CategoryId":9,"AdditionalId":151,"KpiId":151,"CalculationType":2,"Calculation":20,"CalcTime":1}]}})
  .then(response => response.data)
  .then(console.log);
}

function getHistoricData(prices) {
  axios.post('https://borsdata.se/complist/GetCompanies', {"filter":{"KpiFilter":[{"CategoryId":9,"AdditionalId":151,"KpiId":151,"CalculationType":2,"Calculation":20,"CalcTime":1}]}})
    .then(response => response.data.data)
    .then(companyNames => Promise.all(companyNames
      // .filter((v, index) => index < 10)
      // .filter((v, index) => index < 120)
      .filter((v, index) => v.Name === 'abb')
      .map((comp, index) => delayApiCall(comp, 4000*index, index)
        .then(response => {
          if(index % 10 === 0) {
            console.log(index, Math.round(100 * index/companyNames.length) + '%', comp.CountryUrlName);
          }
          return response;
        }))))
  // .then(consolePipe)
  .then(allResponse => allResponse
    .map((historicalData, index) => reduceCompanyData(historicalData, index, companyNames, prices)))
  // .then(response => consolePipe(response))
  .then((response) => writeJsonFile('src/js/data/earnings.json', response, { indent: null }))
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
