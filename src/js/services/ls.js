/**
 * http://mathworld.wolfram.com/LeastSquaresFitting.html
 */
export function leastSquarceEstimate(values) {
  // values = removeOutliers(values);
  const N = values.length;

  var mt = values.reduce((sum, item, n) => sum + n, 0) / N;
  var mx = values.reduce((sum, item, n) => sum + item, 0) / N;

  var sstt = values.reduce((sum, item, n) => sum + (n - mt) * (n - mt), 0);
  var ssxx = values.reduce((sum, item, n) => sum + (item - mx) * (item - mx), 0);
  var sstx = values.reduce((cov, item, n) => cov + n * item, 0) - N * mt * mx;

  var slope = sstx / sstt;
  var variance = (ssxx - slope * sstx) / (N - 2);

  return [mx - slope*mt + (N-1)*slope, slope, Math.sqrt(variance)];
}

export default function earningsEstimate(company, projectionTime) {
  // console.log('company', company);

  const { dividend, earnings } = company;

  const avgDividendRatio = dividend
    .map((d, i) => d.yield / earnings[i].yield)
    .filter(dividendRatio => dividendRatio > 0 && dividendRatio < 2)
    .reduce((out, ratio, i, array) => out + ratio/array.length, 0);

  const [bias, slop, cov] = leastSquarceEstimate(earnings
    .map(spark => spark.yield)
    .filter(value => value !== 0)
  );

  return [avgDividendRatio*(bias + projectionTime*slop/2), [bias, slop, cov]];
}
