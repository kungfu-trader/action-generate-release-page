/* eslint-disable no-restricted-globals */
const lib = (exports.lib = require("./lib.js"));
const core = require("@actions/core");
const github = require("@actions/github");

const main = function () {
  const context = github.context;
  const argv = {
    token: core.getInput("token"),
    product: core.getInput("product"),
    releasePath: core.getInput("release-path"),
    lowerEdge: core.getInput("lower-edge"),
    upperEdge: core.getInput("upper-edge"),
    apiKey: core.getInput("apiKey"),
    baseId: core.getInput("base-id"),
    baseUrl: core.getInput("release-url"),
  };
  lib.generate(argv);
};

if (process.env.GITHUB_ACTION) {
  main();
}
