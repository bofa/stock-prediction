/**
 *
 * @param {Array.<Object>} values - [{value: 1000, yearFrace: 1.8}]
 * @param {number} nowValue - Current value
 * @return {number} intrest
 */
export default function iterateIntreset(values, nowValue) {
  var iterator = 0;
  var iteratorMax = 100;

  var sum;
  var rantaHigh = 10;
  var rantaLow  = -10;
  var intreset = 0;

  do {
    intreset = rantaLow + (rantaHigh-rantaLow)/2;
    sum = values.reduce(
      (sum, item) => sum + item.value * (1 + intreset) ** item.yearFrac
      , nowValue);

    if (sum > 0){
      rantaLow = intreset;
    } else {
      rantaHigh = intreset;
    }

    ++iterator;
  } while(Math.abs(sum) > 1 && iterator < iteratorMax);

  return intreset;
}
