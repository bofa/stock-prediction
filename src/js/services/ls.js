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

  return [mx - slope*mt + N*slope, slope, Math.sqrt(variance)];
}
