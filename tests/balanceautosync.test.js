const RaidaJS = require('raidajs').default
const expect = require('chai').expect

function callback3Rdown (rID, url, data){
  if(rID < 3){
    throw new error
  }
}

describe('balance and autosync error codes', () => {

  let raidajs
  let coin
  let r
  let params


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


    })
    after(async function() {
    })
    beforeEach(async function(){

    })
    afterEach(async function(){})

    it('FixTransferSync should fail with no coin', async function(){
    params = {}
    r = await raidajs.apiFixTransferSync(params)
    })
    it('FixTransferSync should fail with no coin data', async function(){
    params = {"coin": {}}
    r = await raidajs.apiFixTransferSync(params)
    })
    it('ShowBalance should fail with no coin (code 0x1001)', async function(){
    params = { }
    r = await raidajs.apiShowBalance()
    expect(r.code).to.equal(0x1001);
    })
    it('ShowBalance should fail with no coin data (code 0x1002)', async function(){
    params = { }
    r = await raidajs.apiShowBalance(params)
    expect(r.code).to.equal(0x1002);
    })

    it('ShowBalance should fail with fake coin (code 0x2001)', async function(){
  params = {"coin": coin}
  r = await raidajs.apiShowBalance(coin)
  expect(r.code).to.equal(0x2001);
    })




})

describe('balance and autosync', () => {

  let raidajs
  let fracked
  let fix
  let coin
  let r
  let params


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
fix = {
sn: 6379373,
an: ["0", "ff35a13ebb2c0f710d5bdf3ddf5bd4fb", "83f301143151aee59b2735692e605a42", "9c113bd4cdec1fb28d3d7b66c5201b99", "9d659f63f75dcb7692864bb1b1e50b4f",
			"7295f7d47097f032988384d6b492eb98", "359d0a7a87294b37bfec82a219b1a749", "0c32afcbafce63d86e45a1d7228c5262", "55425cd6d4aa0f382a891b2abd3bf1bf", "449674e5e06cb736b24acb71b345d44e",
			"37b7e173c24f77e40b6533318be7f997", "dd9a25ae85940e7660ec082b6d714be3", "e3e78a9cdb2eb6533d5438fe7af7ca25", "e3c237a70bdeef97f6c802e928f8c27b", "c4b1f26d7e3cc3bbddc91c73a352a3a5",
			"210df1ce1c387784caffbebc494da4c3", "3a7be639657c70228d927de1f9194885", "1a9d9efd07ec64b5130f876180d39f87", "8b9c5aa8378be0ca9981e1a7126bc26e", "12b1c59b60e1a6fb35b1db34c3aaacaa",
			"bc15dd7516c53d5b77dc1f030623e02a", "2eb074b2b54a1c61e5a7eb2ad271d635", "69a4d83fe06d3fd3d2e9bedc47fdaaba", "a7f1e4de32ada340e813cb7e241b65f4", "0528293e2a67b7bcd2c8033d7536d28b"]
}



    })
    after(async function() {
    })
    beforeEach(async function(){

    })
    afterEach(async function(){})

    it('Echo (code 0x0)', async function(){
    r = await raidajs.apiEcho()
    expect(r.code).to.equal(0x0);
    })
    it('FixTransferSync (code ?)', async function(){
    params = {"coin": fix}
    r = await raidajs.apiFixTransferSync(params)
  })
  it('ShowBalance (code 0x0)', async function(){
  params = {"coin": coin}
  r = await raidajs.apiShowBalance(coin)
  expect(r.code).to.equal(0x0);
  })

  //raida down
  it('Echo (code 0x0) with 3 raida down', async function(){
  params = {}
  r = await raidajs.apiEcho(callback3Rdown)
  expect(r.code).to.equal(0x0);
  })

it('ShowBalance (code 0x0) with 3 raida down', async function(){
params = { "coin": coin}
r = await raidajs.apiShowBalance(coin, callback3Rdown)
expect(r.code).to.equal(0x0);
})

//fracked coin

it('ShowBalance (code 0x0) with fracked coin', async function(){
params = { "coin": fracked}
r = await raidajs.apiShowBalance(fracked)
expect(r.code).to.equal(0x0);
})



})
