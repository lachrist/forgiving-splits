var Fs = require("fs");
var Util = require("./util.js");

module.exports = function (options, callback) {
  Fs.readFile(options.splits, "utf8", function (error, content) {
    if (error)
      return callback(new Error("Cannot read split file at "+options.splits+": "+error.code));
    var lines = content.split("\n");
    var previous = Number(lines.shift());
    if (!previous)
      return callback(new Error("Format error at initial line (should be a number)"));
    var laps = [];
    var choices = [];
    var length = 0;
    lines.forEach(function (line, index) {
      var parts = /^([0-9]+)\s+(.+)$/.exec(line);
      if (!parts)
        return callback(new Error("Format error at line "+(index+2)));
      if (options.alias.indexOf(parts[2]) === 0) {
        var lap = Number(parts[1]) - previous;
        previous = Number(parts[1]);
        var choice = [];
        var missing = 1;
        while (lap / missing > options.max)
          missing++;
        while (lap / missing >= options.min) {
          choice.push(missing);
          missing++;
        }
        if (choice.length === 0)
          return callback(new Error("Lap at line "+(index+2)+" ("+lap+") is not compatible with interval ["+options.min+","+options.max+"]"));
        laps[length] = lap;
        choices[length] = choice;
        length++;
      }
    });
    function unfold (index) {
      if (index === length)
        return [[]];
      var tails = unfold(index+1);
      return Util.flaten(choices[index].map(function (missing) {
        return tails.map(Util.prepend(Util.repeat(Math.round(laps[index] / missing), missing)));
      }));
    }
    callback(null, unfold(0).sort(Util.bydeviation));
  });
};
