const fs = require("fs");
const { API } = require("./config.json");
const fetch = require("node-fetch");
const moment = require("moment");

const allFile = __dirname + "/blacklist/all.json";
const domainFile = __dirname + "/blacklist/domains.json";
const addressFile = __dirname + "/blacklist/address.json";
const combinedFile = __dirname + "/blacklist/combined.json";
const archiveDir = __dirname + "/blacklist/archive/";

const recallList = [
  "0xfca59cd816ab1ead66534d82bc21e7515ce441cf",
  "0xcb2f43ad2969b746dc2ceb4aa11ed619879b404f",
  "0x357358bafd54c494fcafdc67bbee82776a763583",
  "0x1a2f71468f656e97c2f86541e57189f59951efe7",
  "0x2118fa9369b9a52fb6bf8cf3fd392643d55a53b4",
  "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  "0x4d224452801aced8b2f0aebe155379bb5d594381",
  "0xf497253c2bb7644ebb99e4d9ecc104ae7a79187a",
  "0x6d0de90cdc47047982238fcf69944555d27ecb25",
  "0x10cdcb5a80e888ec9e9154439e86b911f684da7b",
  "0x66dab8a88b7ca020a89f45380cc61692fe62e7ed",
  "0x660e8ac72dd2c4b69fbefd0c89824c7e0a88e8a2",
  "0xb5f3dee204ca76e913bb3129ba0312b9f0f31d82",
  "0xa52fc936d1d4c8251b2bb25d052c8e02873159d2",
  "0x39cf57b4decb8ae3dec0dfca1e2ea2c320416288",
  "0xa08891636ba65305420faa600fdcca2476bb4613",
  "0x3654746ce159ba2fcdf926133d51ecbb85f19288",
  "0x4e0b2a80e158f8d28a2007866ab80b7f63be6076",
  "0xd8a27727da222a1e4751da06a0e42305b32e3870",
  "0xe65cff5e6129387602fb6ebbd98d403a9e8bbd78",
  "0x8eb3fecaaa963c86d9b49004d9f28092f1db3d6c",
  "0x60f80121c31a0d46b5279700f9df786054aa5ee5",
  "0xc3cd69649394bf1a18a7a0c7f90e4d0e4f1a9758",
  "0x95ad01c2180ce793257ad79b4bc6131840a82b39",
  "0x1c5dcbbc0f65027f2e7aef79428323dd6f36361a",
  "0xdac17f958d2ee523a2206206994597c13d831ec7",
  "0x34d85c9cdeb23fa97cb08333b511ac86e1c4e258",
  "0x6b175474e89094c44da98b954eedeac495271d0f",
  "0x4fabb145d64652a948d72533023f6e7a623c7c53",
  "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce",
  "0x514910771af9ca656af840dff83e8264ecf986ca",
  "0xc18360217d8f7ab5e7c516566761ea12ce7f9d72",
  "0x60e4d786628fea6478f785a6d7e704777c86a7c6",
  "0xafba8c6b3875868a90e5055e791213258a9fe7a7",
  "0xc4de189abf94c57f396bd4c52ab13b954febefd8",
  "0x495f947276749ce646f68ac8c248420045cb7b5e",
  "0x8f5be6ee538c8e4b2bcfbf51d824cb9d294d1567",
  "0x08164ee2dda4e8aab7a42ccc13aadd2b296395ae",
  "0x50e27b011738a46cf6fd7e7ab7b9d9db5c7813a6",
  "0x52a043ec29fbb9a1b142b8913a76c0bc592d0849",
  "0x63f421b24cea6765b326753f6d4e558c21ea8f76",
  "0xdcf68c8ebb18df1419c7dff17ed33505faf8a20c",
  "0x1e15c05cbad367f044cbfbafda3d9a1510db5513",
  "0xcc2af1d923de3e8d79fbe650b4cc2859425dd356",
  "0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c",
  "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
  "0x767fe9edc9e0df98e07454847909b5e959d7ca0e",
  "0xbb0e17ef65f82ab018d8edd776e8dd940327b28b",
  "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
  "0x0f5d2fb29fb7d3cfee444a200298f468908cc942",
  "0x3845badade8e6dff049820680d1f14bd3903a5d0",
  "0xe41d2489571d322189246dafa5ebde1f4699f498",
  "0xd26114cd6ee289accf82350c8d8487fedb8a0c07",
  "0x221657776846890989a759ba2973e427dff5c9bb",
  "0x12b6893ce26ea6341919fe289212ef77e51688c8",
  "0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0",
  "0xa2cd3d43c775978a96bdbf12d733d5a1ed94fb18",
  "0x1982b2f5814301d4e9a8b0201555376e62f82428",
  "0x493b733d008e9af91cd3e2efee321f11fc62e60f",
  "0xe5c65ab5b67e6c9c4341a9e835bebd63285c4c8a",
  "0x5b02557c4e9a5d886387e48fe3284668220afb53",
  "0x3256e931236a9cde00901755477d7ba554b5d472",
  "0xdacea04a43eaf3c5a6f171cdfbd9ae7447faf325",
  "0xb0baf2161973f4224488e3945ff2c4499fa99d1c",
  "0x364ce4e74a1ddd42e6f96a5ee69280e7596b0aaf",
  "0x2ece57279d8a7e46fbc17506b1814a7d063df6ca",
  "0x7cffedb2f4fc0cd7c29af95488fd34554539589d",
  "0x0b768874f06686eeb6f00f44a21b19f831751973",
  "0xe8606b3209073e2ef85d244880e232e47db06615",
  "0xfa79abd97c6109970a5c246ef99596235601561d",
  "0xc3b7b75f50a3100d91f8180d5f715975b1c60b67",
  "0x386eb50346726a15bfc27be61d415ea7aa0f6b54",
  "0xfca59cd816ab1ead66534d82bc21e7515ce441cf",
  "0xcb2f43ad2969b746dc2ceb4aa11ed619879b404f",
  "0x3b484b82567a09e2588a13d54d032153f0c0aee0",
  "0xffa55849a7309c7f4fb4de88d804fd546a66c271",
  "0x82dfdb2ec1aa6003ed4acba663403d7c2127ff67",
  "0x242ae3ed3f86c266ecee64ced58143f03d35dc91",
  "0x7152822446982a1accd2dec63b71cf5ed8e36414",
  "0x9da458800bb0fea8e0734ecf4ba9d0e13dde7118",
  "0x357358bafd54c494fcafdc67bbee82776a763583",
  "0x39cf57b4decb8ae3dec0dfca1e2ea2c320416288",
  "0xa08891636ba65305420faa600fdcca2476bb4613",
  "0x3654746ce159ba2fcdf926133d51ecbb85f19288",
  "0x4e0b2a80e158f8d28a2007866ab80b7f63be6076",
  "0xd8a27727da222a1e4751da06a0e42305b32e3870",
  "0xe65cff5e6129387602fb6ebbd98d403a9e8bbd78",
  "0x8eb3fecaaa963c86d9b49004d9f28092f1db3d6c",
  "0x2118fa9369b9a52fb6bf8cf3fd392643d55a53b4",
  "0x66dab8a88b7ca020a89f45380cc61692fe62e7ed",
  "0x660e8ac72dd2c4b69fbefd0c89824c7e0a88e8a2",
  "0xb5f3dee204ca76e913bb3129ba0312b9f0f31d82",
  "0x60f80121c31a0d46b5279700f9df786054aa5ee5",
  "0xc3cd69649394bf1a18a7a0c7f90e4d0e4f1a9758",
  "0xa52fc936d1d4c8251b2bb25d052c8e02873159d2",
  "0x10cdcb5a80e888ec9e9154439e86b911f684da7b",
  "0x6d0de90cdc47047982238fcf69944555d27ecb25",
  "0x95ad01c2180ce793257ad79b4bc6131840a82b39",
  "0x1c5dcbbc0f65027f2e7aef79428323dd6f36361a",
  "0xf497253c2bb7644ebb99e4d9ecc104ae7a79187a",
  "0x1a2f71468f656e97c2f86541e57189f59951efe7",
  "0xafba8c6b3875868a90e5055e791213258a9fe7a7",
  "0xc4de189abf94c57f396bd4c52ab13b954febefd8",
  "0x34d85c9cdeb23fa97cb08333b511ac86e1c4e258",
  "0x495f947276749ce646f68ac8c248420045cb7b5e",
  "0x8f5be6ee538c8e4b2bcfbf51d824cb9d294d1567",
  "0x08164ee2dda4e8aab7a42ccc13aadd2b296395ae",
  "0x50e27b011738a46cf6fd7e7ab7b9d9db5c7813a6",
  "0x52a043ec29fbb9a1b142b8913a76c0bc592d0849",
  "0x63f421b24cea6765b326753f6d4e558c21ea8f76",
  "0x1e15c05cbad367f044cbfbafda3d9a1510db5513",
  "0xdcf68c8ebb18df1419c7dff17ed33505faf8a20c",
  "0xcc2af1d923de3e8d79fbe650b4cc2859425dd356",
  "0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c",
  "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
  "0x767fe9edc9e0df98e07454847909b5e959d7ca0e",
  "0xbb0e17ef65f82ab018d8edd776e8dd940327b28b",
  "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
  "0x0f5d2fb29fb7d3cfee444a200298f468908cc942",
  "0x3845badade8e6dff049820680d1f14bd3903a5d0",
  "0xe41d2489571d322189246dafa5ebde1f4699f498",
  "0xd26114cd6ee289accf82350c8d8487fedb8a0c07",
  "0x221657776846890989a759ba2973e427dff5c9bb",
  "0x12b6893ce26ea6341919fe289212ef77e51688c8",
  "0x6b175474e89094c44da98b954eedeac495271d0f",
  "0xdac17f958d2ee523a2206206994597c13d831ec7",
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  "0x4fabb145d64652a948d72533023f6e7a623c7c53",
  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  "0x4d224452801aced8b2f0aebe155379bb5d594381",
  "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
  "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce",
  "0x514910771af9ca656af840dff83e8264ecf986ca",
  "0xc18360217d8f7ab5e7c516566761ea12ce7f9d72",
  "0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0",
  "0xa2cd3d43c775978a96bdbf12d733d5a1ed94fb18",
  "0x1982b2f5814301d4e9a8b0201555376e62f82428",
  "0x60e4d786628fea6478f785a6d7e704777c86a7c6",
  "0x493b733d008e9af91cd3e2efee321f11fc62e60f",
  "0xe5c65ab5b67e6c9c4341a9e835bebd63285c4c8a",
  "0x5b02557c4e9a5d886387e48fe3284668220afb53",
  "0x3256e931236a9cde00901755477d7ba554b5d472",
  "0xdacea04a43eaf3c5a6f171cdfbd9ae7447faf325",
  "0xb0baf2161973f4224488e3945ff2c4499fa99d1c",
  "0x364ce4e74a1ddd42e6f96a5ee69280e7596b0aaf",
  "0x9d06c6da524bd27996460ae781b06d586a17e1ca",
  "0x2ece57279d8a7e46fbc17506b1814a7d063df6ca",
  "0x7cffedb2f4fc0cd7c29af95488fd34554539589d",
  "0x20f3a94c940ed0f25fb9b7a6b468affce18006e7",
  "0x0b768874f06686eeb6f00f44a21b19f831751973",
  "0x1e0049783f008a0085193e00003d00cd54003c71"
];


async function getRecentScamActivity(limit = 100) {
  const req = await fetch(
    `${API}/scamActivity?sort=-id&limit=${limit}&fields=address,host,action,time,link`
  );
  const list = await req.json();
  let allAddressList = [];
  let allSites = [];
  let combined = {};
  let indexByDay = {};
  list.map((_) => {
    const actions = _.action.split(',');
    if (actions.indexOf('maliciousCodeFeature') > -1 && actions.length === 1) {
      return;
    }
    if (actions.indexOf('transferETH') > -1 && actions.length === 1) {
      return;
    }
    if (actions.indexOf('setApprovalForAll') > -1 && actions.length === 1) {
      return;
    }
    if (actions.indexOf('approve') > -1 && actions.length === 1) {
      return;
    }

    const hasRedirect = !_.link.includes(_.host);
    if (hasRedirect) {
      return;
    }

    const timeLeft = Date.now() - new Date(_.time).getTime();
    const interval = 86400 * 1000 * 3;

    if (timeLeft < interval) {
      return;
    }


    const list = _.address.split(",").map((_) => _.toLowerCase()).filter((c) => c && c != "").filter(value => !recallList.includes(value));
    allAddressList = allAddressList.concat(
      list
    );
    if (_.host) allSites.push(_.host);

    const day = moment(_.time).format("YYYY-MM-DD");

    indexByDay[day] = indexByDay[day] || {
      domain: [],
      address:[]
    };

    if (_.host) indexByDay[day].domain.push(_.host);
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

  const limit = firstRun ? 100000 : 5000;
  const allList = await getRecentScamActivity(limit);

  allList.combined = firstRun ? {} : cacheData.combined;

  const newDomains = [];
  const newAddress = [];

  // console.log("firstRun", firstRun, allFile);
  // console.log(allList.days[allList.days.length - 1], firstRun)
  // return 

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
  // merge
  // allList.address = allList.address.concat(reportList);

  allList.address.forEach((address) => {
    if (cacheData.address.indexOf(address) === -1) {
      newAddress.push(address);
    }
  });

  allList.address = [].concat(newAddress, cacheData.address);
  allList.domains = [].concat(newDomains, cacheData.domains);


  for (let index = 0; index < allList.days.length; index++) {
    const dayData = allList.days[index];
    const listData = {
      domains: dayData.domains,
      address: dayData.address
    };
    const allFile = archiveDir + `${dayData.day}.json`;
    let cacheData = {
      domains: [],
      address: []
    };
    if (fs.existsSync(allFile)) {
      cacheData = JSON.parse(fs.readFileSync(allFile, "utf-8"));
    }

    cacheData.address = cacheData.address || [];

    const newDomains = [];
    const newAddress = [];

    listData.domains.forEach((domain) => {
      if (cacheData.domains.indexOf(domain) === -1) {
        newDomains.push(domain);
      }
    });
    
    listData.address.forEach((address) => {
      if (cacheData.address && cacheData.address.indexOf(address) === -1) {
        // newAddress.push(address);
      }
    });
  
    listData.address = [].concat(newAddress, cacheData.address);
    listData.domains = [].concat(newDomains, cacheData.domains);
    delete listData.address;
    fs.writeFileSync(allFile, JSON.stringify(listData, null, 2));
  }

  if (allList.days) delete allList.days;
  
  fs.writeFileSync(allFile, JSON.stringify(allList, null, 2));
  // fs.writeFileSync(addressFile, JSON.stringify(allList.address, null, 2));
  fs.writeFileSync(domainFile, JSON.stringify(allList.domains, null, 2));
  // fs.writeFileSync(combinedFile, JSON.stringify(allList.combined, null, 2));
  console.log("found", newAddress.length, newAddress.length, cacheData.domains.length, cacheData.address.length);
}

doGenerate();
