const fs = require("fs");
const { API } = require("./config.json");
const fetch = require("node-fetch");

const allFile = __dirname + "/blacklist/all.json";
const domainFile = __dirname + "/blacklist/domains.json";
const addressFile = __dirname + "/blacklist/address.json";

async function getRecentScamActivity(limit = 100) {
  const req = await fetch(
    `${API}/scamActivity?sort=-id&limit=${limit}&fields=address,host`
  );
  const list = await req.json();
  let allAddressList = [];
  let allSites = [];
  list.map((_) => {
    const list = _.address.split(",");
    allAddressList = allAddressList.concat(list.filter((c) => c && c != ""));
    if (_.host) allSites.push(_.host);
  });
  return {
    address: Array.from(new Set(allAddressList)),
    domains: Array.from(new Set(allSites)),
  };
}

async function doGenerate(lastId = 1) {
  let firstRun = false;
  let cacheData = null;
  if (fs.existsSync(allFile)) {
    cacheData = JSON.parse(fs.readFileSync(allFile, "utf-8"));
  } else {
    firstRun = true;
  }

  const limit = firstRun ? 2000 : 200;
  const allList = await getRecentScamActivity(limit);

  const newDomains = [];
  const newAddress = [];
  if (!firstRun) {
    allList.domains.forEach((domain) => {
      if (cacheData.domains.indexOf(domain) === -1) {
        newDomains.push(domain);
      }
    });
    allList.address.forEach((address) => {
      if (cacheData.address.indexOf(address) === -1) {
        newAddress.push(address);
      }
    });

    if (newAddress.length) {
      allList.address = [].concat(allList.address, newAddress);
    }
    if (newDomains.length) {
      allList.domains = [].concat(allList.domains, newDomains);
    }
  }

  fs.writeFileSync(allFile, JSON.stringify(allList, null, 2));
  fs.writeFileSync(addressFile, JSON.stringify(allList.address, null, 2));
  fs.writeFileSync(domainFile, JSON.stringify(allList.domains, null, 2));
  console.log("found", newAddress.length, newAddress.length);
}

doGenerate();
