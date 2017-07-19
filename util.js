
function trim (x) {
  if (x === 0)
    return "00";
  else if (x < 10)
    return "0"+x;
  return ""+x;
};
exports.printms = function (ms) {
  var cs = Math.floor(ms/10);
  var m = Math.floor(cs / (100 * 60));
  cs = cs - m * 100 * 60;
  var s = Math.floor(cs / 100);
  cs = cs - s * 100;
  return trim(m)+":"+trim(s)+"."+trim(cs);
};

exports.repeat = function (x, n) {
  var xs = [];
  while (xs.length < n)
    xs.push(x);
  return xs;
};

function sum (x1, x2) {
  return x1 + x2;
};
exports.mean = function (xs) {
  return Math.round(xs.reduce(sum, 0) / xs.length);
};

exports.deviation = function (xs) {
  var m = exports.mean(xs);
  return Math.round(xs.reduce(function (d, x) {
    return d + Math.abs(x - m);
  }, 0) / xs.length);
};

exports.flaten = function (xss) {
  return Array.prototype.concat.apply([], xss);
};

exports.bydeviation = function (xs1, xs2) {
  var d1 = exports.deviation(xs1);
  var d2 = exports.deviation(xs2);
  if (d1 < d2)
    return -1;
  if (d1 > d2)
    return 1;
  return 0;
};

exports.prepend = function (head) {
  return function (tail) {
    return head.concat(tail);
  }
};
