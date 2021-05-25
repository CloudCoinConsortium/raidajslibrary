const RaidaJS = require('raidajs').default
const expect = require('chai').expect


describe('test statements and records error codes', () => {

  let raidajs
  let coin
  let amount
  let event_code
  let initiator_type
  let memo
  let initiator_id
  let r
  let params
  let guid

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
  amount = 1
  event_code = 'send'
  initiator_type = 'self'
  guid = "0123456789ABCDEF0123456789ABCDEF"

    })
    after(async function() {
    })
    beforeEach(async function(){

    })
    afterEach(async function(){})

    it('CreateRecord should fail with no coin (code 0x1001)', async function(){
    params = { "amount": amount, "event_code" : event_code}
    r = await raidajs.apiCreateRecord(params)
    expect(r.code).to.equal(0x1001);
    })
    it('CreateRecord should fail with no coin data (code 0x1002)', async function(){
    params = {"coin": {}, "amount": amount}
    r = await raidajs.apiCreateRecord(params)
    expect(r.code).to.equal(0x1002);
    })
    it('CreateRecord should fail with no amount (code 0x1005)', async function(){
    params = {"coin": coin, "event_code": event_code}
    r = await raidajs.apiCreateRecord(params)
    expect(r.code).to.equal(0x1005);
    })
    it('CreateRecord should fail with invalid event code (code 0x1007)', async function(){
    params = {"coin": coin, "amount": amount, "event_code":"test"}
    r = await raidajs.apiCreateRecord(params)
    expect(r.code).to.equal(0x1007);
    })
    it('CreateRecord should fail with invalid initiator type (code 0x1008)', async function(){
    params = {"coin": coin, "amount": amount, "initiator_type": "test"}
    r = await raidajs.apiCreateRecord(params)
    expect(r.code).to.equal(0x1008);
    })
    it('CreateRecord should fail with invalid guid (code 0x1004)', async function(){
    params = {"coin": coin, "amount": amount, "event_code":event_code, "guid": "GHIJKLMONPQRS"}
    r = await raidajs.apiCreateRecord(params)
    expect(r.code).to.equal(0x1004);
    })
    it('CreateRecord should fail with fake coin (code 0x2001)', async function(){
  params = {"coin": coin, "amount": amount}
  r = await raidajs.apiCreateRecord(params)
  expect(r.code).to.equal(0x2001);
    })
    it('ShowRecords should fail with no coin (code 0x1001)', async function(){
    params = { }
    r = await raidajs.apiShowRecords(params)
    expect(r.code).to.equal(0x1001);
    })
    it('ShowRecords should fail with no coin data (code 0x1002)', async function(){
    params = {"coin": {}}
    r = await raidajs.apiShowRecords(params)
    expect(r.code).to.equal(0x1002);
    })
    it('ShowRecords should fail with invalid timestamp (code 0x1009)', async function(){
    params = {"coin": coin, "start_ts": -1}
    r = await raidajs.apiShowRecords(params)
    expect(r.code).to.equal(0x1009);
    })
    it('ShowRecords should fail with fake coin (code 0x2001)', async function(){
  params = {"coin": coin}
  r = await raidajs.apiShowRecords(params)
  expect(r.code).to.equal(0x2001);
    })
    it('DeleteRecord should fail with no coin (code 0x1001)', async function(){
    params = { }
    r = await raidajs.apiDeleteRecord(params)
    expect(r.code).to.equal(0x1001);
    })
    it('DeleteRecord should fail with no coin data (code 0x1002)', async function(){
    params = {"coin": {}, "guid": guid}
    r = await raidajs.apiDeleteRecord(params)
    expect(r.code).to.equal(0x1002);
    })
    it('DeleteRecord should fail with invalid guid (code 0x1004)', async function(){
    params = {"coin": coin,  "guid": "GHIJKLMONPQRS"}
    r = await raidajs.apiDeleteRecord(params)
    expect(r.code).to.equal(0x1004);
    })
    it('DeleteRecord should fail with no guid (code 0x1003)', async function(){
    params = {"coin": coin }
    r = await raidajs.apiDeleteRecord(params)
    expect(r.code).to.equal(0x1003);
    })
    it('DeleteRecord should fail with fake coin (code 0x2001)', async function(){
  params = {"coin": coin, "guid": guid}
  r = await raidajs.apiDeleteRecord(params)
  expect(r.code).to.equal(0x2001);
    })

})

describe('test statements and records', () => {

  let raidajs
  let coin
  let amount
  let event_code
  let initiator_type
  let memo
  let initiator_id
  let r
  let params
  let guid

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
  amount = 1
  event_code = 'send'
  initiator_type = 'self'
  guid = "0123456789ABCDEF0123456789ABCDEF"

    })
    after(async function() {
    })
    beforeEach(async function(){

    })
    afterEach(async function(){})

    it('createrecord (code 0x0)', async function(){
    params = {"coin": coin, "amount": amount}
    r = await raidajs.apiCreateRecord(params)
    expect(r.code).to.equal(0x0);
    guid = r.guid
    })
    it('showrecords (code 0x0)', async function(){
      coin.sn = 6379371
    params = {"coin": coin}
    r = await raidajs.apiShowRecords(params)
    expect(r.code).to.equal(0x0);
    //expect(r.metadata.filename).to.include("test.jpg");
  })
  it('deleterecord (code 0x0)', async function(){
  params = {"coin": coin, "guid": guid}
  r = await raidajs.apiDeleteRecord(params)
  expect(r.code).to.equal(0x0);
  })


})
