import axios from 'axios';

const host = 'https://query.yahooapis.com/v1/public';

export function quote(ticker) {
  return axios({
    method:'get',
    url: host + `/yql?q=select%20*%20from%20csv%20where%20url%3D%27http%3A%2F%2Fdownload.finance.yahoo.com%2Fd%2Fquotes.csv%3Fs%3D${ticker}%26f%3Dsl1d1t1c1ohgv%26e%3D.csv%27%20and%20columns%3D%27symbol%2Cprice%2Cdate%2Ctime%2Cchange%2Ccol1%2Chigh%2Clow%2Ccol2%27&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`,
    responseType:'stream'
  })
 .then(response => response.data.query.results.row.price);
}
