const puppeteer = require('puppeteer')
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
