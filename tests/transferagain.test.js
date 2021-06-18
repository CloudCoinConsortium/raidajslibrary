const RaidaJS = require('raidajs').default
const expect = require('chai').expect

function callback3Rdown (rID, url, data){
  if(rID < 3){
    throw new error
  }
}

describe('Transfer error codes', () => {

  let raidajs
  let coin
  let r
  let params
  let to
  let amount
  let tag
  //account is sn

    before(async function(){
      raidajs = new RaidaJS({timeout: 20000, debug: true})
      coin = {
  	sn: 20,
  	an: ["00000000000000000000000000000000","00000000000000000000000000000000",
  	"00000000000000000000000000000000","00000000000000000000000000000000",
  	"00000000000000000000000000000000","00000000000000000000000000000000",
  	"00000000000000000000000000000000","00000000000000000000000000000000",
  	"00000000000000000000000000000000","00000000000000000000000000000000",
  	"00000000000000000000000000000000","00000000000000000000000000000000",
  	"00000000000000000000000000000000","00000000000000000000000000000000",
  	"00000000000000000000000000000000","00000000000000000000000000000000",
  	"00000000000000000000000000000000","00000000000000000000000000000000",
  	"00000000000000000000000000000000","00000000000000000000000000000000",
  	"00000000000000000000000000000000","00000000000000000000000000000000",
  	"00000000000000000000000000000000","00000000000000000000000000000000",
  	"00000000000000000000000000000000"]
  }
  to  = "sergiy.skywallet.cc"
  amount = 100
  tag = "9c19c5c1b95ac5a95c1b"


    })
    after(async function() {
    })
    beforeEach(async function(){

    })
    afterEach(async function(){})

    it('Transfer should fail with no coin (code 0x1001)', async function(){
    params = {  "to": to, "amount": amount}
    r = await raidajs.apiTransfer(params)
    expect(r.code).to.equal(0x1001);
    })
    it('Transfer should fail no one to send to', async function(){
  params = {"sn": coin.sn, "an": coin.an, "pan": coin.an, "amount": amount}
  r = await raidajs.apiTransfer(params)
expect(r.errorText).to.include("Invalid params. To is not defined")
    })
    it('Transfer should fail with invalid dns', async function(){
  params = {"sn": coin.sn, "an": coin.an, "pan": coin.an, "to": "to", "amount": amount}
  r = await raidajs.apiTransfer(params)
expect(r.errorText).to.include("Failed to resolve DNS name: ")
    })
    it('Transfer should fail with invalid guid?', async function(){
  params = {"sn": coin.sn, "an": coin.an, "pan": coin.an, "to": to, "amount": amount, "guid": "guid"}
  r = await raidajs.apiTransfer(params)
expect(r.errorText).to.include("Invalid GUID format");
    })
    it('Transfer should fail without enough cloudcoin', async function(){
  params = {"sn": coin.sn, "an": coin.an, "pan": coin.an, "to": to, "amount": 1000000}
  r = await raidajs.apiTransfer(params)
expect(r.errorText).to.include("Not enough cloudcoins");
    })
    it('Transfer should fail when above transfer limit', async function(){
  params = {"sn": coin.sn, "an": coin.an, "pan": coin.an, "to": to, "amount": (20000 * 250)}
  r = await raidajs.apiTransfer(params)
  expect(r.errorText).to.include("You can't transfer more than ")
    })
    it('Transfer should fail with no amount', async function(){
  params = {"sn": coin.sn, "an": coin.an, "pan": coin.an, "to": to}
  r = await raidajs.apiTransfer(params)
  expect(r.errorText).to.include("Invalid params. Amount is not defined");
    })
    it('Transfer should fail with fake coin (code 0x2001)', async function(){
  params = {"sn": coin.sn, "an": coin.an, "pan": coin.an, "to": to, "amount": amount}
  r = await raidajs.apiTransfer(params)
  expect(r.code).to.equal(0x2001);
    })

    it('ViewReceipt should fail with no coin (code 0x1001)', async function(){
    params = {  "tag": tag}
    r = await raidajs.apiViewreceipt(params)
    expect(r.code).to.equal(0x1001);
    })

    it('ViewReceipt should fail with no tag', async function(){
    params = {  "account": coin.sn}
    r = await raidajs.apiViewreceipt(params)
    expect(r.errorText).to.include("Account and Tag required");
    })

    it('ViewReceipt should fail with invalid account sn', async function(){
    params = { "account": 999999999999999999, "tag": tag}
    r = await raidajs.apiViewreceipt(params)
expect(r.errorText).to.include("Invalid Account");
    })
    it('ViewReceipt should fail with invalid tag', async function(){
    params = { "account": coin.sn, "tag": "tag"}
    r = await raidajs.apiViewreceipt(params)
expect(r.errorText).to.include("Invalid Tag UUID")
    })

    it('ViewReceipt should fail with fake coin (code 0x2001)', async function(){
  params = {"account": coin.sn, "tag": tag}
  r = await raidajs.apiViewreceipt(params)
  expect(r.code).to.equal(0x2001);
    })



})

describe('Transfer', () => {

  let raidajs
  let fracked
  let fix
  let coin
  let r
  let params
  let to
  let amount
  let tag

    before(async function(){
      raidajs = new RaidaJS({timeout: 20000, debug: true})
      coin = {
  	sn: 6379347,
  	an: [
"1856d891b22422a6b932345065fd46a4","6c0eed479d01e7054e1465ee3db497e4","995f7d3eb29f4bc84df3a8cd1c16cc1e","5a8f5ae283c5f8dc6438c9fac81d9cb1","59970aafc57d19c1678e9df975dcb9ea",
"3655633ffe81e232e0404c97fe574e71","830362e6a7ea949c22625a1498ada286","c06f922cbeae7499936b8a3797e8fd56","b6e18fb82337929a113353f4f0678fbc","1eb1f2c2f173f45ae6d6f9207f573ad2",
"6108d215781fa8ef0665b60987bca1e5","e9e7a6c84ff05667f0772493c9f12d98","b13e27e99b172114a0a20c7ec0608b88","f93864eb3655e7490272fb95ea3a01e0","c3194209b96c3a06235a940d752e9598",
"ce09f3de14ee7b005c96d0dc0c364538","759639c097b925cc2161522bf620e8d7","42949b9ec42b0901662af23b0ed74ad8","ab88d91caf55c2682db080d28ba9a8fe","6f3283fcf2342de6ecaf4f834e79a0b9",
"2be8b9dff9b76dcd6aa9b901fe5c5423","0a64936bad6540faa68acaee6e864d84","d8068d2fc6ac76207e847fc36dec84f2","1a4872bc2d05579122797f505b6af0a6","648596466f6e6f48899e944f97f885f0"]
  }
  fracked = {
sn: 6379347,
an: [
"00000000000000000000000000000000","00000000000000000000000000000000","00000000000000000000000000000000","5a8f5ae283c5f8dc6438c9fac81d9cb1","59970aafc57d19c1678e9df975dcb9ea",
"3655633ffe81e232e0404c97fe574e71","830362e6a7ea949c22625a1498ada286","c06f922cbeae7499936b8a3797e8fd56","b6e18fb82337929a113353f4f0678fbc","1eb1f2c2f173f45ae6d6f9207f573ad2",
"6108d215781fa8ef0665b60987bca1e5","e9e7a6c84ff05667f0772493c9f12d98","b13e27e99b172114a0a20c7ec0608b88","f93864eb3655e7490272fb95ea3a01e0","c3194209b96c3a06235a940d752e9598",
"ce09f3de14ee7b005c96d0dc0c364538","759639c097b925cc2161522bf620e8d7","42949b9ec42b0901662af23b0ed74ad8","ab88d91caf55c2682db080d28ba9a8fe","6f3283fcf2342de6ecaf4f834e79a0b9",
"2be8b9dff9b76dcd6aa9b901fe5c5423","0a64936bad6540faa68acaee6e864d84","d8068d2fc6ac76207e847fc36dec84f2","1a4872bc2d05579122797f505b6af0a6","648596466f6e6f48899e944f97f885f0"]
}

to  = "sergiy.skywallet.cc"
amount = 100
tag = "3655633ffe81e232e0404c97fe574e71"

    })
    after(async function() {
    })
    beforeEach(async function(){

    })
    afterEach(async function(){})

    it('Transfer (code 0x0)', async function(){
    params = {"sn": coin.sn, "an": coin.an, "pan": coin.an, "to": to, "amount": amount, "guid": tag}
    r = await raidajs.apiTransfer(params)
    //expect(r.code).to.equal(0x0);
    if(r.status == "error")
    console.log(r.errorText)
    expect(r.status).to.include("done")
    //tag = r.guid
    })

  it('ViewReceipt (code 0x0)', async function(){
  params = {"account": coin.sn, "tag": tag}
  r = await raidajs.apiViewreceipt(params)
  //expect(r.code).to.equal(0x0);
  if(r.status == "error")
  console.log(r.errorText)
  expect(r.status).to.include("done")
  })

  //raida down
  it('Transfer (code 0x0) with 3 raida down', async function(){
  params = {"sn": coin.sn, "an": coin.an, "pan": coin.an, "to": to, "amount": amount, "guid":tag}
  r = await raidajs.apiTransfer(params, callback3Rdown)
  //expect(r.code).to.equal(0x0);
  if(r.status == "error")
  console.log(r.errorText)
  expect(r.status).to.include("done")
  //tag = r.guid
  })

it('ViewReceipt (code 0x0) with 3 raida down', async function(){
params = { "account": coin.sn, "tag": tag}
r = await raidajs.apiViewreceipt(params, callback3Rdown)
//expect(r.code).to.equal(0x0);
if(r.status == "error")
console.log(r.errorText)
expect(r.status).to.include("done")
})

//fracked coin
it('Transfer (code 0x0) with fracked coin', async function(){
params = {"sn": fracked.sn, "an": fracked.an, "pan": fracked.an, "to": to, "amount": amount, "guid": tag}
r = await raidajs.apiTransfer(params)
//expect(r.code).to.equal(0x0);
if(r.status == "error")
console.log(r.errorText)
expect(r.status).to.include("done")
//tag = r.guid
})

it('ViewReceipt (code 0x0) with fracked coin', async function(){
params = { "account": fracked.sn, "tag": tag}
r = await raidajs.apiViewreceipt(params)
//expect(r.code).to.equal(0x0);
if(r.status == "error")
console.log(r.errorText)
expect(r.status).to.include("done")
})


})
