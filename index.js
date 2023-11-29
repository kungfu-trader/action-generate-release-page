/* eslint-disable no-restricted-globals */
const lib = (exports.lib = require("./lib.js"));
const core = require("@actions/core");
// const github = require("@actions/github");

const main = function () {
  const argv = {
    token: core.getInput("token"),
    apiKey: core.getInput("apiKey"),
    product: core.getInput("product"),
    releasePath: core.getInput("release-path"),
    baseUrl: core.getInput("release-url"),
    lowerEdge: core.getInput("lower-edge"),
    upperEdge: core.getInput("upper-edge"),
    baseId: core.getInput("base-id"),
    bucketRelease: core.getInput("bucket-release"),
    exclude: core.getInput("exclude"),
    description: core.getInput("description"),
  };
  lib.generate(argv);
};

if (process.env.GITHUB_ACTION) {
  main();
}
