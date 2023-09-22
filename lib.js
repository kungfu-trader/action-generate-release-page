/* eslint-disable no-restricted-globals */
const github = require('@actions/github');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const mustache = require("mustache");

const baseUrl = "https://releases.kungfu-trader.com";

exports.generate = (argv) => {
  const template = fs.readFileSync(
    path.join(__dirname, "templates", "release.html"),
    "utf-8"
  );
  const output = mustache.render(template, {
    kungfuTraderUrl: `${baseUrl}/${argv.product}/release-stable.html`,
    artifactKungfuUrl: `${baseUrl}/artifact-kungfu/release-stable.html`,
  });
  const outputDir = path.join(process.cwd(), "build", "stage", argv.releasePath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const fileName = path.join(outputDir, "index.html");
  fs.writeFileSync(fileName, output);
};
