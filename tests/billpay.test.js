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
  	sn: 6379371,
  	an: ["c04b49b2475d4a6db759bd5f2165e9bb", "4ee73a648030c38321cedbde88b3f1f0", "fb6703f8dc959c77aaecf688f41d120f", "1a40be3f128fef6b71e05b96b59783fa", "8fdc9689c0075496b29d2aeacfd66a80",
  			"545dfb26ebe1b895092d3807c681f66f", "953a1ce55b88b5a77187060b523dfa67", "1e54c731f14542709a3052229678c62c", "8149f6bf4d20894c886c8cf091de95b9", "69a211dcbc25b97d118bda253f6e7f8f",
  			"26baf733abaf4061286bfa71ba9745af", "303178a75598069e723b6768c11f1c33", "e176b009c37f95c9a8175942c06585a3", "e60a32d2a2703737320be8dbb9a3d8fd", "dbf1fd07c49f1430a889503d03ac66f1",
  			"be4d8eebb87e53f84106095fad565c3b", "24a6dd7b1b87dabc16cca0c4d23c6604", "9eedfb16c9246940d0611ae2d283c248", "edd1402c3cfcf04998b032c0f546b835", "9977047c09e5df53c9fae7f412823665",
  			"1ec5dc4999402b8d920a12dcaf4b4656", "02564c374274f05febe083efeceae760", "06788e278f3f6dcb7bd2e8709628da5f", "9b4c3e1b900365eaf3f8355df59a7e0e", "1deb3cbd698f0b4daf34a9a4906fe176"]
  }
  fracked = {
sn: 6379371,
an: ["0", "0", "0", "1a40be3f128fef6b71e05b96b59783fa", "8fdc9689c0075496b29d2aeacfd66a80",
    "545dfb26ebe1b895092d3807c681f66f", "953a1ce55b88b5a77187060b523dfa67", "1e54c731f14542709a3052229678c62c", "8149f6bf4d20894c886c8cf091de95b9", "69a211dcbc25b97d118bda253f6e7f8f",
    "26baf733abaf4061286bfa71ba9745af", "303178a75598069e723b6768c11f1c33", "e176b009c37f95c9a8175942c06585a3", "e60a32d2a2703737320be8dbb9a3d8fd", "dbf1fd07c49f1430a889503d03ac66f1",
    "be4d8eebb87e53f84106095fad565c3b", "24a6dd7b1b87dabc16cca0c4d23c6604", "9eedfb16c9246940d0611ae2d283c248", "edd1402c3cfcf04998b032c0f546b835", "9977047c09e5df53c9fae7f412823665",
    "1ec5dc4999402b8d920a12dcaf4b4656", "02564c374274f05febe083efeceae760", "06788e278f3f6dcb7bd2e8709628da5f", "9b4c3e1b900365eaf3f8355df59a7e0e", "1deb3cbd698f0b4daf34a9a4906fe176"]
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
    params = {"coin": coin, "paydata": paydata}
    r = await raidajs.apiBillPay(params)
    expect(r.code).to.equal(0x0);
    guid = r.guid
    })
    it('BillPayList (code 0x0)', async function(){
    params = {"guid":guid}
    r = await raidajs.apiBillPayList(params)
    expect(r.code).to.equal(0x0);
  })
  it('BillPay (code 0x0) with 3 raida down', async function(){
  params = {"coin": coin, "paydata": paydata}
  r = await raidajs.apiBillPay(params, callback3Rdown)
  expect(r.code).to.equal(0x0);
  guid = r.guid
  })
  it('BillPayList (code 0x0) with 3 raida down', async function(){
  params = {"guid":guid}
  r = await raidajs.apiBillPayList(params, callback3Rdown)
  expect(r.code).to.equal(0x0);
})
it('BillPay (code 0x0) with fracked coin', async function(){
params = {"coin": coin, "paydata": paydata}
r = await raidajs.apiBillPay(params)
expect(r.code).to.equal(0x0);
guid = r.guid
})
it('BillPayList (code 0x0) with fracked coin', async function(){
params = {"guid":guid}
r = await raidajs.apiBillPayList(params)
expect(r.code).to.equal(0x0);
})


})
