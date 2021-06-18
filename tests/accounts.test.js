const RaidaJS = require('raidajs').default
const expect = require('chai').expect

function callback3Rdown (rID, url, data){
  if(rID < 3){
    throw new error
  }
}

describe('accounts error codes', () => {

  let raidajs
  let coin
  let r
  let params
  let guid
  let name
  let nocard
  let password
  let email

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
  guid = "0123456789ABCDEF0123456789ABCDEF"
  name = "sergiy.skywallet.cc"
  nocard = "jsautotestnocard.skywallet.cc"
  email = "chernyshovtesero@protonmail.com"
  password = "55123400"

    })
    after(async function() {
    })
    beforeEach(async function(){

    })
    afterEach(async function(){})


    it('ResolveSkywallet should fail with invalid dns (code 0x5001)', async function(){
  params = "name"
  r = await raidajs.apiResolveSkyWallet(params)
  expect(r.code).to.equal(0x5001);
    })


    it('RestoreCard should fail with no dns name (code 0x1025)', async function(){
    params = {  "password": password, "email": email}
    r = await raidajs.apiRestoreCard(params)
    expect(r.code).to.equal(0x1025);
    })
    it('RestoreCard should fail with invalid dns name (code 0x5001)', async function(){
    params = { "username": "name", "password": password, "email": email}
    r = await raidajs.apiRestoreCard(params)
    expect(r.code).to.equal(0x5001);
    })
    it('RestoreCard should fail with invalid card (code 0x1027)', async function(){
    params = { "username": nocard, "password": password, "email": email}
    r = await raidajs.apiRestoreCard(params)
    expect(r.code).to.equal(0x1027);
    })

/*
    it('GetFreeCoin should fail with no response ', async function(){
    params = { "guid": guid}
    r = await raidajs.apiGetFreeCoin(params)

    })
    it('GetFreeCoin should fail when it cant get coin', async function(){
    params = {"guid": guid}
    r = await raidajs.apiGetFreeCoin(params)

    })

*/

})

describe('accounts', () => {

  let raidajs
  let fracked
  let fix
  let coin
  let r
  let name
  let password
  let guid
  let email

    before(async function(){
      raidajs = new RaidaJS({timeout: 20000, debug: true})
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
an: ["00000000000000000000000000000000", "00000000000000000000000000000000", "00000000000000000000000000000000", "1a40be3f128fef6b71e05b96b59783fa", "8fdc9689c0075496b29d2aeacfd66a80",
    "545dfb26ebe1b895092d3807c681f66f", "953a1ce55b88b5a77187060b523dfa67", "1e54c731f14542709a3052229678c62c", "8149f6bf4d20894c886c8cf091de95b9", "69a211dcbc25b97d118bda253f6e7f8f",
    "26baf733abaf4061286bfa71ba9745af", "303178a75598069e723b6768c11f1c33", "e176b009c37f95c9a8175942c06585a3", "e60a32d2a2703737320be8dbb9a3d8fd", "dbf1fd07c49f1430a889503d03ac66f1",
    "be4d8eebb87e53f84106095fad565c3b", "24a6dd7b1b87dabc16cca0c4d23c6604", "9eedfb16c9246940d0611ae2d283c248", "edd1402c3cfcf04998b032c0f546b835", "9977047c09e5df53c9fae7f412823665",
    "1ec5dc4999402b8d920a12dcaf4b4656", "02564c374274f05febe083efeceae760", "06788e278f3f6dcb7bd2e8709628da5f", "9b4c3e1b900365eaf3f8355df59a7e0e", "1deb3cbd698f0b4daf34a9a4906fe176"]
}

guid = "0123456789ABCDEF0123456789ABCDEF"
name = "sergiy.skywallet.cc"
email = "chernyshovtesero@protonmail.com"
password = "55123400"

    })
    after(async function() {
    })
    beforeEach(async function(){

    })
    afterEach(async function(){})

    it('ResolveSkywallet (code 0x0)', async function(){
    params = name
    r = await raidajs.apiResolveSkyWallet(params)
    expect(r.code).to.equal(0x0);
    guid = r.guid
    })
  it('RestoreCard (code 0x0)', async function(){
  params = {"username": name, "password": password, "email": email}
  r = await raidajs.apiRestoreCard(params)
  expect(r.code).to.equal(0x0);
  })
  it('GetFreeCoin (code 0x0)', async function(){
  params = { "guid": guid}
  r = await raidajs.apiGetFreeCoin(params)
  expect(r.code).to.equal(0x0);
  })



  //raida down
  it('ResolveSkywallet (code 0x0) with 3 raida down', async function(){
  params =  name
  r = await raidajs.apiResolveSkyWallet(params, callback3Rdown)
  expect(r.code).to.equal(0x0);
  guid = r.guid
  })
it('RestoreCard (code 0x0) with 3 raida down', async function(){
params = {"username": name, "password": password, "email": email}
r = await raidajs.apiRestoreCard(params, callback3Rdown)
expect(r.code).to.equal(0x0);
})
it('GetFreeCoin (code 0x0) with 3 raida down', async function(){
params = {"guid": guid}
r = await raidajs.apiGetFreeCoin(params, callback3Rdown)
expect(r.code).to.equal(0x0);
})





})
