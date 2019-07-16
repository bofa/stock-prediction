import axios from 'axios';
import writeJsonFile from 'write-json-file';
// import { cookie as Cookie } from './keys';

const Cookie = '__cfduid=dbbb5361ccf55883dd7041b296e2293a71524980551; __RequestVerificationToken=SWX1pu0kCw8z20dkxxay7bpYFYEgaB-VQmIixnew5NpwsXEdyArJvj2NsGCsf-Wo3Ueo170-RYrzTnctQjKWt6SSWeY1; ai_user=jQ5xd|2018-04-29T05:42:47.176Z; __utmc=182498229; ARRAffinity=52979c8817f876661f9a60af50d969ba9334aea61b51a3eef5203c0e2c4d3c13; ASP.NET_SessionId=lr5cuhewmwlivdpwfml0rizs; __utmz=182498229.1541524392.71.23.utmcsr=localhost:3000|utmccn=(referral)|utmcmd=referral|utmcct=/stock-prediction/company/uponor; borsdata=8D800F42F5BE478BC03DF70F97FEED4C57C7C3CF02A5D85C3F8D4942C6BB19133C4320DAD233788E3058BCC1B68659A624DA925DB5224CFC07328E57FF1216A52C642B1D2DCD7DB94A4784173D7519C80FE1C86C; __utma=182498229.1525257252.1524980568.1541927616.1543045449.74; __utmt=1; __utmb=182498229.3.10.1543045449; ai_session=8r9lL|1543045449909|1543046503934';

const body = {
  "filter": {
    "KpiFilter": [
      // {
      //   "CategoryId": 11,
      //   "AdditionalId": 1001,
      //   "KpiId": 1,
      //   "CalculationType": 3,
      //   "Calculation": 0,
      //   "CalcTime": 0
      // },{
      //   "CategoryId": 11,
      //   "AdditionalId": 1001,
      //   "KpiId": 2,
      //   "CalculationType": 3,
      //   "Calculation": 0,
      //   "CalcTime": 0
      // }, {
      //   "CategoryId": 11,
      //   "AdditionalId": 1001,
      //   "KpiId": 12,
      //   "CalculationType": 3,
      //   "Calculation": 0,
      //   "CalcTime": 0
      // }, {
      //   "CategoryId": 9,
      //   "AdditionalId": 151,
      //   "KpiId": 151,
      //   "CalculationType": 2,
      //   "Calculation": 20, "CalcTime": 1
      // },{
      //   "CategoryId": 0,
      //   "AdditionalId": 1,
      //   "KpiId": 1,
      //   "CalculationType": 2,
      //   "Calculation": 1,
      //   "CalcTime": 0
      // }, {
      //   "CategoryId": 0,
      //   "AdditionalId": 2,
      //   "KpiId": 2,
      //   "CalculationType": 2,
      //   "Calculation": 1,
      //   "CalcTime": 0
      // }, {
      //   "CategoryId": 0,
      //   "AdditionalId": 3,
      //   "KpiId": 3,
      //   "CalculationType": 2,
      //   "Calculation": 1,
      //   "CalcTime": 0
      // },
      {
        "CategoryId": 2,
        "AdditionalId": 50,
        "KpiId": 50,
        "CalculationType": 2,
        "Calculation": 1,
        "CalcTime": 0,
        "OrderBy": 1
      }],
      "OnlyStocks": true,
      "OnlyIndexes": false,
      "OnlyPref": false,
      "OnlyFinansSector": false,
      "SelectedCountries": ["1"],
      "SelectedMarkets": [],
      "SelectedSectors": [],
      "SelectedBransches": [],
      "Page": 0,
      "RowsInPage": 10000
    }
  };

axios.post('https://borsdata.se/screener/GetCompaniesForScreener', body, { headers: { Cookie }})
  .then(response => response.data.data.map(c => ({
    name: c.Name,
    marketCap: c.KpisValues[0].NumValue
  })))
  .then(response => writeJsonFile('scrape/sprx-raw.json', response));
