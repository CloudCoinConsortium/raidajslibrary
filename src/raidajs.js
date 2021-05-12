import axios from 'axios'
import qs from 'qs'
import CryptoJS from 'crypto-js'

import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";

import {version} from '../package.json';

import allSettled from 'promise.allsettled'

let _isBrowser = false
if (typeof(process.browser) !== 'undefined' && process.browser) {
  _isBrowser = true
}



class RaidaJS {
  // Contrustor
  constructor(options) {
    this.options = {
      domain : "cloudcoin.global",
      prefix : "raida",
      protocol: "https",
      timeout: 10000, // ms
      defaultCoinNn: 1,
      maxFailedRaidas: 5,
      changeMakerId: 2,
      debug: false,
      defaultRaidaForQuery: 7,
      defaultRaidaForBackupQuery: 14,
      ddnsServer: "ddns.cloudcoin.global",
      // max coins to transfer at a time
      maxCoins: 20000,
      maxCoinsPerIteraiton: 200,
      minPasswordLength: 8,
      memoMetadataSeparator: "*",
      nftMetadataSeparator: "*",
      minPassedNumToBeAuthentic: 14,
      maxFailedNumToBeCounterfeit: 12,
      syncThreshold: 13,
      freeCoinURL: "https://cloudcoin.global/freecoin.php",
      maxNFTSize: 6000000,
      billpayKey: "billpay",
      sentryDSN: null
    , ...options}

    this._raidaServers = []
    this._totalServers = 25
    this._generateServers()
    this._initAxios()

    this.__authenticResult = "authentic"
    this.__frackedResult = "fracked"
    this.__counterfeitResult = "counterfeit"
    this.__errorResult = "error"

    this._initNeighbours()

    this._crcTable = null

    this._rarr = {}

    this.requestId = this._generatePan()

    if (this.options.sentryDSN)
      this.initSentry()
  }

  

  // Init Sentry
  initSentry() {
    Sentry.init({
      dsn: this.options.sentryDSN,
      integrations: [
        new Integrations.BrowserTracing({
          tracingOrigins: ["localhost", /^\//, /raida.+\.cloudcoin\.global/]
        }),
      ],
      release: "raidajs@" + version,
      normalizeDepth: 10,
      sendDefaultPii: true,
      environment: "production",
      maxBreadcrumbs: 2000,
      autoSessionTracking: true,
      beforeBreadcrumb (breadcrumb, hint) {
        if (breadcrumb.category === 'console')
          return null

        if (breadcrumb.category === 'xhr') {
          breadcrumb.data.responseText = hint.xhr.responseText
        }
        return breadcrumb;
      },

      beforeSend(event, hint) {
        return event
      },

      tracesSampleRate: 1.0
    })

    let rqId = this.requestId
    Sentry.configureScope(function(scope) {
      scope.setTag("raida", "empty")
      scope.setTag("requestID", rqId)
    })

  
    Sentry.setContext("Request", {
      "raidaJSRequestID" : rqId
    })


    /*
    Sentry.withScope(function(scope) {
      console.log("CAPTURE")
      scope.setTag("raida", "14")
      scope.setLevel("warning")
      Sentry.captureException(new Error("my error"))
    })

      Sentry.captureMessage("Hello")
    */
  }

  addBreadCrumb(msg, data = null) {
    if (!this.options.sentryDSN)
      return

    Sentry.addBreadcrumb({
      category: 'custom',
      message: msg,
      level: 'info',
      type: 'user',
      data: {'rjsdata' : JSON.stringify(data) }
    });
  }

  addBreadCrumbEntry(msg, data = null) {
    if (!this.options.sentryDSN)
      return

    Sentry.addBreadcrumb({
      category: 'entry',
      message: msg,
      level: 'info',
      type: 'user',
      data: {'rjsdata' : JSON.stringify(data) }
    });
  }

  addBreadCrumbReturn(msg, data = null) {
    if (!this.options.sentryDSN)
      return

    Sentry.addBreadcrumb({
      category: 'return',
      message: msg,
      level: 'info',
      type: 'user',
      data: {'rjsdata' : JSON.stringify(data) }
    });
  }


  addBreadCrumbError(msg) {
    if (!this.options.sentryDSN)
      return

    Sentry.addBreadcrumb({
      category: 'custom',
      message: msg,
      level: 'error',
      type: 'user'
    });
  }

  addSentryError(msg, raida = "unknown", data = null) {
    if (!this.options.sentryDSN)
      return

    this.addBreadCrumbError("Reporting Error. RequestID " + this.requestId)
    Sentry.withScope(function(scope) {
      scope.setLevel("error")
      scope.setTag("raida", raida)
      scope.setExtra("raidaServer", raida)
      scope.setExtra("data", JSON.stringify(data))
      Sentry.captureException(new Error(msg))
    })
  }

  // Get denomination
  getDenomination(sn) {
    if (sn < 1)
      return 0

    if (sn < 2097153)
      return 1

    if (sn < 4194305)
      return 5

    if (sn < 6291457)
      return 25

    if (sn < 14680065)
      return 100

    if (sn < 16777217)
      return 250

    return 0
  }
  
  // RAIDA to query for SkyWallet creation
  setDefaultRAIDA(raidaNum) {
    this.options.defaultRaidaForQuery = raidaNum
  }

  // Timeout for requests in milliseconds
  setTimeout(timeout) {
    this.options.timeout = timeout
    this._initAxios()
  }

  // Timeout for requests in milliseconds
  setDomain(domain) {
    this.options.domain = domain
    this._generateServers()
  }

  // Set RAIDA Protocol
  setProtocol(protocol) {
    this.options.protocol = protocol
    this._generateServers()
  }

  // Network number
  setDefaultNetworkNumber(nn) {
    this.options.defaultCoinNn = nn
  }

  // Return the array of raida servers
  getServers() {
    return this._raidaServers
  }

  /*** RAIDA SERVICES API ***/

  // Echo
  apiEcho(callback = null) {
    this.addBreadCrumbEntry("apiEcho")

    let rqs = this._launchRequests("echo", {}, 'GET', callback)
    let rv = {
      status: 'done',
      onlineServers : 0,
      totalServers: this._totalServers,
      details : []
    }
    
    let mainPromise = rqs.then(response => {
      this._parseMainPromise(response, 0, rv, serverResponse => {
        if (serverResponse === "error")
          return

        if (serverResponse.status === "ready") {
          rv['onlineServers']++;
        }
      })

      this.addBreadCrumbReturn("apiEcho", rv)

      return rv
    })
    
    return mainPromise
  }

  // Detect
  apiDetect(params, callback = null) {
    this.addBreadCrumbEntry("apiDetect", params)

    if (!Array.isArray(params)) {
      console.error("Invalid input data")
      return null
    }
    
    let rqdata = this._formRequestData(params)

    // Launch Requests
    let rqs = this._launchRequests("multi_detect", rqdata, 'POST', callback)

    let rv = this._getGenericMainPromise(rqs, params).then(response => {
      this.addBreadCrumbReturn("apiDetect", response)

      return response
    })


    return rv
  }

  // Deletes a statement from the RAIDA
  async apiDeleteRecord(params, callback = null) {
    if (!('coin' in params))
      return this._getErrorCode(RaidaJS.ERR_PARAM_MISSING_COIN, "Coin in missing")

    if (!('guid' in params))
      return this._getErrorCode(RaidaJS.ERR_PARAM_MISSING_GUID, "GUID in missing")

    let guid = params['guid']
    if (!this._validateGuid(guid))
      return this._getErrorCode(RaidaJS.ERR_PARAM_INVALID_GUID, "Invalid GUID")

    let coin = params['coin']
    if (!this._validateCoin(coin)) {
      return this._getErrorCode(RaidaJS.ERR_PARAM_INVALID_COIN, "Failed to validate coin")
    }

    let rqdata = []
    for (let i = 0; i < this._totalServers; i++) {
      rqdata.push({
        'sn' : coin.sn,
        'an' : coin.an[i],
        'statement_id': params.guid
      })
    }

    let rv = {
      'code' : RaidaJS.ERR_NO_ERROR,
      'text' : "Deleted successfully"
    }

    let a, e, f
    a = f = e = 0
    let rqs = this._launchRequests("statements/delete", rqdata, 'GET', callback)
    let mainPromise = rqs.then(response => {
      this._parseMainPromise(response, 0, rv, (serverResponse, rIdx) => {
        console.log("deleted")
        console.log(serverResponse)
        if (serverResponse === "error" || serverResponse == "network") {
          e++
          return
        }
        if (serverResponse.status == "success") {
          a++
          return
        }
        if (serverResponse.status == "fail") {
          f++
          return
        }

        e++
      })
      let result = this._gradeCoin(a, f, e)
      if (!this._validResult(result))
        return this._getErrorCode(RaidaJS.ERR_RESPONSE_TOO_FEW_PASSED, "Failed to delete statement. Too many error responses from RAIDA")

        return rv
    })

    return mainPromise    

  }

  // Reads statements from the RAIDA
  async apiShowRecords(params, callback = null) {
    if (!('coin' in params))
      return this._getErrorCode(RaidaJS.ERR_PARAM_MISSING_COIN, "Coin in missing")

    let coin = params['coin']
    if (!this._validateCoin(coin)) {
      return this._getErrorCode(RaidaJS.ERR_PARAM_INVALID_COIN, "Failed to validate coin")
    }

    let ts = 0
    if ('start_ts' in params) {
      if (ts < 0 || ts > 1919445247) {
        return this._getErrorCode(RaidaJS.ERR_PARAM_INVALID_TIMESTAMP, "Invalid Timestamp")
      }
      ts = params['start_ts']
    }

    let rqdata = []
    for (let i = 0; i < this._totalServers; i++) {
      rqdata.push({
        'sn' : coin.sn,
        'an' : coin.an[i],
        'return' : 'all',
        'start_date': ts
      })
    }

    let rv = {
      'code' : RaidaJS.ERR_NO_ERROR,
      'text' : "Records returned",
      'records' : []
    }

    let e, a, f
    e = a = f = 0
    let statements = {}
    let serverResponses = []
    let rqs = this._launchRequests("statements/read", rqdata, 'GET', callback)
    let mainPromise = rqs.then(response => {
      this._parseMainPromise(response, 0, rv, (serverResponse, rIdx) => {
        if (serverResponse === "error" || serverResponse == "network") {
          e++
          serverResponses.push(null)
          return
        }

        if (serverResponse.status == "success") {
          if (!('data' in serverResponse)) {
            e++
            serverResponses.push(null)
            return
          }

          let data = serverResponse.data
          if (!Array.isArray(data)) {
            e++
            serverResponses.push(null)
            return
          }

          serverResponses.push(serverResponse)

          let mparts = []
          for (let r = 0; r < data.length; r++) {
            let ldata = data[r]
            if (typeof(ldata) == 'undefined')
              continue

            if (!('stripe' in ldata) || !('mirror' in ldata) || !('mirror2' in ldata))  {
              continue
            }

            if (!('statement_id' in ldata))
              continue

            let key = ldata.statement_id
            if (!(key in statements)) {
              statements[key] = {}
              statements[key]['ldata'] = ldata
              statements[key]['mparts'] = []
            }

            statements[key]['mparts'][rIdx] = {}
            statements[key]['mparts'][rIdx]['stripe'] = ldata.stripe
            statements[key]['mparts'][rIdx]['mirror1'] = ldata.mirror
            statements[key]['mparts'][rIdx]['mirror2'] = ldata.mirror2
          }

          a++
          return
        }

        if (serverResponse.status == "fail") {
          serverResponses.push(null)
          f++
          return
        }

        serverResponses.push(null)
        e++
      })

      for (let statement_id in statements) {
        let item = statements[statement_id]
        let odata = this._getDataFromObjectMemo(item.mparts)
        if (odata == null) {
          console.log("Failed to assemble statement " + statement_id + " Not enough valid responses")
          continue
        }

        rv.records.push(odata)
      }

      // Fire-and-forget (if neccessary)
      this._syncAdd(serverResponses, "statement_id", "statements/sync/sync_add")
      this._syncDelete(serverResponses, "statement_id", "statements/sync/sync_delete")

      let result = this._gradeCoin(a, f, e)
      if (!this._validResult(result))
        return this._getError("Failed to get statements. Too many error responses from RAIDA")

      return rv
    })

    return mainPromise;

  }

  // Creates a statement on the RAIDA
  async apiCreateRecord(params, callback = null) {
    this.addBreadCrumbEntry("apiCreateRecord", params)
    if (!('coin' in params))
      return this._getErrorCode(RaidaJS.ERR_PARAM_MISSING_COIN, "Coin in missing")

    if (!('amount' in params))
      return this._getErrorCode(RaidaJS.ERR_PARAM_MISSING_AMOUNT, "Amount in missing")

    let coin = params['coin']
    if (!this._validateCoin(coin)) {
      return this._getErrorCode(RaidaJS.ERR_PARAM_INVALID_COIN, "Failed to validate coin")
    }

    let guid = this._generatePan()
    if ('guid' in params) {
      guid = params['guid']
      if (!this._validateGuid(guid)) {
        return this._getErrorCode(RaidaJS.ERR_PARAM_INVALID_GUID, "Failed to validate GUID")
      }
    }

    let memo = "Transfer from " + coin.sn
    if ('memo' in params)
      memo = params['memo']

    let event_code = "send"
    if ('event_code' in params) {
      event_code = params['event_code']
      if (!this._validateEventCode(event_code)) {
        return this._getErrorCode(RaidaJS.ERR_PARAM_INVALID_EVENT_CODE, "Failed to validate Event Code")
      }
    }

    let itype = "self"
    if ('initiator_type' in params) {
      itype = params['initiator_type']
      if (!this._validateInitiatorType(itype)) {
        return this._getErrorCode(RaidaJS.ERR_PARAM_INVALID_INITIATOR_TYPE, "Failed to validate Initiator type")
      }
    }

    let iid = "From SN " + coin.sn
    if ('initiator_id' in params)
      iid = params['initiator_id']

    let iimage_url = ""
    if ('initiator_image_url' in params)
      iid = params['initiator_image_url']

    let idescription_url = ""
    if ('initiator_description_url' in params)
      idescription_url = params['initiator_description_url']

    let rqdata = []
    let amount = params.amount
    let tags = this._getStripesMirrorsForObject({
      'guid' : guid,
      'memo' : memo,
      'amount' : amount,
      'initiator_id' : iid,
      'initiator_image_url' : iimage_url,
      'initiator_description_url' : idescription_url,
      'initiator_type' : itype
    })
    for (let i = 0; i < this._totalServers; i++) {
      rqdata.push({
        'account_sn' : coin.sn,
        'account_an' : coin.an[i],
        'transaction_id': guid,
        'version': 0,
        'compression' : 0,
        'raid' : '110',
        'stripe' : tags[i]['stripe'],
        'mirror' : tags[i]['mirror1'],
        'mirror2' : tags[i]['mirror2']
      })
    }

    let rv = {
      'code' : RaidaJS.ERR_NO_ERROR,
      'guid' : guid,
      'text' : "Created successfully"
    }

    let passed = 0
    let a, f, e
    a = f = e = 0
    let rqs = this._launchRequests("statements/create", rqdata, 'GET', callback)
    let mainPromise = rqs.then(response => {
      this._parseMainPromise(response, 0, rv, serverResponse => {
        if (serverResponse === "error" || serverResponse == "network") {
          e++
          return
        }
        if (serverResponse.status == "success") {
          a++
        }
        if (serverResponse.status == "fail") {
          f++
        }
      })

      let result = this._gradeCoin(a, f, e)
      if (!this._validResult(result))
        return this._getErrorCode(RaidaJS.ERR_RESPONSE_TOO_FEW_PASSED, "Failed to create statement. Too many error responses from RAIDA")

      return rv

    })

    this.addBreadCrumbReturn("apiCreateStatement", rv)

    return mainPromise
  }

  async _getDefaultTicket(cc, callback) {
    let response = await this.apiGetticket(cc, callback)
    if (response.status != "done")
      return null

    let rquery = this.options.defaultRaidaForQuery
    let ticket = response.tickets[rquery]
    if (ticket == 'error' || ticket == 'network') {
      rquery = this.options.defaultRaidaForBackupQuery
      ticket = response.tickets[rquery]
      console.log("doing backup tickets")
      if (ticket == 'error' || ticket == 'network') {
        return null
      }
    }

    return [ticket, rquery]
  }

  // Delete DNS
  async apiDeleteSkyWallet(params, callback = null) {
    this.addBreadCrumbEntry("apiDeleteSkyWallet", params)

    if (!('coin' in params))
      return this._getErrorCode(RaidaJS.ERR_PARAM_MISSING_COIN, "Coin in missing")

    if (!('name' in params))
      return this._getErrorCode(RaidaJS.ERR_PARAM_MISSING_DNS_NAME, "DNS Name in missing")

    let coin = params['coin']
    if (!this._validateCoin(coin)) {
      return this._getErrorCode(RaidaJS.ERR_PARAM_INVALID_COIN, "Failed to validate coin")
    }

    let tdata = await this._getDefaultTicket(params['coin'], callback)
    if (tdata == null) {
       return this._getErrorCode(RaidaJS.ERR_FAILED_TO_GET_TICKETS, "Failed to get ticket from RAIDA" + this.options.defaultRaidaForQuery + " and backup raida " + this.options.defaultRaidaForBackupQuery)
    }

    if (callback != null)
      callback(0, "deleting_dns")

    let ticket = tdata[0]
    let rquery = tdata[1]
    let name = params['name']

    console.log("got delete ticket " + ticket)

    let url =  "https://" + this.options.ddnsServer + "/service/ddns/ddns_delete.php?"
    url += "sn=" + coin.sn + "&username=" + name + "&ticket=" + ticket + "&raidanumber=" + rquery
    let response = await this._axInstance.get(url)
    if (response.status != 200)
      return this._getErrorCode(RaidaJS.ERR_DNS_SERVER_INCORRECT_RESPONSE, "DNSService returned wrong code: " + response.status)

    let data = response.data
    if (!('status' in data)) 
      return this._getErrorCode(RaidaJS.ERR_DNS_SERVER_INCORRECT_RESPONSE, "DNSService returned wrong data. No status found")

    if (data.status != 'success') {
      let msg = data.status
      if ('errors' in data) {
        if (data.errors.length != 0) {
          msg += " " + data.errors[0]['message']
        }
      }
      return this._getErrorCode(RaidaJS.ERR_DNS_SERVER_INCORRECT_RESPONSE, "DNSService returned incorrect status: " + msg)
    }

    this.addBreadCrumbReturn("apiDeleteSkyWallet", "done")
    return {
      // Legacy
      'code' : RaidaJS.ERR_NO_ERROR,
      'text' : "Registered Successfully"
    }

  }

  // Register DNS
  async apiRegisterSkyWallet(params, callback = null) {
    this.addBreadCrumbEntry("apiRegisterSkyWallet", params)

    if (!('coin' in params))
      return this._getErrorCode(RaidaJS.ERR_PARAM_MISSING_COIN, "Coin in missing")

    if (!('name' in params))
      return this._getErrorCode(RaidaJS.ERR_PARAM_MISSING_DNS_NAME, "DNS Name in missing")

    let coin = params['coin']
    if (!this._validateCoin(coin)) {
      return this._getErrorCode(RaidaJS.ERR_PARAM_INVALID_COIN, "Failed to validate coin")
    }

    if (callback != null)
      callback(0, "resolve_dns")

    let name = await this._resolveDNS(params['name'])
    if (name != null) {
      if ('overwrite' in params && params['overwrite'] == true) {
        let rv = await this.apiDeleteSkyWallet(params, callback)
        if (rv.code != RaidaJS.ERR_NO_ERROR) {
          return rv
        }
      } else {
        return this._getErrorCode(RaidaJS.ERR_DNS_RECORD_ALREADY_EXISTS, "DNS name already exists")
      }
    }

    name = params['name']
        console.log("waited3")

    let tdata = await this._getDefaultTicket(params['coin'], callback)
    if (tdata == null) {
        return this._getErrorCode(RaidaJS.ERR_FAILED_TO_GET_TICKETS, "Failed to get ticket from RAIDA" + this.options.defaultRaidaForQuery + " and backup raida " + this.options.defaultRaidaForBackupQuery)
    }

    let ticket = tdata[0]
    let rquery = tdata[1]

    console.log("got ticket " + ticket)

    if (callback != null)
      callback(0, "register_dns")

    let url =  "https://" + this.options.ddnsServer + "/service/ddns/ddns.php?"
    url += "sn=" + coin.sn + "&username=" + name + "&ticket=" + ticket + "&raidanumber=" + rquery
    let response = await this._axInstance.get(url)
    if (response.status != 200)
      return this._getErrorCode(RaidaJS.ERR_DNS_SERVER_INCORRECT_RESPONSE, "DNSService returned wrong code: " + response.status)

    let data = response.data
    if (!('status' in data)) 
      return this._getErrorCode(RaidaJS.ERR_DNS_SERVER_INCORRECT_RESPONSE, "DNSService returned wrong data. No status found")

    if (data.status != 'success') {
      let msg = data.status
      if ('errors' in data) {
        if (data.errors.length != 0) {
          msg += " " + data.errors[0]['message']
        }
      }
      return this._getErrorCode(RaidaJS.ERR_DNS_SERVER_INCORRECT_RESPONSE, "DNSService returned incorrect status: " + msg)
    }

    this.addBreadCrumbReturn("apiRegisterSkyWallet", "done")
    return {
      // Legacy
      'status' : 'done',

      'code' : RaidaJS.ERR_NO_ERROR,
      'text' : "Registered Successfully"
    }
  }

  // View receipt
  async apiViewreceipt(params, callback = null) {
    this.addBreadCrumbEntry("apiViewReceipt", params)

    let coin = params
    if (!'account' in params || !'tag' in params) {
      return this._getError("Account and Tag required")
    }

    if (params.account < 1 || params.account > 16777216)
      return this._getError("Invalid Account")

      
    if (!params.tag.match(/^[a-fA-F0-9]{32}$/))
      return this._getError("Invalid Tag UUID")
    
    let rqdata = []
    for (let i = 0; i < this._totalServers; i++) {
      rqdata.push({
        account: params.account,
        tag: params.tag,
      })
    }

    let rqs = this._launchRequests("view_receipt", rqdata, 'GET', callback)
    let rv = {
      'status' : 'done',
      'sns' : {},
      'details' : [],
      'total' : 0
    }
    let mainPromise = rqs.then(response => {
      for (let i = 0; i < response.length; i++) {
        if (typeof(response[i].value) == 'undefined')
          continue

        if (typeof(response[i].value.data) != 'object')
          continue

        response[i].value.data.status = "pass"
      }

      this._parseMainPromise(response, 0, rv, serverResponse => {
        if (typeof(serverResponse) != 'object')
          return

        if ('serial_numbers' in serverResponse) {
          let sns = serverResponse['serial_numbers'].split(',')
          for (let i = 0; i < sns.length; i++) {
            let sn = sns[i].trim()
            if (sn == "")
              continue

            if (!(sn in rv.sns))
              rv.sns[sn] = 0

            rv.sns[sn]++
          }
        }

      })

      rv.sns = Object.keys(rv.sns).filter(item => rv.sns[item] > (this._totalServers - this.options.maxFailedRaidas) )
      for (let sn of rv.sns)
        rv.total += this.getDenomination(sn)

      return rv

    })
    
    return mainPromise
  }

  // Get Ticket (no multi)
  async apiGetticket(params, callback = null) {
    this.addBreadCrumbEntry("apiGetTicket", params)

    let coin = params
    if (!this._validateCoin(coin)) {
      return this._getError("Failed to validate params")
    }

    let rqdata = []
    for (let i = 0; i < this._totalServers; i++) {
      rqdata.push({
        sn: coin.sn,
        nn: coin.nn,
        an: coin.an[i],
        pan: coin.pan[i],
        denomination: this.getDenomination(coin.sn),
      })
    }

    let rqs = this._launchRequests("get_ticket", rqdata, 'GET', callback)
    let rv = {
      'status' : 'done',
      'tickets' : []
    }
    let mainPromise = rqs.then(response => {
      this._parseMainPromise(response, 0, rv, serverResponse => {
        if (serverResponse.status == 'ticket') {
          rv.tickets.push(serverResponse.message)
        } else {
          rv.tickets.push("error")
        }
      })

      return rv
    })
    
    return mainPromise
  }

  // SuperFix
  async _realSuperFix(rIdx, coins, callback = null) {
    let rqdata = this._formRequestData(coins)
    for (let i = 0; i < this._totalServers; i++)
      rqdata[i]['b'] = 't'

    let rv = {
      'fixedcoins' : []
    }

    rqs = this._launchRequests("multi_detect", rqdata, 'POST', callback)
    let resultData = await this._getGenericBriefMainPromise(rqs, coins)
    console.log("mdata")
    console.log(resultData)
    if (resultData.status != "done") {
      rv.notfixed = coins.length
      return rv
    }

    if (!('tickets' in resultData)) {
      return rv
    }

    console.log(resultData)
    let sns = []
    let pans = []
    let tickets = []
    for (let sn in resultData['result']) {
      let coin = resultData['result'][sn]
      if (coin.result != this.__frackedResult) {
        continue
      }

      sns.push(coin.sn)
      pans.push(coin.an[rIdx])
    }

    if (sns.length == 0)
      return rv

    for (let i = 0; i < this._totalServers; i++) {
      let ticket = resultData.tickets[i]

      if (!ticket || i == rIdx) {
        tickets[i] = false
        continue
      }

      tickets[i] = ticket
    }

    rqdata = []
    for (let i = 0; i < this._totalServers; i++) {
      rqdata[i] = {
        'sn' : sns,
        'pan' : pans,
        'r' : tickets
      }
    }

    let a, f, e
    a = f = e = 0
    console.log("Doing sfix")
    console.log(rqdata)
    let rqs = this._launchRequests("super_fix", rqdata, 'GET', callback, [rIdx])
    let sfixResultData = await this._getGenericBriefMainPromise(rqs, coins)
    if (sfixResultData.status != "done") {
      return rv
    }

    for (let sn in sfixResultData.result) {
      let result = sfixResultData.result[sn]

      if (result.authentic == 1) {
        rv.fixedcoins.push(sn)
      }
    }

    return rv
  }

  // FixFracked
  async apiFixfracked(params, callback = null) {
    this.addBreadCrumbEntry("apiFixFracked", params)

    let coins = []
    let superfixCoins = []

    // Filter out fracked coins
    for (let k in params) {
      let coin = params[k]

      if (!('pownstring' in coin))
        continue

      if (!('result' in coin))
        continue

      if (coin.result != this.__frackedResult)
        continue

      if (!this._validateCoin(coin))
        continue

      coin.pownArray = coin.pownstring.split("")
      coin.pownstring = ""

      let fc = 0
      let needSuperfix = false
      for (let x = 0; x < this._totalServers; x++) {
        if (coin.pownArray[x] == 'f') {
          fc++
          if (fc == 5) {
            superfixCoins.push(coin)
            needSuperfix = true
            break
          }
          //coin.an[x] = this._generatePan()
          //coin.pan[x] = coin.an[x]
        } else {
          fc = 0
        }
      }

      if (needSuperfix)
        continue

      coins.push(coin)
    }

    let rv = {
      status: 'done',
      totalNotes: coins.length,
      fixedNotes: 0,
      result : {},
    }

    // Coins for Superfix. Very slow.
    if (superfixCoins.length > 0) {
      for (let i = 0; i < this._totalServers; i++) {
        let ctfix = []
        for (let j = 0; j < superfixCoins.length; j++) {
          if (superfixCoins[j].pownArray[i] != 'f')
            continue;

          ctfix.push(superfixCoins[j])
        }

        if (ctfix.length != 0) {
          // Doing SuperFix
          let srv = await this._realSuperFix(i, ctfix, callback)

          for (let v = 0; v < srv.fixedcoins.length; v++) {
            let sn = srv.fixedcoins[v]
            // Find coin by SN
            for (let c = 0; c < superfixCoins.length; c++) {
              if (superfixCoins[c].sn == sn) {
                superfixCoins[c].an[i] = superfixCoins[c].pan[i]
                superfixCoins[c].pownArray[i] = 'p'
              }
            }
          }
        }
      }
    }

    // Round 1
    for (let i = 0; i < this._totalServers; i++) {
      let ctfix = []
      for (let j = 0; j < coins.length; j++) {
        if (coins[j].pownArray[i] != 'f')
          continue;

        ctfix.push(coins[j])
      }
  
      if (ctfix.length != 0) {
        await this._realFix(0, i, ctfix, callback)
      }
    }

    // Round 2
    for (let i = this._totalServers - 1; i >= 0; i--) {
      let ctfix = []
      for (let j = 0; j < coins.length; j++) {
        if (coins[j].pownArray[i] != 'f')
          continue;

        ctfix.push(coins[j])
      }
      if (ctfix.length != 0) {
        await this._realFix(1, i, coins, callback)
      }
    }


    // Form the result after all fixings are done
    let a, c, e
    for (let i = 0; i < coins.length; i++) {
      a = c = e = 0
      // Go over pownArray
      for (let j = 0; j < coins[i].pownArray.length; j++) {
        if (coins[i].pownArray[j] == 'p')
          a++;
        else if (coins[i].pownArray[j] == 'f')
          c++;
        else 
          e++;

        coins[i].pownstring += coins[i].pownArray[j]
        coins[i].errors = e
        coins[i].authentic = a
        coins[i].counterfeit = c
      }

      delete coins[i].pownArray
      delete coins[i].pan
      if (c == 0 && e == 0) {
        coins[i].result = "fixed"
        rv.fixedNotes++
      }

      rv.result[coins[i].sn] = coins[i]
    }

    // Append SuperFix results
    for (let i = 0; i < superfixCoins.length; i++) {
      a = c = e = 0
      // Go over pownArray
      for (let j = 0; j < superfixCoins[i].pownArray.length; j++) {
        if (superfixCoins[i].pownArray[j] == 'p')
          a++;
        else if (superfixCoins[i].pownArray[j] == 'f')
          c++;
        else 
          e++;

        superfixCoins[i].pownstring += superfixCoins[i].pownArray[j]
        superfixCoins[i].errors = e
        superfixCoins[i].authentic = a
        superfixCoins[i].counterfeit = c
      }

      delete superfixCoins[i].pownArray
      delete superfixCoins[i].pan
      if (c == 0 && e == 0) {
        superfixCoins[i].result = "fixed"
        rv.fixedNotes++
      }

      rv.result[superfixCoins[i].sn] = superfixCoins[i]
    }


    this.addBreadCrumbReturn("apiFixFracked", rv)
    return rv
  }

  // Get CC by Card Number and CVV
  async apiGetCCByCardData(params) {
    this.addBreadCrumbEntry("apiGetCCByCardData", params)

    if (!('cardnumber' in params))
      return this._getError("Card Number is not defined")

    if (!('cvv' in params))
      return this._getError("CVV is not defined")

    if (!('username' in params))
      return this._getError("Username is not defined")

    let cardNumber = params['cardnumber']
    let cvv = params['cvv']
    let username = params['username']
    if (!this._validateCard(cardNumber, cvv))
      return this._getError("Invalid Card")

    let sn = await this._resolveDNS(username)
    if (sn == null)
      return this._getError("Failed to resolve DNS")

    let part = cardNumber.substring(3, cardNumber.length - 1)
    let ans = []
    for (let i = 0; i < 25; i++) {
      let seed = "" + i + sn + part + cvv
      ans[i] = "" + CryptoJS.MD5(seed)
    }

    let rv = {
      status: 'done',
      'cc' : {
        nn: 1,
        sn: sn,
        an: ans
      }
    }
    
    this.addBreadCrumbReturn("apiGetCCByCardData", rv)
    return rv
    
  }

  // Greates a CloudCoin by Username, Password and Email
  async apiCreateCCForRegistration(params) {
    this.addBreadCrumbEntry("apiCreateCCForRegistration", params)

    if (!('sn' in params))
      return this._getError("SN is not defined")

    if (!('password' in params))
      return this._getError("Password is not defined")

    if (!('email' in params))
      return this._getError("Email is not defined")

    let password = params['password']
    let email = params['password']
    if (password.length < this.options.minPasswordLength)
      return this._getError("Password length must be at least 16 characters")

    let sn = params['sn']
    let finalStr = ""
    let tStr = "" + CryptoJS.MD5(password)
    let tChars = tStr.split('');
    for (let c = 0; c < tChars.length; c++) {
      let cs = parseInt(tChars[c], 16)
      finalStr += cs
    }

     // Generating rand and pin from the password
    const rand = finalStr.slice(0, 12);
    const pin = finalStr.slice(12, 16);
    const pans = [];
    for (let i = 0; i < 25; i++) {
      const seed = '' + i + sn + rand + pin;
      const p = '' + CryptoJS.MD5(seed);

      const p0 = p.substring(0, 24);
      let component = '' + sn + '' + i + email;
      component = '' + CryptoJS.MD5(component);
      const p1 = component.substring(0, 8);
      pans[i] = p0 + p1;
    }

    const grv = {
      "status": "done",
      "pans" : pans, 
      "rand" : rand, 
      "cvv" : pin
    };
  
    this.addBreadCrumbReturn("apiCreateCCForRegistration", grv)

    return grv;
  }

  // Get CC by username and Password
  async apiGetCCByUsernameAndPassword(params) {
    this.addBreadCrumbEntry("apiGetCCByUsernameAndPassword", params)

    if (!('username' in params))
      return this._getError("Username is not defined")

    if (!('password' in params))
      return this._getError("Password is not defined")

    let username = params['username']
    let password = params['password']
    if (password.length < this.options.minPasswordLength)
      return this._getError("Password length must be at least 16 characters")

    let name = await this._resolveDNS(username)
    if (name == null)
      return this._getError("Failed to resolve DNS")

    let sn = name
    let finalStr = ""
    let tStr = "" + CryptoJS.MD5(password)
    let tChars = tStr.split('');
    for (let c = 0; c < tChars.length; c++) {
      let cs = parseInt(tChars[c], 16)
      finalStr += cs
    }

    // Generating rand and pin from the password
    let rand = finalStr.slice(0, 12)
    let pin = finalStr.slice(12, 16)
    let pans = []
    for (let i = 0; i < this._totalServers; i++) {
      let seed = "" + i + sn + rand + pin
      pans[i] = "" + CryptoJS.MD5(seed)
    }

    let cc = {
      'sn' : sn,
      'nn' : 1,
      'an' : pans
    }

    let rvFinal = {
      'status' : 'done',
      'cc' : cc
    }

    this.addBreadCrumbReturn("apiGetCCByUsernameAndPassword", rvFinal)

    return rvFinal

  }

  // extract stack from PNG
  async extractStack(params) {
    this.addBreadCrumbEntry("apiExtractStack", params)

    if (!('template' in params)) {
      return this._getError("Template is not defined")
    }

    let isError = false
    let imgAx = axios.create()
    let response = await imgAx.get(params['template'], {
      responseType: 'arraybuffer'
    }).catch(error => {
      isError = true
    })
    
    if (isError)
      return this._getError("Failed to load image")

    if (response.status != 200) 
      return this._getError("Server returned non-200 HTTP code: " + response.status)

    let arrayBufferData = response.data

    let imgData = new Uint8Array(arrayBufferData)
    let idx = this._basePngChecks(imgData)
    if (typeof(idx) == 'string')
      return this._getError(idx)

    let fu8
    fu8 = imgData.slice(idx + 4)

    let i = 0
    let length
    while (true) {
      length = this._getUint32(fu8, i)
      let signature = String.fromCharCode(fu8[i + 4]) +  String.fromCharCode(fu8[i + 5]) 
        + String.fromCharCode(fu8[i + 6]) +  String.fromCharCode(fu8[i + 7])

      if (length == 0) {
        i += 12
        if (i >= fu8.length) {
          return this._getError("CloudCoin was not found")
          break
        }
        continue
      }

      if (signature == 'cLDc') {
        let crcSig = this._getUint32(fu8, i + 8 + length)
        let calcCrc = this._crc32(fu8, i + 4, length + 4)
        if (crcSig != calcCrc) {
          return this._getError("Corrupted PNG. Invalid Crc32")
        }

        break
      }

      // length + type + crc32 = 12 bytes
      i += length + 12
      if (i > fu8.length) {
        return this._getError("CloudCoin was not found")
        break
      }

    }

    let data = fu8.slice(i + 8, i + 8 + length)
    let sdata = ""
    for (let i = 0; i < data.length; i++)
      sdata += String.fromCharCode(data[i])

    let o 
    try {
      o = JSON.parse(sdata)
    } catch(e) {
      return this._getError("Failed to parse CloudCoin JSON")
    }

    let rv = {
      'status' : 'done',
      ...o
    }

    return rv
  }

  // embed stack into image
  async embedInImage(params) {
    this.addBreadCrumbEntry("apiEmbedInImage", params)

    if (!'template' in params) {
      return this._getError("Template is not defined")
    }

    if (!'coins' in params) {
      return this._getError("Invalid input data. No coins")
    }

    if (!Array.isArray(params['coins'])) {
      return this._getError("Invalid input data. Coins must be an array")
    }

    for (let i in params['coins']) {
      let coin = params['coins'][i]
      if (!this._validateCoin(coin)) {
        return this._getError("Failed to validate coins")
      }
      delete params['coins'][i]['pan']
    }
    let data = { "cloudcoin" : params['coins'] }
    data = JSON.stringify(data)

    let isError = false
    let imgAx = axios.create()
    let response = await imgAx.get(params['template'], {
      responseType: 'arraybuffer'
    }).catch(error => {
      isError = true
    })
    
    if (isError)
      return this._getError("Failed to load image")

    if (response.status != 200) 
      return this._getError("Server returned non-200 HTTP code: " + response.status)

    let arrayBufferData = response.data

    let imgData = new Uint8Array(arrayBufferData)
    let idx = this._basePngChecks(imgData)
    if (typeof(idx) == 'string')
      return this._getError(idx)

    let fu8, lu8, myu8
    fu8 = imgData.slice(0, idx + 4)
    lu8 = imgData.slice(idx + 4)

    let ccLength = data.length

    // length + type + crc32 = 12 bytes
    myu8 = new Uint8Array(ccLength + 12)

    // Length
    this._setUint32(myu8, 0, ccLength)

    // Chunk type cLDc
    myu8[4] = 0x63
    myu8[5] = 0x4c
    myu8[6] = 0x44
    myu8[7] = 0x63

    let tBuffer = Buffer.from(data)
    // Data
    for (let i = 0; i < ccLength; i++) {
      myu8[i + 8] = tBuffer.readUInt8(i)
    }

    // Crc32
    let crc32 = this._crc32(myu8, 4, ccLength + 4)
    this._setUint32(myu8, ccLength + 8, crc32)

    let combined = [...fu8, ...myu8, ...lu8]

    return this._base64ArrayBuffer(combined)
  }

  // Send
  async apiSend(params, callback = null) {
    this.addBreadCrumbEntry("apiSend", params)

    //this.addSentryError("superError", 19, {'xxx':'yyy'})

    if (!'coins' in params) {
      return this._getError("Invalid input data. No coins")
    }

    if (!Array.isArray(params['coins'])) {
      return this._getError("Invalid input data. Coins must be an array")
    }

    if (!'to' in params) {
      return this._getError("Invalid input data. To is not defined")
    }

    // To address
    let to = params['to'] + ""
    if (to.match(/^\d+$/) && (to > 0 || to < 16777216)) {
      
    } else {
      to = await this._resolveDNS(params['to'])
      if (to == null) {
        return this._getError("Failed to resolve DNS name: " + params.to)
      }
    }
    
    let amount = 0
    for (let i in params.coins) {
      let cc = params.coins[i]
      amount += this.getDenomination(cc.sn)
    }

    let rqdata = []
    let memo = 'memo' in params ? params['memo'] : "Send"
    let from = "RaidaJS"

    let guid = this._generatePan()
    let tags = this._getObjectMemo(guid, memo, amount, from)
    // Assemble input data for each Raida Server
    for (let i = 0; i < this._totalServers; i++) {
      rqdata.push({
        sns: [],
        nns: [],
        ans: [],
        pans: [], 
        denomination: [],
        to_sn: to,
        tag: tags[i]
      })
      for (let j = 0; j < params['coins'].length; j++) {
        let coin = params['coins'][j]
        if ('an' in coin) {
          for (let x = 0; x < coin.an.length; x++) {
            if (coin.an[x] == null)
              coin.an[x] = this._generatePan()
          }
        }

        if (!this._validateCoin(coin)) {
          return this._getError("Invalid coin. Idx " + j)
        }

        rqdata[i].sns.push(coin.sn)         
        rqdata[i].nns.push(coin.nn)
        rqdata[i].ans.push(coin.an[i])
        rqdata[i].pans.push(coin.pan[i])
        rqdata[i].denomination.push(this.getDenomination(coin.sn))
      }
    }

    // Launch Requests
    let rqs = this._launchRequests("send", rqdata, 'POST', callback)
    let rv = this._getGenericMainPromise(rqs, params['coins']).then(result => {
      if (!('status' in result) || result.status != 'done')
        return result

      let sns = []
      for (let sn in result.result) {
        let cr = result.result[sn]
        if (cr.result == this.__errorResult) {
          console.log("adding to send again " +sn)
          sns.push(sn)
        }
      }

      // Need to call SendAgain
      if (sns.length > 0) {
        console.log("Need to call sendagain")
        let nrqdata = []
        for (let i = 0; i < this._totalServers; i++) { 
          nrqdata.push({
            b : 't',
            sns: [],
            nns: [],
            ans: [],
            pans: [], 
            denomination: [],
            to_sn: to,
            tag: tags[i]
          })
          for (let j = 0; j < params['coins'].length; j++) {
            let coin = params['coins'][j]

            if (!sns.includes(coin.sn))
              continue

            nrqdata[i].sns.push(coin.sn)         
            nrqdata[i].nns.push(coin.nn)
            nrqdata[i].ans.push(coin.an[i])
            nrqdata[i].pans.push(coin.pan[i])
            nrqdata[i].denomination.push(this.getDenomination(coin.sn))
          }
        }

        let rqs = this._launchRequests("sendagain", nrqdata, 'POST', callback)
        let coins = new Array(sns.length)
        sns.forEach((value, idx) => { 
          coins[idx] = { sn: value, nn: this.options.defaultCoinNn }
        })

        let response = this._getGenericBriefMainPromise(rqs, coins).then(response => {
          // Merging results from 'send' and 'send_again'
          result.errorNotes -= sns.length
          result.authenticNotes += response.authenticNotes
          result.counterfeitNotes += response.counterfeitNotes
          result.frackedNotes += response.frackedNotes
          result.errorNotes += response.errorNotes

          for (let sn in response.result) {
            result.result[sn] = response.result[sn]
          }

          this.addBreadCrumbReturn("apiSend", result)
          return result
        })

        return response
      }

      this.addBreadCrumbReturn("apiSend", result)
      return result
    })

    let pm = new Promise((resolve, reject) => {
      setTimeout(() => {
        this._fixTransfer()
      }, 500)
    })

    return rv
  }

  // Receive
  async apiReceive(params, callback = null) {
    this.addBreadCrumbEntry("apiReceive", params)

    let coin = this._getCoinFromParams(params)
    if (coin == null) 
      return this._getError("Failed to parse coin from params")

    let changeMakerId = this.options.changeMakerId
    if ('changeMakerId' in params) {
      changeMakerId = params['changeMakerId']
    }

    let gcRqs = await this._getCoins(coin, callback)
    let sns = Object.keys(gcRqs.coins)

    if (!('amount' in params)) {
      params.amount = this._calcAmount(sns)
    }

    if (params.amount > this._calcAmount(sns)) {
      return this._getError("Not enough coins")
    }

    let rvalues = this._pickCoinsAmountFromArrayWithExtra(sns, params.amount)
    let coinsToReceive = rvalues.coins
    let changeCoin = rvalues.extra

    let changeRequired
    if (changeCoin !== 0) {
      let csns = await this.apiBreakInBank(rvalues.extra, coin, callback)
      if (csns.length == 0) {
        return  this._getError("Failed to break in bank")
      }

      coinsToReceive = coinsToReceive.concat(csns)

      // extra will tell us if we need change
      rvalues = this._pickCoinsAmountFromArrayWithExtra(coinsToReceive, params.amount)
      coinsToReceive = rvalues.coins
      changeCoin = rvalues.extra
      if (changeCoin !== 0) {
        return  this._getError("Failed to pick coins after break in bank")
      }

      changeRequired = true
    } else {
      changeRequired = false
    }

    let rqdata = []
    let nns = new Array(coinsToReceive.length)
    nns.fill(this.options.defaultCoinNn)

    let response
    if (coinsToReceive.length > 0) {
      // Assemble input data for each Raida Server
      for (let i = 0; i < this._totalServers; i++) {
        rqdata.push({
          sns: coinsToReceive,
          nns: nns,
          an: coin.an[i],
          pan: coin.pan[i],
          sn: coin.sn,
          nn: coin.nn,
          denomination: this.getDenomination(coin.sn)
        })
      }

      // Launch Requests
      let rqs = this._launchRequests("receive", rqdata, 'POST', callback)
  
      let coins = new Array(coinsToReceive.length)
      coinsToReceive.forEach((value, idx) => { 
        coins[idx] = { sn: value, nn: this.options.defaultCoinNn }
      })

      response = await this._getGenericMainPromise(rqs, coins)
      response.changeCoinSent = 0
      response.changeRequired = false
      for (let k in response.result) {
        response.result[k]['an'] = [...response.result[k].message]
        delete(response.result[k]['message'])
      }

      this.addBreadCrumbReturn("apiReceive", response)     
      return response
    } else if (changeCoin === 0) {
      return this._getError("No coins to receive")
    } else {
      response = {
        totalNotes: 0, authenticNotes: 0, counterfeitNotes: 0, errorNotes: 0, frackedNotes: 0, result: {}
      }

      this.addBreadCrumbReturn("apiReceive", response)     
      return response
    }

  }


  // BreakInBank
  async apiBreakInBank(extraSn, idcc, callback) {
    this.addBreadCrumbEntry("apiBreakInBank", {'extraSn' : extraSn, 'idcc' : idcc})

    let csns = []

    let scResponse = await this.showChange({ 
      nn: this.options.defaultCoinNn, 
      sn: this.options.changeMakerId,
      denomination: this.getDenomination(extraSn)
    }, callback)

    let d100s = Object.keys(scResponse.d100)
    let d25s = Object.keys(scResponse.d25)
    let d5s = Object.keys(scResponse.d5)
    let d1s = Object.keys(scResponse.d1)

    let vsns
    switch (this.getDenomination(extraSn)) {
      case 250:
        vsns = this._get250E(d100s, d25s, d5s, d1s)
        break;
      case 100:
        vsns = this._get100E(d25s, d5s, d1s)
        break;
      case 25:
        vsns = this._get25B(d5s, d1s)
        break;
      case 5:
        vsns = this._getA(d1s, 5)
        break;
      default:
        console.log("Failed to get denomination for coin " + extraSn)
        return csns
    }

    // Assemble input data for each Raida Server
    let rqdata = []
    for (let i = 0; i < this._totalServers; i++) {
      rqdata.push({
        id_nn: idcc.nn,
        id_sn: idcc.sn,
        id_an: idcc.an[i],
        id_dn: this.getDenomination(idcc.sn),
        nn:  this.options.defaultCoinNn,
        sn: extraSn,
        dn: this.getDenomination(extraSn),
        change_server: this.options.changeMakerId,
        csn: vsns
      })
    }

    let response = await this._launchRequests("break_in_bank", rqdata, 'GET', callback)
    let p = 0
    let rv = await this._parseMainPromise(response, 0, {}, response => {
      if (response == "error" || response == "network")
        return
      if (response.status == "success") {
        p++
      }
    })

    if (p >= 17) {
      this.addBreadCrumbReturn("apiBreakInBank", vsns)
      return vsns
    }

    console.log("Not enough positive responses from RAIDA: " + p)
    return []

  }

  // Used to pay money to a merchant
  async apiPay(params, callback = null) {
    this.addBreadCrumbEntry("apiPay", params)

    if (!('sender_name' in params))
      return this._getError("Sender Name is required")

    let sender_address = params.sender_name

    if (!('to' in params))
      return this._getError("To is required")

    let from = sender_address
    if ('from' in params) 
      from = params.from
    else 
      params.from = from

    let memo = ""
    if ('memo' in params)
      memo = params.memo

    if (!('amount' in params)) 
      return this._getError("Invalid params. Amount is not defined")

    let guid = ""
    if (!('guid' in params)) {
      guid = this._generatePan()
      params.guid = guid
    } else {
      guid = params.guid
      if (!/^([A-Fa-f0-9]{32})$/.test(guid)) 
        return this._getError("Invalid GUID format")
    }



    let merchant_address = params.to
    let reportUrl = await this._resolveDNS(merchant_address, "TXT")
    if (reportUrl == null) {
      return this._getError("Receiver doesn't have TXT record in DNS name")
    }

    let senderSn = await this._resolveDNS(sender_address)
    if (senderSn == null) {
      return this._getError("Failed to resolve Sender")
    }

    params.sn = senderSn

    reportUrl = reportUrl.replaceAll("\"", "")
    try {
      let url = new URL(reportUrl)
    } catch (e) {
      return this._getError("Ivalid URL in TXT record")
    }
 
    let meta = ""
    meta += "from = \"" + from + "\"\n"
    meta += "message = \"" + memo + "\"\n"
    meta = btoa(meta)

    params.memo = guid

    let rv = this.apiTransfer(params, callback).then(response => {
      if (response.status == "error")
        return response

      response.guid = guid
      let rAx = axios.create()
      let mParams = {
        'merchant_skywallet' : merchant_address,
        'sender_skywallet': sender_address,
        'meta' : meta,
        'guid' : guid
      }
      let options = {
        timeout : this.options.timeout
      }
      options.params = mParams


      let rv2 = rAx.get(reportUrl, options).then(response2 => {
        if (!response2 || response2.status != 200) {
          return this._getError("Coins sent, but the Merchant was not notified. HTTP code returned from the Merchant: " + response2.status + ". Remember your GUID and contact the Merchant")
        }

        // Original response from apiTransfer
        return response
      })

      return rv2
    })

    return rv
  }


  // BillPay
  async apiBillPay(params, callback = null) {
    this.addBreadCrumbEntry("apiBillPay", params)

    if (!('coin' in params))
      return this._getErrorCode(RaidaJS.ERR_PARAM_MISSING_COIN, "Coin is missing")

    let coin = params['coin']
    if (!this._validateCoin(coin)) 
      return this._getErrorCode(RaidaJS.ERR_PARAM_INVALID_COIN, "Failed to validate coin")

    let guid = this._generatePan()
    if ('guid' in params) {
      guid = params['guid']
      if (!this._validateGuid(guid)) {
        return this._getErrorCode(RaidaJS.ERR_PARAM_INVALID_GUID, "Failed to validate GUID")
      }
    }

    let paydata = {}
    let v = this._getBillPayCachedObject(guid)
    if (v != null) {
      paydata = v
      console.log("cached")
      console.log(paydata)
    } else {
      if (!('paydata' in params))
        return this._getErrorCode(RaidaJS.ERR_PARAM_BILLPAY_MISSING_PAYDATA, "Paydata is missing")

      let id = this.genene
      if (!('paydata' in params))
        return this._getErrorCode(RaidaJS.ERR_PARAM_BILLPAY_MISSING_PAYDATA, "Paydata is missing")

      let paydataArray = params.paydata.split("\n")
      for (let i = 0; i < paydataArray.length; i++) {
        let item = paydataArray[i]
        let line = i + 1

        let els = item.split(",")
        let method = els[0].trim()
        let fformat = els[1].trim()
        if (method != "TransferToSkywallet")
          return this._getErrorCode(RaidaJS.ERR_PARAM_BILLPAY_INVALID_METHOD, "Invalid method. Line " + line)

        if (fformat != "stack")
          return this._getErrorCode(RaidaJS.ERR_PARAM_BILLPAY_FILE_FORMAT, "Only stack format supported. Line " + line)


        let amount = els[2].trim()
        try {
          amount = parseInt(amount)
        } catch (e) { 
          return this._getErrorCode(RaidaJS.ERR_PARAM_BILLPAY_PAYDATA_INVALID_AMOUNT, "Incorrect Amount. Line " + line)
        }

        let d1 = els[3].trim()
        let d5 = els[4].trim()
        let d25 = els[5].trim()
        let d100 = els[6].trim()
        let d250 = els[7].trim()

        if (amount < 0 || d1 != 0 || d5 != 0 || d25 != 0 || d100 != 0 || d250 != 0) {
          return this._getErrorCode(RaidaJS.ERR_PARAM_BILLPAY_PAYDATA_INVALID_AMOUNT, "Incorrect Amount. Amount must be positive and Denominations must be zero. Line " + line)
        }

        let to = els[8].trim()
        let memo = els[9].trim()
        let state = els[11].trim()
        if (state != "ready" && state != "skip")
          return this._getErrorCode(RaidaJS.ERR_PARAM_BILLPAY_PAYDATA_INVALID_STATUS, "Invalid status. Line " + line)

        if (to in paydata)
          return this._getErrorCode(RaidaJS.ERR_PARAM_BILLPAY_PAYDATA_DUPLICATED_VALUE, "Duplicated value for " + to + ". Line " + line)

        paydata[to] = {
          'amount' : amount,
          'state' : state,
          'memo' : memo
        }
      }
    }

    let ok, errors

    let rv = {
      code: RaidaJS.ERR_NO_ERROR,
      amount: 0,
      recipients: [],
      guid: guid
    }

    for (let to in paydata) {
      let item = paydata[to]
      let recipient = {
        "address" : to,
        "status" : "ready"
      }
      let state = item.state
      if (state == "skip" || state == "sent") {
        recipient.status = state
        rv.recipients.push(recipient)
        continue
      }

      let params = {
        'sn' : coin.sn,
        'an' : coin.an,
        'to' : to,
        'amount' : item.amount,
        'memo' : item.memo
      }

      let lrv = await this.apiTransfer(params, callback)
      console.log("xdone " +to)
      console.log(rv)
      if (lrv.status == "error") {
        recipient.status = "error"
        recipient.message = lrv.errorText
        paydata[to].state = "ready"
        rv.recipients.push(recipient)
        rv.code = RaidaJS.ERR_BILLPAY_SENT_PARTIALLY
        continue
      }

      paydata[to].state = "sent"
      recipient.status = "sent"
      recipient.message = "Success"
      rv.amount += item.amount
      rv.recipients.push(recipient)
    }

    this._saveBillPayCachedObject(guid, paydata)
    return rv

  }

  apiBillPayList(params) {
    if (!('guid' in params)) 
      return this._getErrorCode(RaidaJS.ERR_PARAM_MISSING_GUID, "GUID is required")

    let guid = params.guid
    if (!this._validateGuid(guid)) 
      return this._getErrorCode(RaidaJS.ERR_PARAM_INVALID_GUID, "Failed to validate GUID")

    let obj = this._getBillPayCachedObject(guid)
    if (obj == null)
      return this._getErrorCode(RaidaJS.ERR_RESPONSE_RECORD_NOT_FOUND, "BillPay List not found")

    let rv = {
      code: RaidaJS.ERR_NO_ERROR,
      amount: 0,
      amounttotal: 0,
      guid: guid,
      recipients: []
    }

    rv.recipients = obj
    for (let to in obj) {
      let item = obj[to]
      if (item.state == "sent")
        rv.amount += item.amount

      rv.amounttotal += item.amount
    }


    return rv
  }

  _saveBillPayCachedObject(guid, paydata) {
    let key = this.options.billpayKey
    let v = localStorage.getItem(key)
    if (v == null) 
      return

    let obj = null
    try {
      obj = JSON.parse(v)
    } catch(e) {
      return null
    }

    obj[guid] = paydata

    v = JSON.stringify(obj)
    console.log(v)

    localStorage.setItem(key, v)
  }

  _getBillPayCachedObject(guid) {
    let key = this.options.billpayKey

    let v = localStorage.getItem(key)
    if (v == null) {
      let obj = JSON.stringify({})
      localStorage.setItem(key, obj)
      return null
    }

    let obj = null
    try {
      obj = JSON.parse(v)
    } catch(e) {
      return null
    }

    if (!(guid in obj))
      return null

    return obj[guid]
  }

  // Transfer
  async apiTransfer(params, callback = null) {
    this.addBreadCrumbEntry("apiTransfer", params)

    this._rarr = {}

    let coin = this._getCoinFromParams(params)
    if (coin == null) 
      return this._getError("Failed to parse coin from params")
      

    if (!'to' in params) {
      return this._getError("Invalid params. To is not defined")
    }

    let to = await this._resolveDNS(params['to'])
    if (to == null) {
      return this._getError("Failed to resolve DNS name: " + params.to)
    }


    let changeMakerId = this.options.changeMakerId
    if ('changeMakerId' in params) {
      changeMakerId = params['changeMakerId']
    }

    if (!('amount' in params)) {
      return this._getError("Invalid params. Amount is not defined")
    }

    let memo = 'memo' in params ? params['memo'] : "Transfer from SN#" + coin.sn
    let guid
    if (!('guid' in params)) {
      guid = this._generatePan()
    } else {
      guid = params.guid
      if (!/^([A-Fa-f0-9]{32})$/.test(guid)) 
        return this._getError("Invalid GUID format")
    }

    if ('from' in params) 
      from = params.from
    else
      from = "SN " + coin.sn

    let tags = this._getObjectMemo(guid, memo, params.amount, from)

    let gcRqs = await this._getCoins(coin, callback)
    let sns = Object.keys(gcRqs.coins)
    let nns = new Array(sns.length)
    nns.fill(this.options.defaultCoinNn)
    if (params.amount > this._calcAmount(sns)) {
      return  this._getError("Not enough cloudcoins")
    }

    let rvalues = this._pickCoinsAmountFromArrayWithExtra(sns, params.amount)
    let coinsToSend = rvalues.coins
    let changeCoin = rvalues.extra
    if (coinsToSend.length > this.options.maxCoins) {
      return  this._getError("You can't transfer more than " + this.options.maxCoins + " notes at a time")
    }

    let changeRequired
    if (changeCoin !== 0) {
      let csns = await this.apiBreakInBank(rvalues.extra, coin, callback)
      if (csns.length == 0) {
        return  this._getError("Failed to break in bank")
      }

      coinsToSend = coinsToSend.concat(csns)
      rvalues = this._pickCoinsAmountFromArrayWithExtra(coinsToSend, params.amount)
      coinsToSend = rvalues.coins
      changeCoin = rvalues.extra
      if (changeCoin !== 0) {
        return  this._getError("Failed to pick coins after break in bank")
      }
      if (coinsToSend.length > this.options.maxCoins) {
        return  this._getError("You can't transfer more than " + this.options.maxCoins + " notes at a time")
      }

      changeRequired = true
    } else {
      changeRequired = false
    }
    let batch = this.options.maxCoinsPerIteraiton

    let iterations = Math.floor(coinsToSend.length / batch)

    let localCoinsToSend
    let b = 0
    let response = {}
    for (; b < iterations; b++) {
      let from = b * batch
      let tol = from + batch
      localCoinsToSend = coinsToSend.slice(from,tol)
      let lr = await this._doTransfer(coin, to, tags, localCoinsToSend, callback, b)
      response = this._mergeResponse(response, lr)  
    }

    let from = b * batch
    if (from < coinsToSend.length) {
      let tol = coinsToSend.length
      localCoinsToSend = coinsToSend.slice(from,tol)
      let lr = await this._doTransfer(coin, to, tags, localCoinsToSend, callback, iterations)
      response = this._mergeResponse(response, lr)  

    }
    
    // Assemble input data for each Raida Server
    response.changeCoinSent = changeRequired

    let pm = new Promise((resolve, reject) => {
      setTimeout(() => {
        this._fixTransfer()
      }, 500)
    })

    this.addBreadCrumbReturn("apiTransfer", response)     
    return response
  }

  _getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  async _fixTransfer() {
    this.addBreadCrumbEntry("_fixTransfer")

    let corner = this._getRandomInt(4) + 1

    let rqdata = new Array(this._totalServers)
    let servers = []
    for (let raidaIdx in this._rarr) {
      let sns = this._rarr[raidaIdx]
      rqdata[raidaIdx] = {
        'corner' : corner,
        'sn' : sns
      }

      servers.push(raidaIdx)
    }

    let pm = this._launchRequests("sync/fix_transfer", rqdata, 'GET', () => {}, servers)

    return pm  

  }

  // Merges responses from RAIDA servers
  _mergeResponse(response, addon) {
    if (Object.keys(response).length == 0) 
      return addon

    if (addon.status != 'done')
      response.status = addon.status

    response.authenticNotes += addon.authenticNotes
    response.counterfeitNotes += addon.counterfeitNotes
    response.errorNotes += addon.errorNotes
    response.totalNotes += addon.totalNotes
    response.frackedNotes += addon.frackedNotes
    response.details = response.details.concat(addon.details)
    for (let k in addon.result) {
      response.result[k] = addon.result[k]
    }
  //  response.result = Object.assign(response.result, addon.result)

    return response

  }

  // Doing actual transfer
  async _doTransfer(coin, to, tags, coinsToSend, callback, iteration) {
    this.addBreadCrumbEntry("_doTransfer")

    let rqdata = []
    for (let i = 0; i < this._totalServers; i++) {
      rqdata.push({
        b : 't',
        sns: coinsToSend,
        an: coin.an[i],
        pan: coin.pan[i],
        sn: coin.sn,
        nn: coin.nn,
        denomination: this.getDenomination(coin.sn),
        to_sn: to,
        tag: tags[i]
      })
    }

    // Launch Requests
    let rqs = this._launchRequests("transfer", rqdata, 'POST', callback, null, iteration)
  
    let coins = new Array(coinsToSend.length)
    coinsToSend.forEach((value, idx) => { 
      coins[idx] = { sn: value, nn: this.options.defaultCoinNn }
    })

    let response = await this._getGenericBriefMainPromise(rqs, coins)
    this.addBreadCrumbReturn("_doTransfer", response)     

    return response
  }

  async showChange(params, callback = null) {
    this.addBreadCrumbEntry("showChange", params)

    let { sn, nn, denomination } = params
    let rqdata = []
    let seed = this._generatePan().substring(0, 8)
    for (let i = 0; i < this._totalServers; i++) {
      rqdata.push({
        sn: sn,
        nn: nn,
        denomination: denomination,
        seed: seed
      })
    }

    let nrv = { d1 : {}, d5 : {}, d25 : {}, d100 : {}}
    let rqs = this._launchRequests("show_change", rqdata, 'GET', callback).then(response => {
      this._parseMainPromise(response, 0, nrv, response => {
        if (response.status !== "pass") {
          return
        }

        if (!('d1' in response) || !('d5' in response) || !('d25' in response) || !('d100' in response)) 
          return

        let { d1, d5, d25, d100 } = response
        for (let i = 0; i < d1.length; i++) {
          if (!(d1[i] in nrv.d1)) nrv.d1[d1[i]] = 0
          nrv.d1[d1[i]]++
        }

        for (let i = 0; i < d5.length; i++) {
          if (!(d5[i] in nrv.d5)) nrv.d5[d5[i]] = 0
          nrv.d5[d5[i]]++
        }

        for (let i = 0; i < d25.length; i++) {
          if (!(d25[i] in nrv.d25)) nrv.d25[d25[i]] = 0
          nrv.d25[d25[i]]++
        }

        for (let i = 0; i < d100.length; i++) {
          if (!(d100[i] in nrv.d100)) nrv.d100[d100[i]] = 0
          nrv.d100[d100[i]]++
        }
      })

      let mnrv = { d1 : {}, d5 : {}, d25 : {}, d100 : {}}
      for (let sn in nrv.d1) {
        if (nrv.d1[sn] >= this._totalServers - this.options.maxFailedRaidas) 
          mnrv.d1[sn] = sn
      }

      for (let sn in nrv.d5) {
        if (nrv.d5[sn] >= this._totalServers - this.options.maxFailedRaidas) 
          mnrv.d5[sn] = sn
      }

      for (let sn in nrv.d25) {
        if (nrv.d25[sn] >= this._totalServers - this.options.maxFailedRaidas) 
          mnrv.d25[sn] = sn
      }

      for (let sn in nrv.d100) {
        if (nrv.d100[sn] >= this._totalServers - this.options.maxFailedRaidas) 
          mnrv.d100[sn] = nrv.d100[sn]
      }

      this.addBreadCrumbReturn("showChange", mnrv)     
      return mnrv
    })

    return rqs
  }

  async apiFixTransferSync(coinsPerRaida, callback) {
    this.addBreadCrumbEntry("apiFixTransferSync", coinsPerRaida)
    return this.apiFixTransferGeneric(coinsPerRaida, true, callback) 
  }

  async apiFixTransfer(coinsPerRaida, callback) {
    this.addBreadCrumbEntry("apiFixTransfer", coinsPerRaida)
    return this.apiFixTransferGeneric(coinsPerRaida, false, callback) 
  }

  async apiFixTransferGeneric(coinsPerRaida, sync, callback) {
    this.addBreadCrumbEntry("apiFixTransferGeneric", coinsPerRaida)

    if (typeof(coinsPerRaida) != "object")
      return this._getError("Failed to validate input args")

    let rqdata = []
    for (let k in coinsPerRaida) {
      let rs = coinsPerRaida[k]

      let yes = 0
      let no = 0
      let yraidas = []
      let nraidas = []
      for (let i = 0; i < rs.length; i++) {
        if (rs[i] == "yes") {
          yes++
          yraidas.push(i)
          continue
        }

        if (rs[i] == "no") {
          no++
          nraidas.push(i)
          continue
        }
      }

      if (yes + no < this._totalServers - this.options.maxFailedRaidas) {
        // No fix. a lot of network errors
        continue
      }

      if (yes != 0 && no != 0) {
        let raidas = []
        if (yes == no) {
          // Don't know what to do
          console.log("Coin " + k + " has equal votes from all raida servers")
          continue
        }

        if (yes > no) {
          raidas = nraidas
        } else {
          raidas = yraidas
        }

        // Will fix coin on raida servers
        for (let r = 0; r < raidas.length; r++) {
          let rIdx = raidas[r]
          if (!(rIdx in rqdata)) {
            rqdata[rIdx] = {
              sn : []
            }

            if (sync) {
              rqdata[rIdx]['sync'] = "true"
            }
          
          }

          // Will not add more than
          if (rqdata[rIdx].sn.length >= this.options.maxCoinsPerIteraiton)
            continue

          rqdata[rIdx].sn.push(k)
        }
      }
    }

    let servers = Object.keys(rqdata)
    let rv = {
      "status":"done"
    }
    let rqs = this._launchRequests("sync/fix_transfer", rqdata, 'GET', callback, servers).then(response => {
      /*
      Ignoring response. Fire & Forget
      */
      return rv
    })

    return rv
  }

  // Get Free Coin
  async apiGetFreeCoin(hwId) {
    let url = this.options.freeCoinURL
    let response
    try {
      response = await this._axInstance.get(url + "?hwid=" + hwId)
    } catch (e) {
      return this._getError("Failed to get response from the FreeCoin Server")
    }
    if (response.status != 200)
      return this._getError("Failed to get free coin")

    let data = response.data
    if (!('status' in data))
      return this._getError("Failed to parse respense from FreeCoin Server")

    if (data.status != "success")
      return this._getError(data.message)

    let ccStack = data.message
    let cc = ccStack.cloudcoin

    return cc[0]
  }


  async apiShowCoins(coin, callback) {
    this.addBreadCrumbEntry("apiShowCoins", coin)

    if (!this._validateCoin(coin)) {
      return this._getError("Failed to validate params")
    }

    return this._getCoins(coin, callback)
  }

  async apiShowCoinsAsArray(coin, callback) {
    this.addBreadCrumbEntry("apiShowCoinsArray", coin)

    if (!this._validateCoin(coin)) {
      return this._getError("Failed to validate params")
    }

    let d = await this._getCoins(coin, callback)
    let coins = d.coins
    
    let a = []
    for (let sn in coins) {
      a.push({
        'sn': sn,
        'denomination': coins[sn]
      })
    }

    d.coins = a
    return d
  }

  async apiShowBalance(coin, callback) {
    this.addBreadCrumbEntry("apiShowBalance", coin)

    if (!this._validateCoin(coin)) {
      return this._getError("Failed to validate params")
    }

    let rqdata = []
    for (let i = 0; i < this._totalServers; i++) {
      rqdata.push({
        sn: coin.sn,
        nn: coin.nn,
        an: coin.an[i],
        pan: coin.an[i],
        denomination: this.getDenomination(coin.sn),
      })
    }
    let rv = {
      code: RaidaJS.ERR_NO_ERROR,
      balances: [],
      balancesPerRaida: [],
      raidaStatuses: []
    }
    for (let i = 0; i < this._totalServers; i++) {
      rv.raidaStatuses[i] = "u"
      rv.balances[i] = 0
    }

    let balances = {}
    let rqs = this._launchRequests("show_transfer_balance", rqdata, 'GET', callback).then(response => {
      this._parseMainPromise(response, 0, rv, (response, rIdx) => {
        if (response == "network") {
          rv.raidaStatuses[rIdx] = "n"
          rv.balancesPerRaida[rIdx] = null
          return
        }
        if (response == "error") {
          rv.raidaStatuses[rIdx] = "e"
          rv.balancesPerRaida[rIdx] = null
          return
        }

        if (!('status' in response)) {
          rv.raidaStatuses[rIdx] = "e"
          rv.balancesPerRaida[rIdx] = null
          return
        }

        if (response.status == "fail") {
          rv.raidaStatuses[rIdx] = "f"
          rv.balancesPerRaida[rIdx] = null
          return
        }

        if (response.status !== "pass") {
          rv.raidaStatuses[rIdx] = "e"
          rv.balancesPerRaida[rIdx] = null
          return
        }

        rv.raidaStatuses[rIdx] = "p"
        let b = response.total
        rv.balancesPerRaida[rIdx] = b

        if (!(b in balances)) {
          balances[b] = 0
        }

        balances[b]++
      })

      rv.balances = balances
      rv.raidaStatuses = rv.raidaStatuses.join("")

      this.addBreadCrumbReturn("apiShowBalance", rv)     
      return rv

    })

    return rqs
  }

  // Resolves a SkyWallet
  async apiResolveSkyWallet(hostname) {
    return this._resolveDNS(hostname)

  }

  // Health Check
  async apiHealthCheck(params, callback = null) {
    this.addBreadCrumbEntry("apiHealthCheck", params)
    if (!('coin' in params))
      return this._getErrorCode(RaidaJS.ERR_PARAM_MISSING_COIN, "Coin in missing")

    let coin = params['coin']
    if (!this._validateCoin(coin)) 
      return this._getErrorCode(RaidaJS.ERR_PARAM_INVALID_COIN, "Failed to validate coin")

    let rv = {
      'code' : RaidaJS.ERR_NO_ERROR,
      'text' : "HealthCheck Completed",
      'balances' : [],
      'balance' : -1,
      'show_balances': [],
      'sns': []
    }

    let lrv = await this.apiShowBalance(coin, callback)
    if (('code' in lrv) && lrv.code == RaidaJS.ERR_NO_ERROR) {
      rv.balances = lrv.balancesPerRaida
      let max = 0
      let balance = -1
      for (let k in lrv.balances) {
        if (max < lrv.balances[k]) {
          max = lrv.balances[k]
          balance = k
        }
      }

      rv.balance = balance

    }

    lrv = await this.apiShowCoins(coin, callback)
    if (('code' in lrv) && lrv.code == RaidaJS.ERR_NO_ERROR) {
      rv.sns = lrv.coinsPerRaida
    }

    lrv = await this._getCoinsWithContentBalance(coin, callback)
    if (('code' in lrv) && lrv.code == RaidaJS.ERR_NO_ERROR) {
      rv.show_balances = lrv.balancesPerRaida
    }

    return rv

  }

  // Create NFT
  async apiNFTInsert(params, callback = null) {
    this.addBreadCrumbEntry("apiNFTInsert", rv)

    let size = 0

    if (!('coin' in params))
      return this._getErrorCode(RaidaJS.ERR_PARAM_MISSING_COIN, "Coin is missing")

    if (!('data' in params))
      return this._getErrorCode(RaidaJS.ERR_PARAM_MISSING_DATA, "Data is missing")

    if (!('metadata' in params))
      return this._getErrorCode(RaidaJS.ERR_PARAM_MISSING_METADATA, "MetaData is missing")

    let metadata = params.metadata
    if (!('filename' in metadata))
      return this._getErrorCode(RaidaJS.ERR_PARAM_MISSING_METADATA, "Filename is missing")

    let filename = metadata.filename
    let proofmimetype = "image/jpeg"
    let mimetype = "application/octet-stream"
    if ('mimetype' in metadata)
      mimetype = metadata.mimetype

    let coin = params['coin']
    if (!this._validateCoin(coin)) 
      return this._getErrorCode(RaidaJS.ERR_PARAM_INVALID_COIN, "Failed to validate coin")

    let protocol = 0
    if ('protocol' in params)
      protocol = params.protocol

    if (protocol != 0 && protocol != 1)
      return this._getErrorCode(RaidaJS.ERR_PARAM_UNSUPPORTED_NFT_PROTOCOL, "Unsupported NFT Protocol")

    size += params.data.length
    if (size == 0) {
      return this._getErrorCode(RaidaJS.ERR_PARAM_BILLPAY_EMPTY_PAYDATA, "Data is empty")
    }
    let proofdata = null
    if (protocol == 1) {
      if (!('proofdata' in params))
        return this._getErrorCode(RaidaJS.ERR_PARAM_NFT_MISSING_ID_PROOF, "ID Proof Picture is missing")

      if ('proofmimetype' in metadata)
        proofmimetype = metadata.proofmimetype

      proofdata = params.proofdata
      size += proofdata.length
    }

    if (size > this.options.maxNFTSize)
      return this._getErrorCode(RaidaJS.ERR_PARAM_NFT_SIZE_IS_TOO_BIG, "The size of picture and ID proof is too big")

    let obj = {
      'filename' : filename,
      'mimetype' : mimetype,
      'proofmimetype' : proofmimetype
    }

    let rqdata = []
    let tags = this._getNFTStringForObject(obj, params.data, proofdata) 
    for (let i = 0; i < this._totalServers; i++) {
      rqdata.push({
        'sn' : coin.sn,
        'an' : coin.an[i],
        'protocol': protocol,
        'stripe' : tags[i]['stripe'],
        'mirror' : tags[i]['mirror1'],
        'mirror2' : tags[i]['mirror2']
      })
    }

    let rv = {
      'code' : RaidaJS.ERR_NO_ERROR,
      'text' : "Created successfully"
    }

    let a, f, e
    a = f = e = 0
    let rqs = this._launchRequests("nft/insert", rqdata, 'POST', callback)
    let mainPromise = rqs.then(response => {
      this._parseMainPromise(response, 0, rv, serverResponse => {
        if (serverResponse === "error" || serverResponse == "network") {
          e++
          return
        }
        if (serverResponse.status == "success") {
          a++
        }
        if (serverResponse.status == "fail") {
          f++
        }
      })

      let result = this._gradeCoin(a, f, e)
      if (!this._validResult(result))
        return this._getErrorCode(RaidaJS.ERR_RESPONSE_TOO_FEW_PASSED, "Failed to create NFT token. Too many error responses from RAIDA")

      return rv

    })

    this.addBreadCrumbReturn("apiNFTInsert", rv)

    return mainPromise
  }

  // Delete NFT
  async apiNFTDelete(params, callback = null) {
    this.addBreadCrumbEntry("apiNFTDelete", rv)

    let size = 0

    if (!('coin' in params))
      return this._getErrorCode(RaidaJS.ERR_PARAM_MISSING_COIN, "Coin is missing")

    let coin = params['coin']
    if (!this._validateCoin(coin)) 
      return this._getErrorCode(RaidaJS.ERR_PARAM_INVALID_COIN, "Failed to validate coin")

    let rqdata = []
    for (let i = 0; i < this._totalServers; i++) {
      rqdata.push({
        'sn' : coin.sn,
        'an' : coin.an[i]
      })
    }

    let rv = {
      'code' : RaidaJS.ERR_NO_ERROR,
      'text' : "Deleted successfully"
    }

    let a, f, e
    a = f = e = 0
    let rqs = this._launchRequests("nft/delete", rqdata, 'GET', callback)
    let mainPromise = rqs.then(response => {
      this._parseMainPromise(response, 0, rv, serverResponse => {
        if (serverResponse === "error" || serverResponse == "network") {
          e++
          return
        }
        if (serverResponse.status == "success") {
          a++
        }
        if (serverResponse.status == "fail") {
          f++
        }
      })

      let result = this._gradeCoin(a, f, e)
      if (!this._validResult(result))
        return this._getErrorCode(RaidaJS.ERR_RESPONSE_TOO_FEW_PASSED, "Failed to delete NFT token. Too many error responses from RAIDA")

      return rv
    })

    this.addBreadCrumbReturn("apiNFTDelete", rv)

    return mainPromise
  }

  // Read NFT
  async apiNFTRead(params, callback = null) {
    this.addBreadCrumbEntry("apiNFTRead", rv)

    if (!('coin' in params))
      return this._getErrorCode(RaidaJS.ERR_PARAM_MISSING_COIN, "Coin is missing")

    let coin = params['coin']
    if (!this._validateCoin(coin)) 
      return this._getErrorCode(RaidaJS.ERR_PARAM_INVALID_COIN, "Failed to validate coin")

    let rqdata = []
    for (let i = 0; i < this._totalServers; i++) {
      rqdata.push({
        'sn' : coin.sn,
        'an' : coin.an[i],
      })
    }

    let rv = {
      'code' : RaidaJS.ERR_NO_ERROR,
      'text' : "NFT downloaded successfully",
      'data' : null,
      'protocol' : 0,
      'metadata' : {}
    }

    let a, f, e
    a = f = e = 0
    let mparts = []
    for (let i = 0; i < this._totalServers; i++)
        mparts[i] = null

    let rqs = this._launchRequests("nft/read", rqdata, 'GET', callback)
    let mainPromise = rqs.then(response => {
      this._parseMainPromise(response, 0, rv, (serverResponse, rIdx) => {
          console.log("SR")
        console.log(serverResponse)
        if (serverResponse === "error" || serverResponse == "network") {
          e++
          return
        }

        if (serverResponse.status == "success") {
          console.log("SUCCESS")
          if (!('stripe' in serverResponse) || !('mirror' in serverResponse) || !('mirror2' in serverResponse))  {
            e++
            return
          }

          mparts[rIdx] = {
            'stripe' : serverResponse.stripe,
            'mirror1' : serverResponse.mirror,
            'mirror2' : serverResponse.mirror2,
          }

          a++
        }

        if (serverResponse.status == "fail") {
          f++
        }
      })
      let result = this._gradeCoin(a, f, e)
      if (!this._validResult(result))
        return this._getErrorCode(RaidaJS.ERR_RESPONSE_TOO_FEW_PASSED, "Failed to download NFT token. Too many error responses from RAIDA")

      let odata = this._getNFTObjectFromString(mparts)
      if (odata == null) {
        return this._getErrorCode(RaidaJS.ERR_RESPONSE_FAILED_TO_BUILD_MESSAGE_FROM_CHUNKS, "Failed to build message from RAIDA chunks. Some are missing")
      }

      rv.metadata = odata.metadata
      rv.data = odata.data
      if ('proofdata' in odata) {
        rv.proofdata = odata.proofdata
        rv.protocol = 1
      }


      return rv

    })

    this.addBreadCrumbReturn("apiNFTInsert", rv)

    return mainPromise
  }

  /*** INTERNAL FUNCTIONS. Use witch caution ***/
  async _resolveDNS(hostname, type = null) {
    this.addBreadCrumbEntry("_resolveDNS", hostname)

    let r = await this._resolveCloudFlareDNS(hostname, type)
    if (r == null) {
      r = await this._resolveGoogleDNS(hostname, type)
    }
   
    return r
  }

  async _resolveCloudFlareDNS(hostname, type = null) {
    let dnsAx = axios.create({
      headers: {
        'Accept': 'application/dns-json'
      }
    })

    let url = "https://cloudflare-dns.com/dns-query?name=" + hostname
    if (type != null)
      url += "&type=" + type

    let response
    try {
      response = await dnsAx.get(url)
    } catch (e) {
      console.log("Error querying CloudFlare DNS: " + e)
      return null
    }
    if (!('data' in response)) {
      console.error("Invalid response from CloudFlare DNS")
      return null
    }

    let data = response.data
    if (!('Status' in data)) {
      console.error("Invalid data from CloudFlare DNS")
      return null
    }

    if (data.Status != 0) {
      console.error("Failed to resolve DNS name. Wrong response from CloudFlare DNS:" + data.Status)
      return null
    }

    if (!('Answer' in data)) {
      console.error("Invalid data from CloudFlare DNS")
      return null
    }

    let reply = data.Answer[0]
    if (type == null || type == "A") {  
      if (reply.type !== 1) {
        console.error("Wrong response from CloudFlare DNS:" + data.Status)
        return null
      }

      let arecord = reply.data
      let parts = arecord.split('.')

      let sn = parts[1] << 16 | parts[2] << 8 | parts[3]

      return sn
    } else {
      return reply.data
    }
  }

  async _resolveGoogleDNS(hostname, type = null) {
    let dnsAx = axios.create()

    let url = "https://dns.google/resolve?name=" + hostname
    if (type != null)
      url += "&type=" + type

    let response = await dnsAx.get(url)
    if (!('data' in response)) {
      console.error("Invalid response from Google DNS")
      return null
    } 
    
    let data = response.data
    if (!('Status' in data)) {
      console.error("Invalid data from Google DNS")
      return null
    }

    if (data.Status !== 0) {
      console.error("Failed to resolve DNS name. Wrong response from Google DNS:" + data.Status)
      return null
    }
      
    if (!('Answer' in data)) {
      console.error("Invalid data from Google DNS")
      return null
    }


    let reply = data.Answer[0]
    if (type == null || type == "A") {  
      if (reply.type !== 1) {
        console.error("Wrong response from Google DNS:" + data.Status)
        return null
      }

      let arecord = reply.data
      let parts = arecord.split('.')

      let sn = parts[1] << 16 | parts[2] << 8 | parts[3]

      return sn
    } else {
      return reply.data
    }
  }

  // Gets envelopes with Content
  async _getCoinsWithContentBalance(coin, callback) {
    let rqdata = []

    // Assemble input data for each Raida Server
    for (let i = 0; i < this._totalServers; i++) {
      rqdata.push({
        sn: coin.sn,
        nn: coin.nn,
        an: coin.an[i],
        pan: coin.an[i],
        denomination: this.getDenomination(coin.sn),
        content: "1"
      })
    }
    let rv = { 
      code: RaidaJS.ERR_NO_ERROR,
      balancesPerRaida: []
    }

    let rqs = this._launchRequests("show", rqdata, 'GET', callback).then(response => {
      this._parseMainPromise(response, 0, rv, (response, rIdx) => {
        if (response == "network" || response == "error") 
          return

        if (!('status' in response)) 
          return
        

        if (response.status !== "pass") 
          return
        

        if (!('contents' in response))
          return

        let contents = response.contents
        rv.balancesPerRaida[rIdx] = 0
        for (let i = 0; i < contents.length; i++) {
          let item = contents[i]
          if (!('amount' in item))
            continue

          let amount = 0
          try {
            amount = parseInt(item.amount)
          } catch (e) { }


          rv.balancesPerRaida[rIdx] += amount
        }
      }) 

      return rv
    })

    return rqs
  }

  async _getCoins(coin, callback) {
    let rqdata = []

    // Assemble input data for each Raida Server
    for (let i = 0; i < this._totalServers; i++) {
      rqdata.push({
        sn: coin.sn,
        nn: coin.nn,
        an: coin.an[i],
        pan: coin.an[i],
        denomination: this.getDenomination(coin.sn),
      })
    }
    let rv = { 
      code: RaidaJS.ERR_NO_ERROR,
      coins: {},
      coinsPerRaida: {}
    }

    let skipRaidas = []
    let rqs = this._launchRequests("show", rqdata, 'GET', callback).then(response => {
      this._parseMainPromise(response, 0, rv, (response, rIdx) => {
        if (response == "network" || response == "error") {
          skipRaidas.push(rIdx)
          return
        }

        if (!('status' in response)) {
          skipRaidas.push(rIdx)
          return
        }

        if (response.status !== "pass") {
          skipRaidas.push(rIdx)
          return
        }

        let coins = response.message
        for (let i = 0; i < coins.length; i++) {
          let key = coins[i].sn
          if (!(key in rv.coins)) {
            rv.coins[key] = {
              passed: 0
            }
            rv.coinsPerRaida[key] = []
            for (let j = 0; j < this._totalServers; j++)
              rv.coinsPerRaida[key][j] = "no"
          }

          rv.coinsPerRaida[key][rIdx] = "yes"
          rv.coins[key].passed++
        }
      }) 

      let nrv = { code: RaidaJS.ERR_NO_ERROR, coins: {} }
      nrv.coinsPerRaida = rv.coinsPerRaida
      for (let f = 0; f < skipRaidas.length; f++) {
        let frIdx = skipRaidas[f]
        for (let sn in rv.coinsPerRaida) {
          rv.coinsPerRaida[sn][frIdx] = "unknown"
        }
      }
      for (let sn in rv.coins) {
        if (rv.coins[sn].passed >= this._totalServers - this.options.maxFailedRaidas) {
          nrv.coins[sn] = {
            denomination: this.getDenomination(sn)
          }
        }
      }
    
      return nrv
    })

    return rqs
  }

  // Doing internal fix
  async _realFix(round, raidaIdx, coins, callback = null) {
    let rqdata, triad, rqs, resultData
    for (let corner = 0; corner < 4; corner++) {
      triad = this._trustedTriads[raidaIdx][corner]

      rqdata = this._formRequestData(coins)
      rqs = this._launchRequests("multi_get_ticket", rqdata, 'POST', callback, triad)
      resultData = await this._getGenericMainPromise(rqs, coins, (a, c, e) => {
        if (a == 4)
          return this.__authenticResult

        return this.__counterfeitResult
      })

      rqdata = {
        nn : coins[0].nn,
        fromserver1: triad[0],
        fromserver2: triad[1],
        fromserver3: triad[2],
        fromserver4: triad[3],
        message1: [],
        message2: [],
        message3: [],
        message4: [],
        pans: []
      }

      let i = 0
      for (let sn in resultData['result']) {
        let coin = resultData['result'][sn]
        if (coin.result != this.__authenticResult) {
          i++
          continue
        }

        rqdata.message1.push(coin.tickets[0])
        rqdata.message2.push(coin.tickets[1])
        rqdata.message3.push(coin.tickets[2])
        rqdata.message4.push(coin.tickets[3])

        rqdata.pans.push(coins[i].pan[raidaIdx])
        i++
      }

      if (rqdata.message1.length == 0 || rqdata.message2.length == 0 || rqdata.message3.length == 0 || rqdata.message4.length == 0) {
        console.log("no tickets. continue")
        return
      }
    
      // exec fix fracked
      rqs = this._launchRequests("multi_fix", rqdata, 'POST', callback, [raidaIdx])
      resultData = await this._getGenericMainPromise(rqs, coins, (a, c, e) => {
        if (a == 1 && c == 0 && e == 0)
          return this.__authenticResult

        return this.__counterfeitResult
      })

      resultData = resultData['result']

      let cfixed = 0
      for (let i = 0; i < coins.length; i++) {
        let sn = coins[i].sn

        if (!(sn in resultData))
          continue

        let coinResult = resultData[sn].result
        if (coinResult !=  this.__authenticResult)
          continue
        
        coins[i].an[raidaIdx] = coins[i].pan[raidaIdx] = resultData[sn].an[raidaIdx]
        coins[i].pownArray[raidaIdx] = 'p'

        cfixed++
      }

      if (cfixed == coins.length)
        break
    }
  }


  _formRequestData(params) {
    let rqdata = []
    // Assemble input data for each Raida Server
    for (let i = 0; i < this._totalServers; i++) {
      rqdata.push({
        sns: [],
        nns: [],
        ans: [],
        pans: [], 
        denomination: []
      })
      for (let j = 0; j < params.length; j++) {
        let coin = params[j]
        if ('an' in coin) {
          for (let x = 0; x < coin.an.length; x++) {
            if (coin.an[x] == null)
              coin.an[x] = this._generatePan()
          }
        }

        if (!this._validateCoin(coin)) {
          console.error("Invalid coin. Coin index: " + j)
          return null
        }

        rqdata[i].sns.push(coin.sn)         
        rqdata[i].nns.push(coin.nn)
        rqdata[i].ans.push(coin.an[i])
        rqdata[i].pans.push(coin.pan[i])
        rqdata[i].denomination.push(this.getDenomination(coin.sn))
      }
    }

    return rqdata
  }

  _getGenericBriefMainPromise(rqs, coins) {
    // Parse the response from all RAIDA servers
    let mainPromise = rqs.then(response => {
      // Return value
      let rv = {
        status: "done",
        totalNotes: coins.length,
        authenticNotes: 0,
        counterfeitNotes: 0,
        errorNotes: 0,
        frackedNotes: 0,
        result : [],
        details : [],
        tickets: []
      }
  
      // Return value
      let rcoins = {}

      // Setup the return hash value
      for (let i = 0; i < coins.length; i++) {
        let sn = coins[i].sn
        rcoins[sn] = {
          nn: coins[i].nn,
          sn: sn,
          denomination: this.getDenomination(sn),
          errors: 0,
          counterfeit: 0,
          authentic: 0,
          pownstring: "",
          result: "unknown",
          message: new Array(this._totalServers)
        }

        if (typeof(coins[i].pan) != 'undefined')
          rcoins[sn].an = coins[i].pan
      }

      // Collect responses
      this._parseMainPromise(response, 0, rv, (serverResponse, raidaIdx) => {
        if (serverResponse === "error") {
          Object.keys(rcoins).map(sn => {
            rcoins[sn].errors++;
            rcoins[sn].pownstring += "e"
          })
          return
        }

        if (serverResponse === "network") {
          Object.keys(rcoins).map(sn => {
            rcoins[sn].errors++;
            rcoins[sn].pownstring += "n"
          })
          return
        }

        let sr = serverResponse
        if (!('status' in sr)) {
          for (let i = 0; i < coins.length; i++) {
            let sn = coins[i].sn
            rcoins[sn].errors++
            rcoins[sn].pownstring += "e"
          }
          return
        }

        if ('ticket' in sr) {
          rv.tickets[raidaIdx] = sr.ticket
        }


        let s = sr.status
        if (sr.status == 'allpass') {
          for (let i = 0; i < coins.length; i++) {
            let sn = coins[i].sn
            rcoins[sn].authentic++
            rcoins[sn].pownstring += "p"
          }
          return
        }
        
        if (sr.status == 'allfail') {
          this._addCoinsToRarr(raidaIdx, coins) 
          for (let i = 0; i < coins.length; i++) {
            let sn = coins[i].sn
            rcoins[sn].counterfeit++
            rcoins[sn].pownstring += "f"
          }
          return
        }

        if (sr.status == 'mixed') {
          let message = sr.message
          let vals = message.split(',')
          if (vals.length != coins.length) {
            console.log("Invalid size: " + vals.length + ", coins size: " + coins.length)
            for (let i = 0; i < coins.length; i++) {
              let sn = coins[i].sn
              rcoins[sn].errors++
              rcoins[sn].pownstring += "e"
            }
            return
          }
      
          for (let x = 0; x < vals.length; x++) {
            let vs = vals[x]
            let sn = coins[x].sn
            if (vs == 'pass') {
              rcoins[sn].authentic++
              rcoins[sn].pownstring += "p"
            } else if (vs == 'fail') {
              this._addCoinToRarr(raidaIdx, coins[x]) 
              rcoins[sn].counterfeit++
              rcoins[sn].pownstring += "f"
            } else {
              rcoins[sn].errors++
              rcoins[sn].pownstring += "e"
            }
          }

/*
          for (let i = 0; i < coins.length; i++) {
            let sn = coins[i].sn
            rcoins[sn].counterfeit = this._totalServers
            rcoins[sn].pownstring = "f".repeat(this._totalServers)
          }*/
          return
        }

        // General error
        for (let i = 0; i < coins.length; i++) {  
          let sn = coins[i].sn
          rcoins[sn].errors++
          rcoins[sn].pownstring += "e"
        }

        return

      })

      // Detect the result of each coin
      Object.keys(rcoins).map(sn => {
        rcoins[sn].result = this._gradeCoin(rcoins[sn].authentic, rcoins[sn].counterfeit, rcoins[sn].errors, this)
        switch(rcoins[sn].result) {
          case this.__authenticResult:
            rv.authenticNotes++
            break
          case this.__counterfeitResult:
            rv.counterfeitNotes++
            break
          case this.__frackedResult:
            rv.frackedNotes++
            break
          default:
            rv.errorNotes++
            break
        }
      })

      rv.result = rcoins
      return rv
    })

    return mainPromise
  }

  _getGenericMainPromise(rqs, coins, gradeFunction = null) {
    // Parse the response from all RAIDA servers
    let mainPromise = rqs.then(response => {
      // Return value
      let rv = {
        status: "done",
        totalNotes: coins.length,
        authenticNotes: 0,
        counterfeitNotes: 0,
        errorNotes: 0,
        frackedNotes: 0,
        result : [],
        details : []
      }
  
      // Return value
      let rcoins = {}

      // Setup the return hash value
      for (let i = 0; i < coins.length; i++) {
        let sn = coins[i].sn

        rcoins[sn] = {
          nn: coins[i].nn,
          sn: sn,
          denomination: this.getDenomination(sn),
          errors: 0,
          counterfeit: 0,
          authentic: 0,
          pownstring: "",
          result: "unknown",
          message: new Array(this._totalServers)
        }

        if (typeof(coins[i].pan) != 'undefined')
          rcoins[sn].an = coins[i].pan
      }

      // Collect responses
      this._parseMainPromise(response, rv.totalNotes, rv, (serverResponse, raidaIdx) => {
        if (serverResponse === "error") {
          Object.keys(rcoins).map(sn => {
            rcoins[sn].errors++;
            rcoins[sn].pownstring += "e"
          })
          return
        }
        if (serverResponse === "network") {
          Object.keys(rcoins).map(sn => {
            rcoins[sn].errors++;
            rcoins[sn].pownstring += "n"
          })
          return
        }


        // The order in input and output data is the same
        for (let i = 0; i < serverResponse.length; i++) {
          let sn = coins[i].sn
          let sr = serverResponse[i]

          if (!'status' in sr) {
            rcoins[sn].errors++;
            rcoins[sn].pownstring += "e"
            continue
          }
          
          if (sr.status == 'pass') {
            rcoins[sn].authentic++;
            rcoins[sn].pownstring += "p"
            if ('message' in sr) 
              rcoins[sn].message[raidaIdx] = sr.message
          } else if (sr.status == 'fail') {
            rcoins[sn].counterfeit++;
            rcoins[sn].pownstring += "f"
          } else {
            if (sr.status == 'ticket') {
              rcoins[sn].authentic++;
              rcoins[sn].pownstring += "p"
              if (!('tickets' in rcoins[sn]))
                rcoins[sn].tickets = []

              rcoins[sn].tickets[raidaIdx] = sr.message
            } else {
              rcoins[sn].errors++;
              rcoins[sn].pownstring += "e"
            }
          }
        }
      })

      // Detect the result of each coin
      Object.keys(rcoins).map(sn => {
        if (gradeFunction == null) {
          rcoins[sn].result = this._gradeCoin(rcoins[sn].authentic, 
            rcoins[sn].counterfeit, rcoins[sn].errors, this)
        } else {
          rcoins[sn].result = gradeFunction(rcoins[sn].authentic, 
            rcoins[sn].counterfeit, rcoins[sn].errors, this)
        }

        switch(rcoins[sn].result) {
          case this.__authenticResult:
            rv.authenticNotes++
            break
          case this.__counterfeitResult:
            rv.counterfeitNotes++
            break
          case this.__frackedResult:
            rv.frackedNotes++
            break
          default:
            rv.errorNotes++
            break
        }
      })

      rv.result = rcoins

      return rv
    })

    return mainPromise
  }

  _gradeCoin(a, f, e) {
    if (a + f + e != this._totalServers)
      return this.__errorResult

    
    if (a >= this.options.minPassedNumToBeAuthentic) {
      if (f > 0) {
        return this.__frackedResult
      } else {
        return this.__authenticResult
      }
    } else if (f >= this.options.maxFailedNumToBeCounterfeit) {
      return this.__counterfeitResult
    } else {
      return this.__errorResult
    }
  }
    
  _getCoinFromParams(params) {
    let coin = {
      sn: 0,
      nn: this.options.defaultCoinNn,
      an: []
    }

    if (typeof(params) !== 'object') {
      console.error("Invalid input data")
      return null
    }

    for (let k in coin) {
      if (k in params)
        coin[k] = params[k]
    }

    if (!this._validateCoin(coin))
      return null

    return coin
  }


  _generatePan() {
    let s = ""
    let rand, i = 0

    while (i < 32) {
      rand = Math.floor((Math.random() * 16));
      rand = rand.toString(16)
      s += rand
      i++
    }

    return s
  }

  _parseMainPromise(response, arrayLength, rv, callback) {
    for (let i = 0; i < response.length; i++) {
      let serverResponse

      if (response[i].status != 'fulfilled') {
        this._addDetails(rv)
        this.addSentryError("Network Error with RAIDA", i, response[i])
        callback("network", i)
        continue
      }

      serverResponse = response[i].value.data
      if (arrayLength == 0) {
        if (typeof(serverResponse) != 'object' || !('status' in serverResponse)) {
          console.error("Invalid response from RAIDA: " + i +". No status")
          this.addSentryError("Invalid Response. No Status", i, serverResponse)
          this._addDetails(rv)
          callback("error", i)
          continue
        }
      } else {
        if (!Array.isArray(serverResponse)) {
          console.error("Expected array from RAIDA: " + i)
          this.addSentryError("Expected to receive Array from RAIDA. But got something else", i, serverResponse)
          this._addDetails(rv)
          callback("error", i)
          continue
        }

        if (serverResponse.length != arrayLength) {
          console.error("Invalid length returned from RAIDA: " + i
            + ". Expected: " + arrayLength +", got " + serverResponse.length)
          this.addSentryError("Invalid length returned from RAIDA. Expected " + arrayLength + ", got " + serverResponse.length, i, serverResponse)
          this._addDetails(rv)
          callback("error", i)
          continue
        }
      }

      callback(serverResponse, i) 
      this._addDetails(rv, serverResponse)
    }
  }

  _addDetails(rv, serverResponse = null) {
    if (this.options.debug) {
      if (!('details' in rv)) {
        rv['details'] = []
      }
      rv['details'].push(serverResponse)
    }
  }

  _launchRequests(url, params = null, method = 'POST', callback = null, servers = null, data = null) {
    if (params == null)
      params = {}

    let pms = []

    let iteratedServers, iteratedServersIdxs
    if (servers != null) {
      iteratedServers = []
      for (let i = 0; i < servers.length; i++) {
        iteratedServers.push(this._raidaServers[servers[i]])
      }
      iteratedServersIdxs = servers
    } else {
      iteratedServers = this._raidaServers
      iteratedServersIdxs = [...Array(this._totalServers).keys()]
    }

    for (let i = 0; i < iteratedServers.length; i++) {
      let raidaIdx = iteratedServersIdxs[i]
      let rq = iteratedServers[i] + "/service/" + url

      let pm
      let options = {
        timeout : this.options.timeout
      }

      let rparams
      if (typeof(params) === 'object' && Array.isArray(params)) {
        rparams = params[raidaIdx]
      }
      else
        rparams = params

      if (method == 'GET') {
        options.params = rparams
        pm = this._axInstance.get(rq, options)
      } else {
        this.addBreadCrumb("POST " + rq, rparams)
        pm = this._axInstance.post(rq, qs.stringify(rparams), options)
      }

      pm.then(response => {
        if (callback != null) 
          callback(raidaIdx, url, data)

        return response.data
      }).catch(error => {
        if (error.response) {
          console.error("Invalid server response from RAIDA" + i + ": " + error.response.status)
          this.addSentryError("Invalid response from RAIDA", i, error)
        } else {
          console.error("Failed to get a respose from RAIDA" + i)
          this.addSentryError("Failed to get any response from RAIDA", i, error)
        }

        return null
      })

      pms.push(pm)
    }
    
    return allSettled(pms)
  }

  _initAxios() {
    this._axInstance = axios.create({
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded'
      }
    })
    this._axInstance.defaults.timeout = this.options.timeout
  }

  // Generate the array of RAIDA server URLs
  _generateServers() {
    for (let i = 0; i < this._totalServers; i++)
      this._raidaServers[i] = this.options.protocol + "://" + this.options.prefix 
        + i + "." +this.options.domain
  }

  // Check if the coin is valid
  _validateCoin(coin) {
    if (typeof(coin) !== 'object')
      return false;

    if (!('sn' in coin))
      return false;

    if (!('an' in coin))
      return false;

    if (typeof(coin.an) != 'object' || !Array.isArray(coin.an)) 
      return false

    if ('pan' in coin) {
      if (typeof(coin.pan) != 'object' || !Array.isArray(coin.pan)) 
        return false
      
      if (coin.pan.length != coin.an.length)
        return false
    } else {
      coin.pan = [...coin.an]
    }

    if (coin.an.length != this._totalServers)
      return false;

    if (!('nn' in coin))
      coin.nn = this.options.defaultCoinNn

    if (coin.sn < 1 || coin.sn > 16777216)
      return false

    if (coin.an.some(elem => !elem.match(/^[a-fA-F0-9]{32}$/)))
      return false

    return true
  }

  // Validate GUID
  _validateGuid(guid) {
    return guid.match(/^[a-fA-F0-9]{32}$/)
  }

  // Validate Event Code
  _validateEventCode(event_code) {
    return ["send", "receive", "transfer_out", "transfer_in", "break", "break_in_bank", "join", "join_in_bank", "unknown"].includes(event_code)
  }

  // Validate Initiator type
  _validateInitiatorType(itype) {
    return ['self', 'other_know', 'other_anonymous', 'unknown'].includes(itype)
  }

  // Put message toghether
  _assembleMessage(mparts) {
    let cs = 0, length

    // Determine the chunk size
    for (let i = 0; i < this._totalServers; i++) {
      if (mparts[i] == null)
              continue

      cs = mparts[i]['stripe'].length
      break
    }

    // Failed to determine the chunk size
    if (cs == 0)
      return null

    let collected = []
    for (let i = 0; i < this._totalServers; i++) {
      if (mparts[i] == null || typeof(mparts[i]) == 'undefined')
        continue

      if (!mparts[i]['stripe'] || !mparts[i]['mirror1'] || !mparts[i]['mirror2'])
        continue

      let cidx0 = i
      let cidx1 = i + 3
      let cidx2 = i + 6

      if (cidx1 >= this._totalServers)
        cidx1 -= this._totalServers

      if (cidx2 >= this._totalServers)
        cidx2 -= this._totalServers

      collected[cidx0] = mparts[i]['stripe']
      collected[cidx1] = mparts[i]['mirror1']
      collected[cidx2] = mparts[i]['mirror2']
    }

    let msg = []
    for (let i = 0; i < this._totalServers; i++) {
      if (!collected[i]) {
        console.log("Failed to assemble message. Chunk #" + i + " wasn't found on stripe and mirrors")
        return null
      }

      let totalStr = collected[i].split('')
      for (let j = 0; j < totalStr.length; j++) {
        let offset = i + j * this._totalServers
        msg[offset] = totalStr[j]
      }
    }

    // Check if the message is full
    for (let i = 0; i < msg.length; i++) {
      if (typeof(msg[i]) == 'undefined') {
        return null
      }
    }

    // Join the string together
    msg = msg.join('')

    // Trim pads at the end
    msg = msg.replace(/-+$/g, '');

    return msg
  }

  _getDataFromObjectMemo(mparts) {
    let data = this._assembleMessage(mparts)
    if (data == null)
      return null

    try {
      data = this._b64DecodeUnicode(data) 
    } catch (e) {
      console.log("Failed to decode strange message: " + data)
      return null
    }

    data = this._parseINIString(data)
    if (data == null) {
      console.log("Failed to parse INI: " + data)
      return null
    }

    if (!('general' in data)) {
      console.log("No general section in INI")
      return null
    }

    return data['general']
  }

  _getStripesMirrorsForObject(obj) {
    let str = "[general]\n"

    let date = Math.floor(Date.now() / 1000)
    
    str += "date=" + date + "\n"
    for (let key in obj) {
      str += key + "=" + obj[key] + "\n"
    }

    str = this._b64EncodeUnicode(str) 
    let data = this._splitMessage(str)

    return data
  }

  _getNFTStringForObject(obj, data, proofdata) {
    let str = "[general]\n"
    for (let key in obj) {
      str += key + "=" + obj[key] + "\n"
    }

    let mstr = this._b64EncodeUnicode(str) 
    let finalStr = mstr + this.options.nftMetadataSeparator + data  
    if (proofdata != null)
      finalStr += this.options.nftMetadataSeparator + proofdata

    console.log(finalStr)
    let fdata = this._splitMessage(finalStr)

    return fdata

  }

  _getNFTObjectFromString(mparts) {
    let data = this._assembleMessage(mparts)
    if (data == null)
      return null

    let vals = data.split(this.options.nftMetadataSeparator)
    if (vals.length != 2 && vals.length != 3) 
      return null

    let metadata
    try {
      metadata = this._b64DecodeUnicode(vals[0]) 
    } catch (e) {
      console.log("Failed to decode strange message: " + vals[0])
      return null
    }

    data = this._parseINIString(metadata)
    if (data == null) {
      console.log("Failed to parse INI: " + data)
      return null
    }

    if (!('general' in data)) {
      console.log("No general section in INI")
      return null
    }

    let rv =  {
      'metadata' : data['general'],
      'data' : vals[1]
    }

    if (vals.length == 3) {
      rv.proofdata = vals[2]
    }

    return rv
  }

  _getStripesMirrorsForObjectMemo(guid, memo, amount, from) {
    let str = "[general]\n"

    let date = Math.floor(Date.now() / 1000)
    
    str += "date=" + date + "\n"
    str += "guid=" + guid + "\n"
    str += "from=" + from + "\n"
    str += "amount=" + amount + "\n"
    str += "description=" + memo + "\n"

    str = this._b64EncodeUnicode(str) 
    let data = this._splitMessage(str)

    return data
  }

  _getObjectMemo(guid, memo, amount, from) {
    let data = this._getStripesMirrorsForObjectMemo(guid, memo, amount, from)

    let d = []
    let ms = this.options.memoMetadataSeparator
    for (let i = 0; i < this._totalServers; i++) {
      d[i] = memo + ms + guid + ms + data[i]['stripe'] + ms + data[i]['mirror1'] + ms + data[i]['mirror2']
    }

    return d
  }



  _splitMessage(message) {
    // Pad the message to have it multily of 25
    let pads = message.length % this._totalServers
    if (pads > 0)
      for (let i = 0; i < (this._totalServers - pads); i++)
        message += "-"
    // Break the message
    let cs = message.split('')

    // Init array
    let nrmessage = []
    for (let i = 0; i < this._totalServers; i++) {
      nrmessage[i] = {
        'stripe' : "",
        'mirror1' : "",
        'mirror2' : ""
      }
    }

    // Go over the message
    for (let i = 0; i < cs.length; i++) {
      // Raida index
      let ridx = i % this._totalServers

      // Chunk indexes
      let cidx0 = i + 3
      let cidx1 = i + 6
      if (cidx0 >= cs.length)
        cidx0 -= cs.length

      if (cidx1 >= cs.length)
        cidx1 -= cs.length

      // Fill the message with three chunks
      nrmessage[ridx]['stripe'] += cs[i]
    }

    for (let i = 0; i < this._totalServers; i++) {
      let cidx0 = i + 3
      let cidx1 = i + 6
      if (cidx0 >= this._totalServers)
        cidx0 -= this._totalServers

      if (cidx1 >= this._totalServers)
        cidx1 -= this._totalServers

      nrmessage[i]['mirror1'] += nrmessage[cidx0]['stripe']
      nrmessage[i]['mirror2'] += nrmessage[cidx1]['stripe']
    }

    return nrmessage
  }

  // Base64 utils
  _b64EncodeUnicode(str) {
    let output
    if (_isBrowser) {
      output = btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
          return String.fromCharCode('0x' + p1);
        }
      ))
    } else {
      output = Buffer.from(str).toString('base64')
    }

    return output
  }

  _b64DecodeUnicode(str) {
    let output
  
    if (_isBrowser) {
      output = decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
    } else {
      output = Buffer.from(str, 'base64').toString('utf-8')
    }

    return output
  }

  // Neighbour table
  _getNeighbour(raidaIdx, offset) {
    let result = raidaIdx + offset

    if (result < 0)
      result += this._totalServers

    if (result >= this._totalServers)
      result -= this._totalServers

    return result
  }

  _initNeighbours() {
    let sideSize

    sideSize = Math.sqrt(this._totalServers)
    if (sideSize * sideSize != this._totalServers) {
      console.error("Invalid RAIDA dimensions")
      return
    }

    let trustedServers = Array(this._totalServers)
    let trustedTriads =  Array(this._totalServers)
    for (let i = 0; i < this._totalServers; i++) {
      trustedServers[i] = []

      trustedServers[i][0] = this._getNeighbour(i, -sideSize - 1)
      trustedServers[i][1] = this._getNeighbour(i, -sideSize)
      trustedServers[i][2] = this._getNeighbour(i, -sideSize + 1)
      trustedServers[i][3] = this._getNeighbour(i, -1)
      trustedServers[i][4] = this._getNeighbour(i, 1)
      trustedServers[i][5] = this._getNeighbour(i, sideSize - 1)
      trustedServers[i][6] = this._getNeighbour(i, sideSize)
      trustedServers[i][7] = this._getNeighbour(i, sideSize + 1)

      trustedTriads[i] = Array(4)
      trustedTriads[i][0] = [ trustedServers[i][0], trustedServers[i][1], trustedServers[i][3], trustedServers[i][7] ]
      trustedTriads[i][1] = [ trustedServers[i][1], trustedServers[i][2], trustedServers[i][4], trustedServers[i][5] ]
      trustedTriads[i][2] = [ trustedServers[i][3], trustedServers[i][5], trustedServers[i][6], trustedServers[i][2] ]
      trustedTriads[i][3] = [ trustedServers[i][4], trustedServers[i][6], trustedServers[i][7], trustedServers[i][0] ]
    }

    this._trustedTriads = trustedTriads
  }

  _getA(a, cnt) {
    let i, j
    let sns = Array(cnt)

    for (i = 0, j = 0; i < sns.length; i++) {
      if (a[i] == 0)
        continue;

      sns[j] = a[i]
      a[i] = 0
      j++

      if (j == cnt)
        break
    }

    if (j != cnt)
      return null

    return sns
  }

  _get25B(sb, ss) {
    let sns, rsns
    rsns = Array(9)

    sns = this._getA(sb, 4)
    if (sns == null)
      return null
    for (let i = 0; i < 4; i++)
      rsns[i] = sns[i]

    sns = this._getA(ss, 5)
    if (sns == null)
      return null
    for (let i = 0; i < 5; i++)
      rsns[i + 4] = sns[i]

    return rsns 
  }

  _get100E(sb, ss, sss) {
    let sns, rsns
    rsns = Array(12)

    sns = this._getA(sb, 3)
    if (sns == null)
      return null

    for (let i = 0; i < 3; i++)
      rsns[i] = sns[i]

    sns = this._getA(ss, 4)
    if (sns == null)
      return null

    for (let i = 0; i < 4; i++)
      rsns[i + 3] = sns[i]

    sns = this._getA(sss, 5)
    if (sns == null)
      return null
    
    for (let i = 0; i < 5; i++)
      rsns[i + 7] = sns[i]

    return rsns
  }

  _get250E(sb, ss, sss, ssss) {
    let sns, rsns
    rsns = new Array(12)

    sns = this._getA(sb, 2)
    if (sns == null)
      return null
    for (let i = 0; i < 2; i++)
      rsns[i] = sns[i]

    sns = this._getA(ss, 1)
    if (sns == null)
      return null
    rsns[2] = sns[0]

    sns = this._getA(sss, 4)
    if (sns == null)
      return null
    for (let i = 0; i < 4; i++)
      rsns[i + 3] = sns[i]

    sns = this._getA(ssss, 5)
    if (sns == null)
      return null
    for (let i = 0; i < 5; i++)
      rsns[i + 7] = sns[i]

    return rsns
  }

  _calcAmount(sns) {
    let total = 0
    for (let i = 0; i < sns.length; i++)
      total += this.getDenomination(sns[i])

    return total
  }

  _countCoinsFromArray(coins) {
    let totals = new Array(6);
    totals.fill(0)

    for (let i = 0; i < coins.length; i++) {
      let denomination = this.getDenomination(coins[i]);
      if (denomination == 1)
        totals[0]++;
      else if (denomination == 5)
        totals[1]++;
      else if (denomination == 25)
        totals[2]++;
      else if (denomination == 100)
        totals[3]++;
      else if (denomination == 250)
        totals[4]++
      else
        continue;

      totals[5] += denomination;
    }

    return totals;
  }

  _getExpCoins(amount, totals, loose) {
    let savedAmount = amount;
   
    if (amount > totals[6]) {
      console.error("Not enough coins")
      return null;
    }

    if (amount < 0)
      return null;
        
    let exp_1, exp_5, exp_25, exp_100, exp_250
    exp_1 = exp_5 = exp_25 = exp_100 = exp_250 = 0
    for (let i = 0; i < 2; i++) {
      exp_1 = exp_5 = exp_25 = exp_100 = 0
      if (i == 0 && amount >= 250 && totals[4] > 0) {
        exp_250 = (Math.floor(amount / 250) < (totals[4])) ? Math.floor(amount / 250) : (totals[4])
        amount -= (exp_250 * 250);
      }

      if (amount >= 100 && totals[3] > 0) {
        exp_100 = (Math.floor(amount / 100) < (totals[3])) ? Math.floor(amount / 100) : (totals[3])
        amount -= (exp_100 * 100);
      }

      if (amount >= 25 && totals[2] > 0) {
        exp_25 = (Math.floor(amount / 25) < (totals[2])) ? Math.floor(amount / 25) : (totals[2])
        amount -= (exp_25 * 25);
      }

      if (amount >= 5 && totals[1] > 0) {
        exp_5 = (Math.floor(amount / 5) < (totals[1])) ? Math.floor(amount / 5) : (totals[1])
        amount -= (exp_5 * 5);
      }

      if (amount >= 1 && totals[0] > 0) {
        exp_1 = (amount < (totals[0])) ? amount : (totals[0])
        amount -= (exp_1);
      }
        
      if (amount == 0)
        break;
        
      if (i == 1 || exp_250 == 0) {
        if (loose)
          break;
      
        return null;
      }
            
      exp_250--
      amount = savedAmount - exp_250 * 250
    }
       
    let rv = new Array(5)
    rv[0] = exp_1
    rv[1] = exp_5
    rv[2] = exp_25
    rv[3] = exp_100
    rv[4] = exp_250
        
    return rv
  }


  _pickCoinsAmountFromArrayWithExtra(coins, amount) {
    let totals, exps
    let collected, rest
    let denomination
    let coinsPicked = []
        
    totals = this._countCoinsFromArray(coins)
    exps = this._getExpCoins(amount, totals, true)
        
    collected = rest = 0
    for (let i = 0; i < coins.length; i++) {
      denomination = this.getDenomination(coins[i]);
      if (denomination == 1) {
        if (exps[0]-- > 0) {
          coinsPicked.push(coins[i])
          collected += denomination
        } 
      } else if (denomination == 5) {
        if (exps[1]-- > 0) {
          coinsPicked.push(coins[i])
          collected += denomination
        }
      } else if (denomination == 25) {
        if (exps[2]-- > 0) {
          coinsPicked.push(coins[i])
          collected += denomination
        } 
      } else if (denomination == 100) {
        if (exps[3]-- > 0) {
          coinsPicked.push(coins[i])
          collected += denomination
        } 
      } else if (denomination == 250) {
        if (exps[4]-- > 0) {
          coinsPicked.push(coins[i])
          collected += denomination
        } 
      } 
    }
    let isAdded;
    rest = amount - collected;
    let extraSN = 0

    if (rest == 0) {
      return {coins: coinsPicked, extra: 0};
    }

    for (let i = 0; i < coins.length; i++) {
      denomination = this.getDenomination(coins[i])
      extraSN = coins[i]
        
      if (rest > denomination)
        continue;
        
      isAdded = false;
      for (let j = 0; j < coinsPicked.length; j++) {
        if (coinsPicked[j] == coins[i]) {
          isAdded = true
          break
        }
      }
        
      if (isAdded) {
        continue;
      }
        
      break;
    }

    return {coins: coinsPicked, extra: extraSN};
  }

  _validateCard(cardnumber, cvv) {
    if (!cardnumber.match(/^\d{16}$/))
      return false

    if (!cvv.match(/^\d+$/))
      return false

    if (!cardnumber.startsWith("401")) 
      return false

    let total = 0;
    let precardNumber = cardnumber.substring(0, cardnumber.length - 1)
    let reverse = precardNumber.split("").reverse().join("")
    for (let i = 0; i < reverse.length; i++) {
      let num = parseInt(reverse.charAt(i))
      if ((i + 3) % 2) {
        num *= 2
        if (num > 9)
          num -= 9
      }
      total += num;
    }

    let remainder = cardnumber.substring(cardnumber.length - 1)
    let calcRemainder = 10 - (total % 10)
    if (calcRemainder == 10)
      calcRemainder = 0

    if (calcRemainder != remainder) 
      return false

    return true
  }

  _addCoinsToRarr(raidaIdx, coins) {
    for (let i = 0; i < coins.length; i++) {
      this._addCoinToRarr(raidaIdx, coins[i])
    }
  }

  _addCoinToRarr(raidaIdx, coin) {
    if (!(raidaIdx in this._rarr))
      this._rarr[raidaIdx] = []

    this._rarr[raidaIdx].push(coin.sn)
  }

  // Error return
  _getError(msg) {
    this.addBreadCrumbError("Returning Error To Client: " + msg)
    return {
      'status' : 'error',
      'errorText' : msg
    }
  }

  // Error Code Return
  _getErrorCode(code, msg) {
    this.addBreadCrumbError("Returning Error Code To Client: " + code + ": " + msg)
    return {
      // Legacy
      'status' : 'error',
      'errorText': msg,

      'code' : code,
      'text' : msg
    }
  }

  // network byte order
  _getUint32(data, offset) {
    let a = (data[offset] << 24 | data[offset + 1] << 16 |
      data[offset + 2] << 8 | data[offset + 3])

    return a >>> 0
  }

  // network byte order
  _setUint32(data, offset, value) {
    data[offset] = (value >> 24) & 0xff
    data[offset + 1] = (value >> 16) & 0xff
    data[offset + 2] = (value >> 8) & 0xff
    data[offset + 3] = (value) & 0xff
  }

  // initCrc
  _initCrcTable() {
    let c
    this._crcTable = []
    for (let i = 0; i < 256; i++) {
      c = i
      for (let k = 0; k < 8; k++) {
        c = ((c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1));
      }
      this._crcTable[i] = c
    }
  }

  // calc crc32
  _crc32(data, offset, length) {
    if (this._crcTable == null)
      this._initCrcTable()

    let crc = 0 ^ (-1)
    for (let i = 0; i < length; i++) {
      crc = (crc >>> 8) ^ this._crcTable[(crc ^ data[offset + i]) & 0xff]
    }

    return (crc ^ (-1)) >>> 0;
  }

  _base64ArrayBuffer(bytes) {
    let base64  = ''
    let encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

    let byteLength = bytes.length
    let byteRemainder = byteLength % 3
    let mainLength = byteLength - byteRemainder

    let a, b, c, d
    let chunk

    // Main loop deals with bytes in chunks of 3
    for (let i = 0; i < mainLength; i = i + 3) {
      // Combine the three bytes into a single integer
      chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

      // Use bitmasks to extract 6-bit segments from the triplet
      a = (chunk & 16515072) >> 18 
      b = (chunk & 258048) >> 12 
      c = (chunk & 4032) >>  6 
      d = chunk & 63    

      // Convert the raw binary segments to the appropriate ASCII encoding
      base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
    }

    // Deal with the remaining bytes and padding
    if (byteRemainder == 1) {
      chunk = bytes[mainLength]
      a = (chunk & 252) >> 2 

      // Set the 4 least significant bits to zero
      b = (chunk & 3) << 4 
      base64 += encodings[a] + encodings[b] + '=='
    } else if (byteRemainder == 2) {
      chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

      a = (chunk & 64512) >> 10 
      b = (chunk & 1008) >> 4

      // Set the 2 least significant bits to zero
      c = (chunk & 15) << 2 
      base64 += encodings[a] + encodings[b] + encodings[c] + '='
    }
    
    return base64
  }

  _basePngChecks(imgData) {
    if (imgData[0] != 0x89 && imgData[1] != 0x50 && imgData[2] != 0x4e && imgData[3] != 0x47 
      && imgData[4] != 0x0d && imgData[5] != 0x0a && imgData[6] != 0x1a && imgData[7] != 0x0a) {
      return "Invalid PNG signature"
    }
    
    let chunkLength = this._getUint32(imgData, 8)
    let headerSig = this._getUint32(imgData, 12)
    if (headerSig != 0x49484452) {
      return "Invalid PNG header"
    }

    let idx = 16 + chunkLength
    let crcSig = this._getUint32(imgData, idx)
    let calcCrc = this._crc32(imgData, 12, chunkLength + 4)
    if (crcSig != calcCrc) {
      return "Invalid PNG crc32 checksum"
    }

    return idx

  }

  _validResult(result) {
    return result == this.__authenticResult || result == this.__frackedResult
  }

  // Parse INI string and return Object
  _parseINIString(data){
    var regex = {
      section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
      param: /^\s*([^=]+?)\s*=\s*(.*?)\s*$/,
      comment: /^\s*;.*$/
    }

    var value = {}
    var lines = data.split(/[\r\n]+/)
    var section = null

    lines.forEach(function(line) {
      if (regex.comment.test(line)){
        return;
      } else if(regex.param.test(line)){
        var match = line.match(regex.param);
        if(section){
          value[section][match[1]] = match[2];
        }else{
          value[match[1]] = match[2];
        }
      } else if (regex.section.test(line)){
        var match = line.match(regex.section);
        value[match[1]] = {};
        section = match[1];
      } else if (line.length == 0 && section){
        section = null;
      }
    })

    return value;
  }

  // Collects hashData from ServerResponses. Auxillary function that goes through each response and tries to find common elements and their counts (an element might be a serial number or a GUID of a statement
  _collectHdata(serverResponses, targetKey, level = 1) {
    let hashData = {}
    for (let raidaIdx = 0; raidaIdx < serverResponses.length; raidaIdx++) {
      let serverResponse = serverResponses[raidaIdx]
        if (!serverResponse)
          continue

      if (level == 1) {
        let item = serverResponse.data
        let key = item[targetKey]
        if (typeof(key) == 'undefined')
          continue

        if (!(key in hashData))
          hashData[key] = {}

        hashData[key][raidaIdx] = item
      } else if (level == 2) {
        for (let j = 0; j < serverResponse.data.length; j++) {
          let item = serverResponse.data[j]
          if (typeof(item) == 'undefined')
            continue

          let key = item[targetKey]
          if (!(key in hashData))
            hashData[key] = {}

          hashData[key][raidaIdx] = item
        }
      }
    }

    return hashData
  }

  // Adds records by analyzing serverResponses. The function uses 'key' to find a group_by key. Then it will do 'fcall' call
  _syncAdd(serverResponses, key, fcall) {
    let unavailable = 0
    let servers = []
    for (let v = 0; v < serverResponses.length; v++) {
      if (!serverResponses[v]) {
        unavailable++
      }
    }
    
    // Check if we need to call fix_groups
    let hashData = this._collectHdata(serverResponses, key, 2)
    let drqdata = []
    for (let eid in hashData) {
      let quorum = Object.keys(hashData[eid]).length

      // We believe that RAIDA servers that don't respond have our data
      quorum += unavailable
      if (quorum < this.options.syncThreshold || quorum == this._totalServers)
        continue

      let varr = Object.keys(hashData[eid])
      for (let r = 0; r < this._totalServers; r++) {
        if (varr.includes("" + r))
          continue

        servers.push(parseInt(r))
      }

      drqdata.push(eid)
    }

    // Make them uniq
    servers = servers.filter((v, i, a) => a.indexOf(v) === i)

    if (drqdata.length > 0) {
      let lrqdata = []
      for (let i = 0; i < this._totalServers; i++) {
        lrqdata.push({
          guid: drqdata
        })
      }

      // Don't need to wait for result
      this._launchRequests(fcall, lrqdata, 'GET', () => {}, servers)
    }
  }

  // Deletes records by analyzing serverResponses. The function uses 'key' to find a group_by key. Then it will do 'fcall' call
  _syncDelete(serverResponses, key, fcall) {
    let unavailable = 0
    let servers = []
    for (let v = 0; v < serverResponses.length; v++) {
      if (!serverResponses[v]) {
        unavailable++
      }
    }
    
    // Check if we need to call fix_groups
    let hashData = this._collectHdata(serverResponses, key, 2)
    let drqdata = []
    for (let eid in hashData) {
      let quorum = Object.keys(hashData[eid]).length

      // We believe that RAIDA servers that don't respond have our data
      quorum += unavailable
      if (quorum >= this.options.syncThreshold)
        continue

      let varr = Object.keys(hashData[eid])
      for (let r = 0; r < this._totalServers; r++) {
        if (varr.includes("" + r)) {
          servers.push(parseInt(r))
          continue
        }
      }

      drqdata.push(eid)
    }

    // Make them uniq
    servers = servers.filter((v, i, a) => a.indexOf(v) === i)

    if (drqdata.length > 0) {
      let lrqdata = []
      for (let i = 0; i < this._totalServers; i++) {
        lrqdata.push({
          guid: drqdata
        })
      }

      // Don't need to wait for result
      this._launchRequests(fcall, lrqdata, 'GET', () => {}, servers)
    }
  }
}

// Error Codes
RaidaJS.ERR_NO_ERROR = 0x0

// Params
RaidaJS.ERR_PARAM_MISSING_COIN = 0x1001
RaidaJS.ERR_PARAM_INVALID_COIN = 0x1002
RaidaJS.ERR_PARAM_MISSING_GUID = 0x1003
RaidaJS.ERR_PARAM_INVALID_GUID = 0x1004
RaidaJS.ERR_PARAM_MISSING_AMOUNT = 0x1005
RaidaJS.ERR_PARAM_INVALID_AMOUNT = 0x1006
RaidaJS.ERR_PARAM_INVALID_EVENT_CODE = 0x1007
RaidaJS.ERR_PARAM_INVALID_INITIATOR_TYPE = 0x1008
RaidaJS.ERR_PARAM_INVALID_TIMESTAMP = 0x1009
RaidaJS.ERR_PARAM_MISSING_DATA = 0x1010
RaidaJS.ERR_PARAM_INVALID_DATA = 0x1011
RaidaJS.ERR_PARAM_MISSING_FILENAME = 0x1012
RaidaJS.ERR_PARAM_UNSUPPORTED_NFT_PROTOCOL = 0x1013
RaidaJS.ERR_PARAM_MISSING_METADATA = 0x1014
RaidaJS.ERR_PARAM_NFT_MISSING_ID_PROOF = 0x1015
RaidaJS.ERR_PARAM_NFT_SIZE_IS_TOO_BIG = 0x1016
RaidaJS.ERR_PARAM_BILLPAY_MISSING_PAYDATA = 0x1017
RaidaJS.ERR_PARAM_BILLPAY_INVALID_PAYDATA = 0x1018
RaidaJS.ERR_PARAM_BILLPAY_PAYDATA_INVALID_METHOD = 0x1019
RaidaJS.ERR_PARAM_BILLPAY_PAYDATA_INVALID_FILE_FORMAT = 0x1020
RaidaJS.ERR_PARAM_BILLPAY_PAYDATA_INVALID_AMOUNT = 0x1021
RaidaJS.ERR_PARAM_BILLPAY_PAYDATA_INVALID_STATUS = 0x1022
RaidaJS.ERR_PARAM_BILLPAY_PAYDATA_DUPLICATED_VALUE = 0x1023
RaidaJS.ERR_PARAM_BILLPAY_EMPTY_PAYDATA = 0x1024
RaidaJS.ERR_PARAM_MISSING_DNS_NAME = 0x1025

// Response
RaidaJS.ERR_RESPONSE_TOO_FEW_PASSED = 0x2001
RaidaJS.ERR_RESPONSE_FAILED_TO_BUILD_MESSAGE_FROM_CHUNKS = 0x2002
RaidaJS.ERR_RESPONSE_RECORD_NOT_FOUND = 0x2003

// Funds
RaidaJS.ERR_NOT_ENOUGH_CLOUDCOINS = 0x4001

// Network
RaidaJS.ERR_DNS_RECORD_NOT_FOUND = 0x5001
RaidaJS.ERR_FAILED_TO_GET_TICKETS = 0x5002
RaidaJS.ERR_DNS_RECORD_ALREADY_EXISTS = 0x5003
RaidaJS.ERR_DNS_SERVER_INCORRECT_RESPONSE = 0x5004

// Billpay
RaidaJS.ERR_BILLPAY_SENT_PARTIALLY = 0x6001

// Export to the Window Object if we are in browser
if (_isBrowser) {
  window.RaidaJS = RaidaJS
}

// ES6 export
export default RaidaJS

// Es5 export
//module.exports = RaidaJS
