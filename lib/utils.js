var fs = require("fs");
var path = require("path");

exports.asyncForEach = async function(arr, fn) {
  await Promise.all(arr.map(fn));
};

const walk = async function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};
exports.walk = walk;
exports.isDirectory = (path, callback) =>
  fs.stat(path, (err, stats) => {
    if (err) throw err;
    callback(stats.isDirectory());
  });
/**
 * Checks if the extension of the specified file path is .js or .jsx
 */
exports.verifyExtension = path => {
  return ["js", "jsx"].includes(
    path.includes(".") &&
      path
        .split(".")
        .slice(-1)
        .pop()
  );
};
console.log(exports.verifyExtension("string/deis/call.js"));
