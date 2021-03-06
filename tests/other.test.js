const RaidaJS = require('raidajs').default
const expect = require('chai').expect

function callback3Rdown (rID, url, data){
  if(rID < 3){
    throw new error
  }
}

describe('error codes', () => {

  let raidajs
  let coin
  let r
  let params


    before(async function(){
      raidajs = new RaidaJS({timeout: 20000, debug: true})
      raidajsnotemplate = new RaidaJS({timeout: 20000, debug: true,urlCardTemplate: ""})
      raidajswrongtemplate = new RaidaJS({timeout: 20000, debug: true,urlCardTemplate: "https://cloudcoinconsortium.com/css/icons/fl-icons.ttf"})
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

    it('Detect should fail with no coin (code 0x1001)', async function(){
    params = { }
    r = await raidajs.apiDetect(params)
    expect(r.code).to.equal(0x1001);
    })
    it('Detect should fail with no coin data (code 0x1002)', async function(){
    params = {"coin": {}}
    r = await raidajs.apiDetect(params)
    expect(r.code).to.equal(0x1002);
    })
    it('Detect should fail with fake coin (code 0x2001)', async function(){
  params = {"coin": coin}
  r = await raidajs.apiDetect(params)
  expect(r.code).to.equal(0x2001);
    })
    it('Send should fail with no coin', async function(){
    params = {}
    r = await raidajs.apiSend(params)
    })
    it('Send should fail with no coin data', async function(){
    params = {"coin": {}}
    r = await raidajs.apiSend(params)
    })
    it('Receive should fail with no coin (code 0x1001)', async function(){
    params = { "name": name, "overwrite": false}
    r = await raidajs.apiReceive(params)
    expect(r.code).to.equal(0x1001);
    })
    it('Receive should fail with no coin data (code 0x1002)', async function(){
    params = { "coin" : {}, "name": name, "overwrite": false}
    r = await raidajs.apiReceive(params)
    expect(r.code).to.equal(0x1002);
    })
    it('Receive should fail with fake coin (code 0x2001)', async function(){
  params = {"coin": coin, "name": name, "overwrite": false}
  r = await raidajs.apiReceive(params)
  expect(r.code).to.equal(0x2001);
    })

    it('embedImage should fail with no coin (code 0x1001)', async function(){
    params = { "cardnumber" : cardnumber, "expiration_date": expiration, "username": name, "cvv": cvv}
    r = await raidajs.embedImage(params)
    expect(r.code).to.equal(0x1001);
    })
    it('embedImage should fail with no coin data (code 0x1002)', async function(){
    params = {"cardnumber" : cardnumber, "expiration_date": expiration, "username": name, "cvv": cvv,"coin": {}}
    r = await raidajs.embedImage(params)
    expect(r.code).to.equal(0x1002);
    })
    it('embedImage should fail with fake coin (code 0x2001)', async function(){
  params = {"coin": coin, "cardnumber" : cardnumber, "expiration_date": expiration, "username": name, "cvv": cvv}
  r = await raidajs.embedImage(params)
  expect(r.code).to.equal(0x2001);
    })
    it('extractStack should fail with no coin (code 0x1001)', async function(){
    params = { "skywallet_name": name, "email": email}
    r = await raidajs.extractStack(params)
    expect(r.code).to.equal(0x1001);
    })
    it('extractStack should fail with no coin data (code 0x1002)', async function(){
    params = {"paycoin": {},"skywallet_name": name, "email": email}
    r = await raidajs.extractStack(params)
    expect(r.code).to.equal(0x1002);
    })
    it('extractStack should fail with fake coin (code 0x2001)', async function(){
  params = {"paycoin": coin, "skywallet_name": name, "email": email}
  r = await raidajs.extractStack(params)
  expect(r.code).to.equal(0x2001);
    })
    it('GetTicket should fail with no coin (code 0x1001)', async function(){
    params = { "name" : name}
    r = await raidajs.apiGetTicket(params)
    expect(r.code).to.equal(0x1001);
    })
    it('GetTicket should fail with no coin data (code 0x1002)', async function(){
    params = {"coin": {}, "name": name}
    r = await raidajs.apiGetTicket(params)
    expect(r.code).to.equal(0x1002);
    })
    it('GetTicket should fail with fake coin (code 0x2001)', async function(){
  params = {"coin": coin, "name" : name}
  r = await raidajs.apiGetTicket(params)
  expect(r.code).to.equal(0x2001);
    })
    it('ShowCoins should fail with no coin (code 0x1001)', async function(){
    params = { "name" : name}
    r = await raidajs.apiShowCoins(params)
    expect(r.code).to.equal(0x1001);
    })
    it('ShowCoins should fail with no coin data (code 0x1002)', async function(){
    params = {"coin": {}, "name": name}
    r = await raidajs.apiShowCoins(params)
    expect(r.code).to.equal(0x1002);
    })
    it('ShowCoins should fail with fake coin (code 0x2001)', async function(){
  params = {"coin": coin, "name" : name}
  r = await raidajs.apiShowCoins(params)
  expect(r.code).to.equal(0x2001);
    })



})

describe('successful runs', () => {

  let raidajs
  let fracked
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




    })
    after(async function() {
    })
    beforeEach(async function(){

    })
    afterEach(async function(){})

    it('Detect (code 0x0)', async function(){
    params = {"coin": coin}
    r = await raidajs.apiDetect(params)
    expect(r.code).to.equal(0x0);
    guid = r.guid
    })
    it('Send (code ?)', async function(){
    params = {"coin": fix}
    r = await raidajs.apiSend(params)
  })
  it('Receive (code 0x0)', async function(){
  params = {"coin": coin, "name": name, "overwrite": false}
  r = await raidajs.apiReceive(params)
  expect(r.code).to.equal(0x0);
  })
  it('embedImage (code 0x0)', async function(){
  params = { "coin": coin, "cardnumber" : cardnumber, "expiration_date": expiration, "username": name, "cvv": cvv}
  r = await raidajs.embedImage(params)
  expect(r.code).to.equal(0x0);
  })
  it('extractStack (code 0x0)', async function(){
  params = { "paycoin": coin, "skywallet_name": name, "email": email}
  r = await raidajs.extractStack(params)
  expect(r.code).to.equal(0x0);
  })
  it('apiGetTicket (code 0x0)', async function(){
  params = { "coin": coin, "name" : name}
  r = await raidajs.apiGetTicket(params)
  expect(r.code).to.equal(0x0);
  })
  it('ShowCoins (code 0x0)', async function(){
  params = { "coin": coin, "name" : name}
  r = await raidajs.apiShowCoins(params)
  expect(r.code).to.equal(0x0);
  })



  //raida down
  it('Detect (code 0x0) with 3 raida down', async function(){
  params = {"coin": coin}
  r = await raidajs.apiDetect(params, callback3Rdown)
  expect(r.code).to.equal(0x0);
  guid = r.guid
  })

it('Receive (code 0x0) with 3 raida down', async function(){
params = { "coin": coin, "name": name, "overwrite": false}
r = await raidajs.apiReceive(params, callback3Rdown)
expect(r.code).to.equal(0x0);
})
it('embedImage (code 0x0) with 3 raida down', async function(){
params = {"coin": coin, "cardnumber" : cardnumber, "expiration_date": expiration, "username": name, "cvv": cvv}
r = await raidajs.embedImage(params, callback3Rdown)
expect(r.code).to.equal(0x0);
})
it('extractStack (code 0x0) with 3 raida down', async function(){
params = { "paycoin": coin, "skywallet_name": name, "email": email}
r = await raidajs.extractStack(params, callback3Rdown)
expect(r.code).to.equal(0x0);
})
it('apiGetTicket (code 0x0) with 3 raida down', async function(){
params = { "coin": coin, "name" : name}
r = await raidajs.apiGetTicket(params, callback3Rdown)
expect(r.code).to.equal(0x0);
})
it('ShowCoins (code 0x0) with 3 raida down', async function(){
params = { "coin": coin, "name" : name}
r = await raidajs.apiShowCoins(params, callback3Rdown)
expect(r.code).to.equal(0x0);
})



//fracked coin
it('Detect (code 0x0) with fracked coin', async function(){
params = {"coin": fracked}
r = await raidajs.apiDetect(params)
expect(r.code).to.equal(0x0);
guid = r.guid
})

it('Receive (code 0x0) with fracked coin', async function(){
params = { "coin": fracked, "name": name, "overwrite": false}
r = await raidajs.apiReceive(params)
expect(r.code).to.equal(0x0);
})
it('embedImage (code 0x0) with fracked coin', async function(){
params = {"coin": fracked, "cardnumber" : cardnumber, "expiration_date": expiration, "username": name, "cvv": cvv}
r = await raidajs.embedImage(params)
expect(r.code).to.equal(0x0);
})
it('extractStack (code 0x0) with fracked coin', async function(){
params = { "paycoin": fracked, "skywallet_name": name, "email": email}
r = await raidajs.extractStack(params)
expect(r.code).to.equal(0x0);
})
it('apiGetTicket (code 0x0) with fracked coin', async function(){
params = { "coin": fracked, "name" : name}
r = await raidajs.apiGetTicket(params)
expect(r.code).to.equal(0x0);
})
it('ShowCoins (code 0x0) with fracked coin', async function(){
params = { "coin": fracked, "name" : name}
r = await raidajs.apiShowCoins(params)
expect(r.code).to.equal(0x0);
})


})
