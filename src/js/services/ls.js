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

  if(N < 6) {
    return [mx, 0, Math.sqrt(variance)];
  }

  return [mx - slope*mt + (N-1)*slope, slope, Math.sqrt(ssxx), sstx * sstx / sstt / ssxx];
}

export function earningsEstimate(company, projectionTime, intrest=0) {
  const { earningsLs, price, netBrowing } = company.toJS();

  const [bias, slop, cov] = earningsLs;
  return (bias + projectionTime*slop/2 - netBrowing*intrest) / price;
}

export function dividendEstimate(company, projectionTime, intrest) {
  const { avgDividendRatio } = company.toJS();
  const dividendRatio = Math.min(avgDividendRatio, 0.8);

  return dividendRatio * earningsEstimate(company, projectionTime, intrest);
}

export function yearsToPayOff(company) {
  const { earningsLs, avgDividendRatio, price } = company.toJS();
  const dividendRatio = Math.min(avgDividendRatio, 0.8);

  const [bias, slop, cov] = earningsLs;
  return price / dividendRatio / (bias + slop/2);
}

export function getProjection(company, projectionTime) {
  const { earningsLs, avgDividendRatio } = company.toJS();
  const dividendRatio = Math.min(avgDividendRatio, 0.8);

  const [bias, slop, cov] = earningsLs;
  return Array.from(Array(projectionTime), (e,i) => ({
    year: 'Not Set',
    revenue: 0,
    earnings: bias + (i+1)*slop,
    dividend: dividendRatio * (bias + (i+1)*slop)
  }));
}
