import axios from 'axios';
import { fromJS, List, Map } from 'immutable';
import writeJsonFile from 'write-json-file';
import { leastSquarceEstimate } from '../src/js/services/ls';
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retries: 3 });

function toNumber (string) {
  return Number(string
    .replace(',', '.')
    .replace(/\s/g, ''));
}

const Cookie = '__cfduid=d4d0c41ce0318450547805d4ef84280051519071087; __utmc=182498229; __utmz=182498229.1519071091.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); ai_user=YkDvK|2018-02-19T20:11:31.354Z; __RequestVerificationToken=BPneJ869zvhQISh8X2J4tRMDLxBu4GUrqrt6NEVu6seNRKudL5nDlcIs5R3EpgCVMY481DJRMMl-MVuP9sKZFD7slUQ1; borsdata=5386C4E0BD608D73120A416107C060F6DE0C5633793E70871CDD1AE73B7D935329F30EF3828C8CB6E69C0B1249BBE729AC28D256C94C452C9676744A9076CF0F966F388C87753FD4733E43A0799D2C2BF1B61D16; ARRAffinity=52979c8817f876661f9a60af50d969ba9334aea61b51a3eef5203c0e2c4d3c13; __utma=182498229.396011437.1519071091.1519147806.1519323507.3; __utmt=1; __utmb=182498229.2.10.1519323507; ai_session=BDJTh|1519323507454|1519323516755.675';

function formatAnalysisReport(response) {
  return fromJS(response.data).update('Rows', rows => rows.map(row => row.update('Data', data => data.map(toNumber))));
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

function delayApiCall(comp, delay = 20000) {
  const call = () => Promise.all([
    axios.get(`https://borsdata.se/api/AnalysisReport?analysisTime=0&analysisType=1&companyUrl=${comp.CountryUrlName}`)
      .then(r => r.data)
      .catch(() => consolePipe('Error1!' + comp.CountryUrlName, [])),
    axios.get(`https://borsdata.se/api/AnalysisHighChartSeries?analysisTime=0&companyUrl=${comp.CountryUrlName}&kpiId=63`, {
        headers: { Cookie }})
      .then(r => r.data)
      .catch(error => consolePipe('Error2!' + error + comp.CountryUrlName, {})),
    axios.get(`https://borsdata.se/api/AnalysisHighChartSeries?analysisTime=0&companyUrl=${comp.CountryUrlName}&kpiId=73`,{
        headers: { Cookie }})
      .then(r => r.data)
      .catch(error => consolePipe('Error3!' + error + comp.CountryUrlName, {})),
    axios.get(`https://borsdata.se/api/highchart?companyUrlName=${comp.CountryUrlName}`)
      .then(r => r.data)
      .catch(() => {}),
    axios.get(`https://borsdata.se/api/AnalysisHighChartSeries?analysisTime=0&companyUrl=${comp.CountryUrlName}&kpiId=61`,{
        headers: { Cookie }})
      .then(r => r.data)
      .catch(error => consolePipe('Error4!' + error + comp.CountryUrlName, {})),
  ]);

  return new Promise((resolve, reject) => {
    setTimeout(() => call()
    .then(
      response => resolve(response),
      reason => reject(reason)),
      delay);
  });
}

axios.post('https://borsdata.se/complist/GetCompanies', {"filter":{"KpiFilter":[{"CategoryId":9,"AdditionalId":151,"KpiId":151,"CalculationType":2,"Calculation":20,"CalcTime":1}]}})
  .then(response => response.data.data)
  .then(companyNames => Promise.all(companyNames
    // .filter((v, index) => index < 10)
    // .filter((v, index) => index < 120)
    // .filter((v, index) => v.Name === 'Amazon')
    .map((comp, index) => delayApiCall(comp, 4000*index, index)
      .then(response => {
        if(index % 10 === 0) {
          console.log(index, Math.round(100 * index/companyNames.length) + '%', comp.CountryUrlName);
        }
        return {comp, quaterly: response};
      }))))
  .then(response => writeJsonFile('scrape/quaterly.json', response))
  .then(() => console.log('done quaterly'));
