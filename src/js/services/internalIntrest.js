export default function iterateIntreset(values, nowValue) {

  console.log('values', values.toJS());

  var iterator = 0;
  var iteratorMax = 100;

  var sum = 1000;
  var rantaHigh = 10;
  var rantaLow  = -0.99;
  var intreset = 0;

  do {
    intreset = rantaLow + (rantaHigh-rantaLow)/2;
    sum = values.reduce((sum, item) => {
      // console.log('item', item);
      return sum + item.value * (1 + intreset) ** item.yearFrac;
    }, nowValue);

    if (sum>0){
      rantaLow = intreset;
    } else {
      rantaHigh = intreset;
    }

    ++iterator;
  } while( Math.abs(sum)>1 && iterator<iteratorMax );

  console.log('iterator', iterator, 'intrest', intreset);

  return intreset;
}

