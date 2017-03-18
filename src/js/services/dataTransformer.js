import moment from 'moment';
import { groupBy, each } from 'lodash';

export function transformDataByVolume(stockData) {
  const dataByStockSymbol = groupBy(stockData.data, 'stock');
  let transFormedData = [];
  each(dataByStockSymbol, (stockData, symbol) => {
    var total = 0;
    stockData.forEach((item) => {
      total += item.volume;
    });
    transFormedData.push({
      x: symbol,
      y: total
    });
  });
  return transFormedData;
}

export function transformDataByPriceOverTime(stockData) {
  const dataByStockSymbol = groupBy(stockData.data, 'stock');
  let transFormedData = [];
  each(dataByStockSymbol, (stockData, symbol) => {
    transFormedData.push(
      {
        symbol: symbol,
        data: stockData.map((item) => ({
          x: moment(item.time),
          y: item.price
        })),
        asOfDate: moment(stockData[stockData.length - 1].time)
      }
    );
  });
  return transFormedData;
}

export function transformDataByExchangeVolumeByMinutes(stockData, mins) {
  const dataByStockSymbol = groupBy(stockData.data, 'stock');
  let transFormedData = [];
  each(dataByStockSymbol, (stockData, symbol) => {
    let startTime = stockData[0].time;
    let stockItemData = [];
    var total = 0;
    stockData.forEach((item) => {
      if (moment(item.time) - moment(startTime) < mins * 60 * 1000) {
        total += item.volume;
      } else {
        startTime = item.time;
        stockItemData.push({
          x: moment(item.time),
          y: total
        });
        total = item.volume;
      }
    });
    transFormedData.push(
      {
        symbol: symbol,
        data: stockItemData,
        asOfDate: moment(stockData[stockData.length - 1].time)
      }
    );
  });
  return transFormedData;
}
