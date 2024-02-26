/* eslint-disable no-restricted-globals */
const fs = require("fs");
const path = require("path");
const mustache = require("mustache");
const axios = require("axios");
const cheerio = require("cheerio");
const marked = require("marked");
const sortBy = require("lodash.sortby");
const { getTableRecords } = require("./airtable");
const { Octokit } = require("@octokit/rest");
const getMenu = require("./templates/menu");

exports.generate = async (argv) => {
  console.log(`Generating release page for ${argv.product}`);
  const template = fs.readFileSync(
    path.join(__dirname, "./templates/release.html"),
    "utf-8"
  );
  const meta = getMenu(argv.product);
  const list = await getVersionList({ ...argv, ...meta });
  const { readme = "" } = await getRepoInfo(argv);
  if (!list) {
    return;
  }
  const output = mustache.render(template, {
    baseUrl: argv.baseUrl,
    product: argv.product,
    productName: argv.productName,
    stables: JSON.stringify(list.stables),
    prereleases: JSON.stringify(list.prereleases),
    readme,
    title: argv.title || argv.product,
    ...meta,
  });
  const outputDir = getOutputDir(argv);
  console.log(`Writing release page to ${outputDir}`);
  const fileName = path.join(outputDir, "index.html");
  console.log(`Writing release page to ${fileName}`);
  fs.writeFileSync(fileName, output);
  // const latest = sortBy(list.stables, "weight")[1];
  // if (latest) {
  //   fs.writeFileSync(
  //     path.join(outputDir, "meta.json"),
  //     JSON.stringify({
  //       latest: await getDownloadList(latest),
  //     })
  //   );
  // }
};

const getDownloadList = async (latest) => {
  return axios
    .get(latest.url)
    .then((res) => {
      const urls = [];
      const $ = cheerio.load(res.data);
      $("tbody td a").each((_, e) => urls.push($(e).attr("href")));
      return {
        version: latest.version,
        win_exe: urls.find((v) => v.includes("win-") && v.endsWith(".exe")),
        win_zip: urls.find((v) => v.includes("win-") && v.endsWith(".zip")),
        mac_dmg: urls.find((v) => v.includes("mac-") && v.endsWith(".dmg")),
        mac_zip: urls.find((v) => v.includes("mac-") && v.endsWith(".zip")),
        linux_zip: urls.find((v) => v.includes("linux-") && v.endsWith(".zip")),
        linux_appimage: urls.find(
          (v) => v.includes("linux-") && v.endsWith(".AppImage")
        ),
        linux_rpm: urls.find((v) => v.includes("linux-") && v.endsWith(".rpm")),
      };
    })
    .catch(() => "");
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
    stables: sortBy(stables, (v) => -v.timestamp),
    prereleases: sortBy(prereleases, (v) => -v.timestamp),
  };
};

const createVersionItem = (argv, version, meta, len) => {
  const semverList = version.split(".");
  const coreSemverList = meta.coreVersion ? meta.coreVersion.split(".") : null;
  return {
    ...meta,
    version,
    url: `${argv.baseUrl}/${
      argv.useArtifactName ? argv.product + "/" : ""
    }${getCurrentVersion(version)}/index.html`,
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
    return res.reduce(
      (acc, v) => {
        const version = `v${v.version}`;
        const coreVersion = JSON.parse(v.dependencies)[
          "@kungfu-trader/kungfu-core"
        ];

        if (!acc.versions.has(version)) {
          acc.result.push({
            version,
            name: argv.product,
            repo: v.repo,
            timestamp: v.timestamp,
            coreVersion: coreVersion ? `v${coreVersion}` : null,
            coreUrl: coreVersion
              ? `https://releases.libkungfu.cc/${getCurrentVersion(
                  `v${coreVersion}`
                )}/index.html`
              : null,
          });
          acc.versions.add(version);
        }
        return acc;
      },
      { result: [], versions: new Set() }
    ).result;
  }
};

const getRepoInfo = async (argv) => {
  const octokit = new Octokit({
    auth: argv.token,
  });
  const readme = await octokit
    .request("GET /repos/{owner}/{repo}/contents/{path}", {
      owner: "kungfu-trader",
      repo: argv.repo,
      path: "README.md",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    })
    .then((res) => {
      return marked.parse(
        Buffer.from(res?.data?.content, "base64").toString("utf-8")
      );
    })
    .catch((e) => console.log(e));
  return { readme };
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

const getOutputDir = (argv) => {
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
  return outputDir;
};
