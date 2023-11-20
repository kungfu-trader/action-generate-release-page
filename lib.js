/* eslint-disable no-restricted-globals */
const fs = require("fs");
const path = require("path");
const mustache = require("mustache");
const axios = require("axios");
const sortBy = require("lodash.sortby");
const { spawnSync } = require("child_process");
const { getTableRecords } = require("./airtable");

const spawnOpts = {
  shell: true,
  stdio: "pipe",
  encoding: "utf-8",
  windowsHide: true,
};

exports.generate = async (argv) => {
  console.log(`Generating release page for ${argv.product}`);
  const template = fs.readFileSync(
    path.join(__dirname, "templates", "release.html"),
    "utf-8"
  );
  const { stables, prereleases } = await getVersionList(argv);
  const output = mustache.render(template, {
    title: `${argv.product}`,
    product: argv.product,
    description:
      "Kungfu Trader is a trading platform for quantitative trading.",
    kungfuTraderUrl: `${argv.baseUrl}/${argv.product}/release-stable.html`,
    artifactKungfuUrl: `${argv.baseUrl}/artifact-kungfu/release-stable.html`,
    stables,
    prereleases,
  });
  const outputDir = path.join(
    "dist",
    argv.product,
    "build",
    "stage",
    argv.releasePath
  );
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  console.log(`Writing release page to ${outputDir}`);
  const fileName = path.join(outputDir, "index.html");
  console.log(`Writing release page to ${fileName}`);
  fs.writeFileSync(fileName, output);
};

function awsCall(args, opts = spawnOpts) {
  console.log(`$ aws ${args.join(" ")}`);
  const result = spawnSync("aws", args, opts);
  if (result.status !== 0) {
    throw new Error(`Failed to call aws with status ${result.status}`);
  }
  return result;
}

const getVersionList = async (argv) => {
  const metadata = await getMetaData(argv);
  const versions = getListFromS3(`s3://kungfu-releases/${argv.product}/v`)
    .map((v) => getListFromS3(`s3://kungfu-releases/${argv.product}/${v}/`))
    .flat();
  const lowerEdgeWeight = argv.lowerEdge
    ? getWeightingNumber(argv.lowerEdge, versions.length)
    : null;
  const upperEdgeWeight = argv.upperEdge
    ? getWeightingNumber(argv.upperEdge, versions.length)
    : null;
  const { stables, prereleases } = versions.reduce(
    (acc, version) => {
      const meta = metadata.find((v) => v.version === version) || {};
      const weight = getWeightingNumber(version, versions.length);
      const isMatch = checkIsMatch(weight, lowerEdgeWeight, upperEdgeWeight);
      isMatch &&
        acc[version.includes("alpha") ? "prereleases" : "stables"].push({
          ...meta,
          version,
          url: `${argv.baseUrl}/${argv.product}/${getCurrentVersion(
            version
          )}/index.html`,
          weight: getWeightingNumber(version, versions.length),
        });
      return acc;
    },
    { stables: [], prereleases: [] }
  );
  return {
    stables: sortBy(stables, "weight"),
    prereleases: sortBy(prereleases, "weight"),
  };
};

const getMetaData = async (argv) => {
  if (!argv.apiKey || !argv.baseId) {
    return;
  }
  const res = await getTableRecords({
    apiKey: argv.apiKey,
    baseId: argv.baseId,
    tableId: "pr dependencies",
    params: {
      filterByFormula: `AND(
          {name} = "${argv.product}"
        )`,
    },
  });
  if (Array.isArray(res)) {
    return res.map((v) => {
      const version = `v${v.version}`;
      const coreVersion = JSON.parse(v.dependencies)[
        "@kungfu-trader/kungfu-core"
      ];
      return {
        version,
        coreVersion: coreVersion ? `v${coreVersion}` : null,
        coreUrl: coreVersion
          ? `${argv.baseUrl}/artifact-kungfu/${getCurrentVersion(
              `v${coreVersion}`
            )}/index.html`
          : null,
      };
    });
  }
};

const getListFromS3 = (source) => {
  const result = awsCall(["s3", "ls", source]);
  return result.stdout
    .split("\n")
    .map((v) => v.replace("PRE", "").slice(0, -1).trim())
    .filter((v) => !!v);
};

const getCurrentVersion = (version) => {
  return `${version.split(".")[0]}/${version}`;
};

const getWeightingNumber = (name, len) => {
  const [v1, v2, v3, v4 = len] = name
    .replace("v", "")
    .replace("-alpha", "")
    .split(".");
  return (
    (v1 * len * 1000000 + v2 * len * 10000 + v3 * len * 100 + +v4 + 1) * -1
  );
};

const checkIsMatch = (weight, lowerEdgeWeight, upperEdgeWeight) => {
  if (lowerEdgeWeight && upperEdgeWeight) {
    return weight <= lowerEdgeWeight && weight >= upperEdgeWeight;
  }
  if (lowerEdgeWeight) {
    return weight <= lowerEdgeWeight;
  }
  if (upperEdgeWeight) {
    return weight >= upperEdgeWeight;
  }
  return true;
};
