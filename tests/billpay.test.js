const LocalStorage = require('node-localstorage').LocalStorage
const RaidaJS = require('raidajs').default
const expect = require('chai').expect

function callback3Rdown (rID, url, data){
  if(rID < 3){
    throw new error
  }
}

describe('bill pay error codes', () => {
  let raidajs
  let coin
  let paydata
  let r
  let params
  let guid


    before(async function(){

        localStorage = new LocalStorage('./scratch')
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
  paydata = "TransferToSkywallet, stack, 100, 0,0,0,0,0, sergiy.skywallet.cc, test,, ready"
  guid = "0123456789ABCDEF0123456789ABCDEF"

    })
    after(async function() {

    })
    beforeEach(async function(){

    })
    afterEach(async function(){})

    it('BillPay should fail with no coin (code 0x1001)', async function(){
    params = { "paydata" : paydata}
    r = await raidajs.apiBillPay(params)
    expect(r.code).to.equal(0x1001);
    })
    it('BillPay should fail with no coin data (code 0x1002)', async function(){
    params = {"coin": {}, "paydata": paydata}
    r = await raidajs.apiBillPay(params)
    expect(r.code).to.equal(0x1002);
    })
    it('BillPay should fail with no paydata (code 0x1017)', async function(){
    params = {"coin": coin}
    r = await raidajs.apiBillPay(params)
    expect(r.code).to.equal(0x1017);
    })
    it('BillPay should fail with invalid paydata method (code 0x1019)', async function(){
    params = {"coin": coin, "paydata": "Transfer, stack, 100, 0,0,0,0,0, sergiy.skywallet.cc, test,, ready"}
    r = await raidajs.apiBillPay(params)
    expect(r.code).to.equal(0x1019);
    })
    it('BillPay should fail with invalid paydata fileformat (code 0x1020)', async function(){
    params = {"coin": coin, "paydata": "TransferToSkywallet, png, 100, 0,0,0,0,0, sergiy.skywallet.cc, test,, ready"}
    r = await raidajs.apiBillPay(params)
    expect(r.code).to.equal(0x1020);
    })
    it('BillPay should fail with invalid paydata amount: text (code 0x1021)', async function(){
    params = {"coin": coin, "paydata": "TransferToSkywallet, stack, one, 0,0,0,0,0, sergiy.skywallet.cc, test,, ready"}
    r = await raidajs.apiBillPay(params)
    expect(r.code).to.equal(0x1021);
    })
    it('BillPay should fail with invalid paydata amount: negative (code 0x1021)', async function(){
    params = {"coin": coin, "paydata": "TransferToSkywallet, stack, -100, 0,0,0,0,0, sergiy.skywallet.cc, test,, ready"}
    r = await raidajs.apiBillPay(params)
    expect(r.code).to.equal(0x1021);
    })
    it('BillPay should fail with invalid paydata amount denomination (code 0x1021)', async function(){
    params = {"coin": coin, "paydata": "TransferToSkywallet, stack, 100, 1,0,0,0,1, sergiy.skywallet.cc, test,, ready"}
    r = await raidajs.apiBillPay(params)
    expect(r.code).to.equal(0x1021);
    })
    it('BillPay should fail with invalid paydata status (code 0x1022)', async function(){
    params = {"coin": coin, "paydata": "TransferToSkywallet, stack, 100, 0,0,0,0,0, sergiy.skywallet.cc, test,, error"}
    r = await raidajs.apiBillPay(params)
    expect(r.code).to.equal(0x1022);
    })
    it('BillPay should fail with invalid guid (code 0x1004)', async function(){
    params = {"coin": coin, "paydata": paydata, "guid": "GHIJKLMONPQRS"}
    r = await raidajs.apiBillPay(params)
    expect(r.code).to.equal(0x1004);
    })
    it('BillPay should send partially with fake coin (code 0x6001)', async function(){
    params = {"coin": coin, "paydata": paydata}
    r = await raidajs.apiBillPay(params)
    expect(r.code).to.equal(0x6001);
    })

    it('BillPayList should fail with no guid (code 0x1003)', async function(){
    params = { }
    r = await raidajs.apiBillPayList(params)
    expect(r.code).to.equal(0x1003);
    })
    it('BillPayList should fail with invalid guid (code 0x1004)', async function(){
    params = {"guid": "GHIJKLMONPQRS"}
    r = await raidajs.apiBillPayList(params)
    expect(r.code).to.equal(0x1004);
    })
    it('BillPayList should fail with no record (code 0x2003)', async function(){
    params = {"guid": guid}
    r = await raidajs.apiBillPayList(params)
    expect(r.code).to.equal(0x2003);
    })



})

describe('bill pay', () => {

  let raidajs
  let coin
  let amount
  let paydata
  let r
  let params
  let guid
  let fracked

    before(async function(){
      raidajs = new RaidaJS({timeout: 20000, debug: true})
            localStorage = new LocalStorage('./scratch')
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
  paydata = "TransferToSkywallet, stack, 100, 0,0,0,0,0, sergiy.skywallet.cc, test,, ready"
  guid = "0123456789ABCDEF0123456789ABCDEF"

    })
    after(async function() {

    })
    beforeEach(async function(){

    })
    afterEach(async function(){})

    it('BillPay (code 0x0)', async function(){
    params = {"coin": coin, "paydata": paydata, "guid":guid}
    r = await raidajs.apiBillPay(params)
    expect(r.code).to.equal(0x0);
    //guid = r.guid
    })
    it('BillPayList (code 0x0)', async function(){
    params = {"guid":guid}
    r = await raidajs.apiBillPayList(params)
    expect(r.code).to.equal(0x0);
  })
  it('BillPay (code 0x0) with 3 raida down', async function(){
  params = {"coin": coin, "paydata": paydata, "guid":guid}
  r = await raidajs.apiBillPay(params, callback3Rdown)
  expect(r.code).to.equal(0x0);
  //guid = r.guid
  })
  it('BillPayList (code 0x0) with 3 raida down', async function(){
  params = {"guid":guid}
  r = await raidajs.apiBillPayList(params, callback3Rdown)
  expect(r.code).to.equal(0x0);
})
it('BillPay (code 0x0) with fracked coin', async function(){
params = {"coin": coin, "paydata": paydata, "guid":guid}
r = await raidajs.apiBillPay(params)
expect(r.code).to.equal(0x0);
//guid = r.guid
})
it('BillPayList (code 0x0) with fracked coin', async function(){
params = {"guid":guid}
r = await raidajs.apiBillPayList(params)
expect(r.code).to.equal(0x0);
})


})
