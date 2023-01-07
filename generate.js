const fs = require("fs");
const { API } = require("./config.json");
const fetch = require("node-fetch");
const moment = require("moment");

const allFile = __dirname + "/blacklist/all.json";
const domainFile = __dirname + "/blacklist/domains.json";
const addressFile = __dirname + "/blacklist/address.json";
const combinedFile = __dirname + "/blacklist/combined.json";
const archiveDir = __dirname + "/blacklist/archive/";

async function getRecentScamActivity(limit = 100) {
  const req = await fetch(
    `${API}/scamActivity?sort=-id&limit=${limit}&fields=address,host,action,time`
  );
  const list = await req.json();
  let allAddressList = [];
  let allSites = [];
  let combined = {};
  let indexByDay = {};
  list.map((_) => {
    const actions = _.action.split(',');
    if (actions.indexOf('maliciousCodeFeature') > -1 && actions.length === 1) {
      // console.log('skip')
      return;
    }
    if (actions.indexOf('transferETH') > -1 && actions.length === 1) {
      return;
    }
    const list = _.address.split(",").map((_) => _.toLowerCase()).filter((c) => c && c != "");
    allAddressList = allAddressList.concat(
      list
    );
    if (_.host) allSites.push(_.host);

    const day = moment(_.time).format("YYYY-MM-DD");

    indexByDay[day] = indexByDay[day] || {
      domain: [],
      address:[]
    };

    indexByDay[day].domain.push(_.host);
    combined[_.host] = combined[_.host] || [];

    list.forEach(address => {
      indexByDay[day].address.push(address);
      if (combined[_.host].indexOf(address) === -1) {
        combined[_.host].push(address);
      }
    })
  });
  return {
    days: Object.keys(indexByDay).map(day => {
      const data = indexByDay[day];
      return {
        day,
        domains: Array.from(new Set(data.domain)),
        address: Array.from(new Set(data.address)),
      }
    }),
    // newCombined: combined,
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
  if (fs.existsSync(allFile) && fs.existsSync(archiveDir)) {
    console.log('load')
    cacheData = JSON.parse(fs.readFileSync(allFile, "utf-8"));
  } else {
    firstRun = true;
  }

  if (!fs.existsSync(archiveDir)) {
    fs.mkdirSync(archiveDir);
  }

  cacheData.combined = cacheData.combined || {};

  const limit = firstRun ? 100000 : 2000;
  const allList = await getRecentScamActivity(limit);

  allList.combined = firstRun ? {} : cacheData.combined;

  const newDomains = [];
  const newAddress = [];

  // console.log("firstRun", firstRun, allFile);
  console.log(allList.days[allList.days.length - 1], firstRun)
  return 

  allList.domains.forEach((domain) => {
    if (cacheData.domains.indexOf(domain) === -1) {
      newDomains.push(domain);
    }
  });

  // for(const host in allList.newCombined) {
  //   const existList = cacheData.combined[host] || [];
  //   const combinedAddress = allList.newCombined[host] || [];
  //   combinedAddress.forEach((address) => {
  //     if (existList.indexOf(address) === -1) {
  //       existList.push(address);
  //     }
  //   });

  //   if (existList.length) {
  //     // allList.combined[host] = existList;
  //   }
  // }

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
  // fs.writeFileSync(combinedFile, JSON.stringify(allList.combined, null, 2));

  console.log("found", newAddress.length, newAddress.length, cacheData.domains.length, cacheData.address.length);
}

doGenerate();
