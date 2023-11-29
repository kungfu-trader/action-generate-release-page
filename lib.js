/* eslint-disable no-restricted-globals */
const fs = require("fs");
const path = require("path");
const mustache = require("mustache");
const sortBy = require("lodash.sortby");
const groupBy = require("lodash.groupby");
const { getTableRecords } = require("./airtable");

exports.generate = async (argv) => {
  console.log(`Generating release page for ${argv.product}`);
  const template = fs.readFileSync(
    path.join(__dirname, "../templates/release.html"),
    "utf-8"
  );
  const list = await getVersionList(argv);
  if (!list) {
    return;
  }
  const output = mustache.render(template, {
    baseUrl: argv.baseUrl,
    product: argv.product,
    description: argv.description,
    artifactKungfuUrl: `https://releases.kungfu-trader.com/artifact-kungfu/release-stable.html`,
    stables: JSON.stringify(list.stables),
    prereleases: JSON.stringify(list.prereleases),
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

const getVersionList = async (argv) => {
  const metadata = await getMetaData(argv);
  if (!Array.isArray(metadata) || metadata.length === 0) {
    return;
  }
  const len = metadata.length;
  const exclude = (argv.exclude || "")
    .split(",")
    .map((v) => v.trim().replace("v", ""))
    .filter((v) => !!v);
  const lowerEdgeWeight = getWeightingNumber(argv.lowerEdge, len);
  const upperEdgeWeight = getWeightingNumber(argv.upperEdge, len);
  const { stables, prereleases } = metadata.reduce(
    (acc, meta) => {
      const version = meta.version;
      const weight = getWeightingNumber(version, len);
      checkIsMatch(weight, lowerEdgeWeight, upperEdgeWeight) &&
        !exclude.includes(version.slice(1)) &&
        acc[version.includes("alpha") ? "prereleases" : "stables"].push(
          createVersionItem(argv, version, meta, len)
        );
      return acc;
    },
    { stables: [], prereleases: [] }
  );
  return {
    stables: transformTreeData(sortBy(stables, "weight")),
    prereleases: transformTreeData(sortBy(prereleases, "weight")),
  };
};

const transformTreeData = (data, parentId = "parentId") => {
  return Object.entries(groupBy(data, parentId)).map(([_, children]) => {
    const header = children.shift();
    return {
      ...header,
      children,
    };
  });
};

const createVersionItem = (argv, version, meta, len) => {
  const semverList = version.split(".");
  const coreSemverList = meta.coreVersion ? meta.coreVersion.split(".") : null;
  return {
    ...meta,
    version,
    url: `${argv.baseUrl}/${argv.product}/${getCurrentVersion(
      version
    )}/index.html`,
    weight: getWeightingNumber(version, len),
    parentId: `${semverList[0]}.${semverList[1]}`,
    docUrl: coreSemverList
      ? `https://docs.kungfu-trader.com/${coreSemverList[0]}.${coreSemverList[1]}/index.html`
      : null,
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
        name: argv.product,
        repo: v.repo,
        timestamp: v.timestamp,
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

const getCurrentVersion = (version) => {
  return `${version.split(".")[0]}/${version}`;
};

const getWeightingNumber = (name, len) => {
  if (!name) {
    return;
  }
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
