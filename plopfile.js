const glob = require("glob");
const generators = glob.sync('./.plop/generator-*.js').map(file => require(file));

module.exports = plop => generators.map(fn => fn(plop));
