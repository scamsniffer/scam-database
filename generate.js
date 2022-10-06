const fs = require("fs");
const { API } = require("./config.json");
const fetch = require("node-fetch");

const allFile = __dirname + "/blacklist/all.json";
const domainFile = __dirname + "/blacklist/domains.json";
const addressFile = __dirname + "/blacklist/address.json";
const combinedFile = __dirname + "/blacklist/combined.json";

async function getRecentScamActivity(limit = 100) {
  const req = await fetch(
    `${API}/scamActivity?sort=-id&limit=${limit}&fields=address,host,action`
  );
  const list = await req.json();
  let allAddressList = [];
  let allSites = [];
  let combined = {};
  list.map((_) => {
    const actions = _.action.split(',');
    if (actions.indexOf('maliciousCodeFeature') > -1 && actions.length === 1) {
      console.log('skip')
      return;
    }
    const list = _.address.split(",").map((_) => _.toLowerCase()).filter((c) => c && c != "");
    allAddressList = allAddressList.concat(
      list
    );
    if (_.host) allSites.push(_.host);

    combined[_.host] = combined[_.host] || [];

    list.forEach(address => {
      if (combined[_.host].indexOf(address) === -1) {
        combined[_.host].push(address);
      }
    })
  });
  return {
    combined,
    address: Array.from(new Set(allAddressList)),
    domains: Array.from(new Set(allSites)),
  };
}

async function doGenerate(lastId = 1) {
  let firstRun = false;
  let cacheData = {
    domains: [],
    address: []
  };
  if (fs.existsSync(allFile)) {
    console.log('load')
    cacheData = JSON.parse(fs.readFileSync(allFile, "utf-8"));
  } else {
    firstRun = true;
  }

  cacheData.combined = cacheData.combined || {};

  const limit = firstRun ? 8000 : 200;
  const allList = await getRecentScamActivity(limit);

  const newDomains = [];
  const newAddress = [];

  console.log("firstRun", firstRun, allFile);
  allList.domains.forEach((domain) => {
    if (cacheData.domains.indexOf(domain) === -1) {
      newDomains.push(domain);
    }
  });

  for(const host in allList.combined) {
    const existList = cacheData.combined[host] || [];
    const combinedAddress = allList.combined[host] || [];
    combinedAddress.forEach((address) => {
      if (existList.indexOf(address) === -1) {
        existList.push(address);
      }
    });

    allList.combined[host] = existList;
  }

  allList.address.forEach((address) => {
    if (cacheData.address.indexOf(address) === -1) {
      newAddress.push(address);
    }
  });

  allList.address = [].concat(newAddress, cacheData.address);
  allList.domains = [].concat(newDomains, cacheData.domains);

  fs.writeFileSync(allFile, JSON.stringify(allList, null, 2));
  fs.writeFileSync(addressFile, JSON.stringify(allList.address, null, 2));
  fs.writeFileSync(domainFile, JSON.stringify(allList.domains, null, 2));
  fs.writeFileSync(combinedFile, JSON.stringify(allList.combined, null, 2));
  
  console.log("found", newAddress.length, newAddress.length, cacheData.domains.length, cacheData.address.length);
}

doGenerate();
