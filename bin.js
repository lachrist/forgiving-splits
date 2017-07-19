
var Minimist = require("minimist");
var Explore = require("./explore.js");
var Readline = require("readline");
var Fs = require("fs");
var Util = require("./util.js");

var options = Minimist(process.argv.slice(2));
if ("splits" in options && "alias" in options && "min" in options && "max" in options) {
  Explore(options, function (error, lapss) {
    if (error) {
      process.stderr.write(error.message+"\n");
      process.exit(1);
    }
    process.stdout.write("Got "+lapss.length+" solutions, here are the 10 best ones:\n");
    lapss.slice(0, 10).forEach(function (laps, index) {
      var sum = 0;
      process.stdout.write("\n#"+index+"\n");
      process.stdout.write("Length:    "+laps.length+"\n");
      process.stdout.write("Mean:      "+Util.printms(Util.mean(laps))+"\n");
      process.stdout.write("Deviation: "+Util.printms(Util.deviation(laps))+"\n");
      process.stdout.write("Min:       "+Util.printms(Math.min.apply(null, laps))+"\n");
      process.stdout.write("Max:       "+Util.printms(Math.max.apply(null, laps))+"\n");
      process.stdout.write("Laps:      "+laps.map(Util.printms).join("\t")+"\n");
      process.stdout.write("Splits:    "+laps.map((lap) => Util.printms(sum += lap)).join("\t")+"\n");
    });
  });
} else if ("splits" in options) {
  Fs.access(options.splits, function (error) {
    if (error && error.code !== "ENOENT") {
      process.stderr.write("Cannot access splits file at "+options.splits+": "+error.code);
      process.exit(1);
    }
    var stream = Fs.createWriteStream(options.splits, {flags:"a"});
    var readline = Readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    function loop (alias) {
      stream.write("\n"+(new Date()).getTime()+" "+alias);
      readline.question("> ", loop);
    }
    if (!error)
      return readline.question("> ", loop);
    readline.question("Ready?", function () {
      stream.write((new Date()).getTime().toString());
      readline.question("> ", loop);
    });
  });
} else {
  process.stderr.write([
    "Usage: node forgiving-splits --splits path/to/splits.txt",
    "       node forgiving-splits --splits path/to/splits.txt --alias <string> --min <msec> --max <msec>"
  ].join("\n")+"\n");
  process.exit(1);
}
