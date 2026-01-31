// const devData = require('../data/development-data/index.js');
// const seed = require('./seed.js');
// const db = require('../connection.js');

// const runSeed = () => {
//   return seed(devData).then(() => db.end());
// };

// runSeed();

const seed = require("./seed.js");
const db = require("../connection.js");

const devData = require("../data/development-data");
const testData = require("../data/test-data");

const ENV = process.env.NODE_ENV || "development";
const data = ENV === "test" ? testData : devData;

const runSeed = () => {
  return seed(data).then(() => db.end());
};

runSeed();
