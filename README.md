# class Raida
There are two different files here. One is for Internet Browsers and the other is for Node.js programs. 

## Web Browser (in 'lib' folder)

The raida.min.js file contains the Raida class and other supporting libraries, such as Axios. The Raida class has functions that allow you to connect to RAIDA Cloud such as CloudCoin and CloudBanks such as SkyWallet quickly. The Raida class uses the latest callback, tracing, and debug techniques available today.

## Node.js (in 'dist' folder)
The node.js repository and can be installed via npm install raidajs. It doesn't have libraries in it.  (like axios) Libraries are installed by npm using dependency tree.


## Table of Contents

[Install](README.md#Installing)

[Example](README.md#Example)

[RaidaJS](README.md#RaidaJS)

[Errors](README.md#Errors)

[apiEcho](README.md#apiEcho)

[apiDetect](README.md#apiDetect)

[apiSend](README.md#apiSend)

[apiFixFracked](README.md#apiFixFracked)

[apiFixTransferSync](README.md#apiFixTransferSync)

[apiFixTransfer](README.md#apiFixTransfer)

[apiResolveSkyWallet](README.md#apiResolveSkyWallet)

[apiTransfer](README.md#apiTransfer)

[apiReceive](README.md#apiReceive)

[embedImage](README.md#embedImage)

[extractStack](README.md#extractStack)

[apiGetticket](README.md#apiGetticket)

[apiShowCoins](README.md#apiShowCoins)

[apiShowCoinsAsArray](README.md#apiShowCoinsAsArray)

[apiShowBalance](README.md#apiShowBalance)

[apiRegisterSkyWallet](README.md#apiRegisterSkyWallet)

[apiViewreceipt](README.md#apiViewreceipt)

[apiGetCCByUsernameAndPassword](README.md#apiGetCCByUsernameAndPassword)

[apiCreateCCForRegistration](README.md#apiCreateCCForRegistration)

[apiGetCCByCardData](README.md#apiGetCCByCardData)

[apiPay](README.md#apiPay)

[apiGetFreeCoin](README.md#apiGetFreeCoin)

[apiCreateRecord](README.md#apiCreateRecord)

[apiShowRecords](README.md#apiShowRecords)

[apiDeleteRecord](README.md#apiDeleteRecord)

[apiHealthCheck](README.md#apiHealthCheck)

[apiNFTInsert](README.md#apiNFTInsert)

[apiNFTRead](README.md#apiNFTRead)

[apiNFTDelete](README.md#apiNFTDelete)

[apiBillPay](README.md#apiBillPay)

[apiBillPayList](README.md#apiBillList)


## Installing

Using npm:

```bash
$ npm install raidajs
```

Using html:
```html
<script src="https://yourwebsite.com/dist/raidajs.web.js"></script>
```

## Example


Browser:
```js
let raidaJS = new RaidaJS({ timeout: 20000, debug: false })
raidaJS.apiEcho().then(response => { 
	console.log("Available servers: " + response.onlineServers) 
})

let data = [{
	sn: 20,
	an: ["01f2b05d74192e31478846f1b7bdd661","02025cf02053edb09b93ef532a37099d",
	"03518632d60f897d84ae62e75a7059a3","04dfb17c08b6dbc2846fbe8938bece1a",
	"050744735d8b124cc0e31a349770d1f4","0613fcc1a2806a75322d5a9fda0feaa4",
	"0711a8eb968d4d4b0dd82d8a05b2d8eb","08f8f118f4e76e8cc1488514e6bc6881",
	"091849f975223a06e765d3433d3e6a9b","1002d00825ccae4c3507cfe1749980d1",
	"11925225e48a9b0fe497dcde66de9227","12688f1c40550d113b8f4f513bf6b8d4",
	"132b39d22d0b3e4012eb6e962e99b31b","1464dacd34ace94eb4abfe2f378abe87",
	"15890b7fa38069745c1b7c7729b242c1","16a0120db1384da7fed62a9100c2f56f",
	"17500e20b49fd14ea5880aa279061aea","18c35043e9a0ea06dc3a29e0409af6ed",
	"195110f4d85b09cf6618aa13164f6b87","20cf9c8ca170528891bb9eb4ffcbaec0",
	"216c76f5422e92297f4daa453a0d195b","2208a6edb997d0abfec8f88782ff61bd",
	"23d153108902aa4bfe5dab55d9298250","243ec57476e3923eb3f4d9309c5651d6",
	"2538b4aafd39bd136141a2ac31fc8141"]
}]

raidaJS.apiDetect(data).then(response => {
	console.log("Authentic Notes: " + response.authenticNotes)
	console.log("Total Notes: " + response.totalNotes)
	Object.keys(response.result).map(sn => {
		console.log("SN: " + sn + " pown: " + response.result[sn].pownstring)
	})
})

```

Node.js ES6
```js
import RaidaJS from "raidajs"

let raidaJS = new RaidaJS()
raidaJS.apiEcho()
```


Node.js ES5
```js
let RaidaJS = require('raidajs').default

let raidaJS = new RaidaJS()
raidaJS.apiEcho()
```

## RaidaJS

Here are the available config options for making requests. None of them is required.

```js
let options = {
	// The main domain for the RAIDA
	domain : "cloudcoin.global", 

	// Prefix used to construct the final url
	prefix : "raida", 

	// Protocol schema
	protocol: "https",

	// Read Timeout for HTTP requests in milliseconds
	timeout: 10000, 

	// Default Network Number
	defaultCoinNn: 1,

	// Debug. If set, an additional 'details' field will be set in the response data.
	// The field contains a raw response from the RAIDA server
	debug: false,

	// RAIDA to query when we create SkywWallets
	defaultRaidaForQuery: 7,

	// DDNS service for SkyWallets
	ddnsServer: "ddns.cloudcoin.global",

  // Maximum coins to deal at a time
  maxCoinsPerIteraiton: 200,

  // Maximum size for NFT Token and ID Proof Picture. Default is 6Mb
  maxNFTSize: 6000000,

  // Sentry DSN. If passed the library will report errors to Sentry
  sentryDSN: "https://b332c30ba22b4dd199765eb244dd776c@o565766.ingest.sentry.io/5710548"
}

let raidaJS = new RaidaJS(options)
```

## RaidaJS Api Methods: Methods that contact the RAIDA.

All methods are executed asynchronously and return Javascript Promise Object
If there is an error with the input data the method returns null

Each API method has an optional `callback` argument. If defined this function is called after each raida returns or fails. It helps to track the progress of the whole bunch of requests

```js
let progress = 0
raidaJS.apiDetect(data, raidaNumber => {
	console.log("RAIDA " + raidaNumber + " finished")
	progress++
}).then(response => console.log(response))	
```

### Set functions

```js
raidaJS.setTimeout(15000)
raidaJS.setProtocol("http")
raidaJS.setDomain("raida.tech")
raidaJS.setDefaultNetworkNumber(2)
raidaJS.setDefaultRAIDA(7)
```

### Get functions
```js
// Returns the current set of the RAIDA URLs
raidaJS.getServers()

// Returns the denomination of the coin
raidaJS.getDenomination(12500)
```

### Errors
If any method fails or an error occurs the function will retuns the following object:
```js
{
  // Error Code
  "code" : integer

  // Error plain-text description in English
  "text" : string,
}
```

Error Codes are two-bytes hexidecimals defined on the RaidaJS Class.
E.g.

```js
RaidaJS.ERR_DNS_RECORD_NOT_FOUND = 0x5001
```

If there is no error and function returns 'success' the 'code' field is zero

```js
RaidaJS.ERR_NO_ERROR = 0x0
```

Error Codes
```js
// Params Validation
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

// Response Errors
RaidaJS.ERR_RESPONSE_TOO_FEW_PASSED = 0x2001
RaidaJS.ERR_RESPONSE_FAILED_TO_BUILD_MESSAGE_FROM_CHUNKS = 0x2002
RaidaJS.ERR_RESPONSE_RECORD_NOT_FOUND = 0x2003

// Funds
RaidaJS.ERR_NOT_ENOUGH_CLOUDCOINS = 0x4001

// Network Related 
RaidaJS.ERR_DNS_RECORD_NOT_FOUND = 0x5001

// Billpay erros
RaidaJS.ERR_BILLPAY_SENT_PARTIALLY = 0x6001
```


### Api Methods

#### apiEcho

Echos RAIDA servers

Input:

```js
// Example call to echo the RAIDA:
raidaJS.apiEcho()

// Example call the echo the RAIDA and execute another function (callback) after each RAIDA server returns the response:
raidaJS.apiEcho(raidaNumber => {})
```

Data Returned:

```js
// The call will return an anonymous object that will have three properties:
{
	onlineServers: Number,  // The number of servers (0-25) that responded to the echo request. 
	totalServers: Number,   // This is always 25 and represents the the number of clouds that are in the RAIDA.
	details: []		// A string array of all the JSON responses from every RAIDA's echo request. This is not usually needed but handy for trouble shooting
}
```

#### apiDetect

Sends multi_detect request to the RAIDA

Input:

```js
// Array of coins. If pan parameter is not set, it will be replicated from an
let params = [{sn:1,an:[]},{sn:2,an:[]}]

// Example call to the RAIDA:
raidaJS.apiDetect(params)

// Example call to the RAIDA and execute another function (callback) after each RAIDA server returns the response:
raidaJS.apiDetect(params, raidaNumber => {})
```

Data Returned:

```js
{
	// Status of the request
	status: String,			// 'done' or 'error'
	errorText: String,		// Set if the status above is 'error'

	// General Statistics
	totalNotes: Number,		// The number of notes in the initial request
	authenticNotes: Number,		// The number of authentic notes
	frackedNotes: Number,		// The number of fracked notes
	counterfeitNotes: Number,	// The number of counterfeit notes
	errorNotes: Number,		// The number of notes failed to be authenticated

	// Per-coin results
	result: {
		coinSN0 : {		// Coin serial number
			// Coin Info
			nn: Number,	// Coin network number
			sn: Number,	// Coin serial number
			denomination: Number,	// Denomination. One of (1, 5, 25, 100, 250)

			// Results from the RAIDA servers 
			authentic: Number,	// The number of RAIDA servers that think the coin is authentic
			counterfeit: Number,	// The number of RAIDA servers that think the coin is counterfeit
			errors: Number,		// The number of RAIDA servers that failed to process the coin

			// Resulting Authenticity Numbers (if powned or frackfixed)
			an: [],

			// Computed Results
			pownstring: String,	
			result: String		// The result. One of the (authentic, counterfeit, fracked, error)
		},

		coinSN1 : {	// Next coin
			...
		}
	}
}
```

#### apiResolveSkyWallet

The function receives a SkyWallet DNS name (e.g. my.skywallet.cc) and resolves it to a Serial Number. The library first queries CloudFlare DNS and if it fails the Google DNS will be queried. The function is asynchronous and returns a Promise

Input:
```js
// SkyWallet name 
string
```

Data Returned
```js
{
  // Always RaidaJS.ERR_NO_ERROR (0x0) if the response is successful
  "code" : integer,

  // Serial Number
  "sn" : integer
}
```

Example
```js
let r = r.apiResolveSkyWallet("test.skywallet.cc").then(response => {
  if (response.code != RaidaJS.ERR_NO_ERROR) {
    console.log("Error Occured: " + response.text + ", Code: " + response.code)
    return
  }

  console.log("Serial Number: " + response.sn)
})
```

Error Codes:
```js
// A-Record of the SkyWallet was not found neither by Google DNS nor by CloudFlare DNS
ERR_DNS_RECORD_NOT_FOUND = 0x5001

// The library failed to connect to Google DNS and CloudFlare DNS
ERR_DNS_NETWORK_ERROR = 0x5002

// The library failed to parse results from Goolge DNS and CloudFlare DNS
ERR_DNS_PARSE_ERROR = 0x5003
```



#### apiTransfer

Transfers data from one Sky Wallet to another

Input:

```js
// Parameters
let params = {
	// Source Wallet Info.
	// Serial Number
	sn: 102,

	// Array of AN numbers
	an:["44f2b05d74192e31478846f1b7bdd661","55025cf02053edb09b93ef532a37099d","66518632d60f897d84ae62e75a7059a3","77dfb17c08b6dbc2846fbe8938bece1a","880744735d8b124cc0e31a349770d1f4","cd13fcc1a2806a75322d5a9fda0feaa4","f611a8eb968d4d4b0dd82d8a05b2d8eb","23f8f118f4e76e8cc1488514e6bc6881","d31849f975223a06e765d3433d3e6a9b","4502d00825ccae4c3507cfe1749980d1","62925225e48a9b0fe497dcde66de9227","54688f1c40550d113b8f4f513bf6b8d4","9c2b39d22d0b3e4012eb6e962e99b31b","1564dacd34ace94eb4abfe2f378abe87","1b890b7fa38069745c1b7c7729b242c1","23a0120db1384da7fed62a9100c2f56f","07500e20b49fd14ea5880aa279061aea","72c35043e9a0ea06dc3a29e0409af6ed","415110f4d85b09cf6618aa13164f6b87","8bcf9c8ca170528891bb9eb4ffcbaec0","506c76f5422e92297f4daa453a0d195b","8608a6edb997d0abfec8f88782ff61bd","56d153108902aa4bfe5dab55d9298250","763ec57476e3923eb3f4d9309c5651d6","6938b4aafd39bd136141a2ac31fc8141"],

	// Array of PAN numbrs (optional)
	pan:["44f2b05d74192e31478846f1b7bdd661","55025cf02053edb09b93ef532a37099d","66518632d60f897d84ae62e75a7059a3","77dfb17c08b6dbc2846fbe8938bece1a","880744735d8b124cc0e31a349770d1f4","cd13fcc1a2806a75322d5a9fda0feaa4","f611a8eb968d4d4b0dd82d8a05b2d8eb","23f8f118f4e76e8cc1488514e6bc6881","d31849f975223a06e765d3433d3e6a9b","4502d00825ccae4c3507cfe1749980d1","62925225e48a9b0fe497dcde66de9227","54688f1c40550d113b8f4f513bf6b8d4","9c2b39d22d0b3e4012eb6e962e99b31b","1564dacd34ace94eb4abfe2f378abe87","1b890b7fa38069745c1b7c7729b242c1","23a0120db1384da7fed62a9100c2f56f","07500e20b49fd14ea5880aa279061aea","72c35043e9a0ea06dc3a29e0409af6ed","415110f4d85b09cf6618aa13164f6b87","8bcf9c8ca170528891bb9eb4ffcbaec0","506c76f5422e92297f4daa453a0d195b","8608a6edb997d0abfec8f88782ff61bd","56d153108902aa4bfe5dab55d9298250","763ec57476e3923eb3f4d9309c5651d6","6938b4aafd39bd136141a2ac31fc8141"],

	// The DNS Name of the Destination Wallet
	to: 'john.skywallet.cc',

	// Memo (optional)
	memo: 'From Mike',

	// Amount to send
	amount: 300,

	// ID of the Change Maker. Optional. Default is 2
	changeMakerId: 2
}

// Example call to the RAIDA
raidaJS.apiTransfer(params)

// Example call to the RAIDA and execute another function (callback) after each RAIDA server returns the response:
raidaJS.apiTransfer(params, raidaNumber => {})
```

Data Returned:

The same as the one for the apiDetect

#### apiSend

Sends coins from a Local Wallet to a Remote Wallet

Input

```js
let params = {
        'to' : 'john.skywallet.cc',
        'memo' : "Send",
        'coins' :[{
		'sn' : '4343',
		'an' :  ["f9f2b05d74192e31478846f1b7bdd661","74025cf02053edb09b93ef532a37099d","c3518632d60f897d84ae62e75a7059a3","66dfb17c08b6dbc2846fbe8938bece1a","2f0744735d8b124cc0e31a349770d1f4","cd13fcc1a2806a75322d5a9fda0feaa4","f611a8eb968d4d4b0dd82d8a05b2d8eb","23f8f118f4e76e8cc1488514e6bc6881","d31849f975223a06e765d3433d3e6a9b","4502d00825ccae4c3507cfe1749980d1","62925225e48a9b0fe497dcde66de9227","54688f1c40550d113b8f4f513bf6b8d4","9c2b39d22d0b3e4012eb6e962e99b31b","1564dacd34ace94eb4abfe2f378abe87","1b890b7fa38069745c1b7c7729b242c1","23a0120db1384da7fed62a9100c2f56f","07500e20b49fd14ea5880aa279061aea","72c35043e9a0ea06dc3a29e0409af6ed","415110f4d85b09cf6618aa13164f6b87","8bcf9c8ca170528891bb9eb4ffcbaec0","506c76f5422e92297f4daa453a0d195b","8608a6edb997d0abfec8f88782ff61bd","56d153108902aa4bfe5dab55d9298250","763ec57476e3923eb3f4d9309c5651d6","6938b4aafd39bd136141a2ac31fc8141"]
        }, {
		'sn' : '4341424',
		'an' :  ["01f2b05d74192e31478846f1b7bdd661","02025cf02053edb09b93ef532a37099d","03518632d60f897d84ae62e75a7059a3","04dfb17c08b6dbc2846fbe8938bece1a","050744735d8b124cc0e31a349770d1f4","0613fcc1a2806a75322d5a9fda0feaa4","0711a8eb968d4d4b0dd82d8a05b2d8eb","08f8f118f4e76e8cc1488514e6bc6881","091849f975223a06e765d3433d3e6a9b","1002d00825ccae4c3507cfe1749980d1","11925225e48a9b0fe497dcde66de9227","12688f1c40550d113b8f4f513bf6b8d4","132b39d22d0b3e4012eb6e962e99b31b","1464dacd34ace94eb4abfe2f378abe87","15890b7fa38069745c1b7c7729b242c1","16a0120db1384da7fed62a9100c2f56f","17500e20b49fd14ea5880aa279061aea","18c35043e9a0ea06dc3a29e0409af6ed","195110f4d85b09cf6618aa13164f6b87","20cf9c8ca170528891bb9eb4ffcbaec0","216c76f5422e92297f4daa453a0d195b","2208a6edb997d0abfec8f88782ff61bd","23d153108902aa4bfe5dab55d9298250","243ec57476e3923eb3f4d9309c5651d6","2538b4aafd39bd136141a2ac31fc8141"]
        }, {
		'sn' : '4164737',
		'an' : ["f9f2b05d74192e31478846f1b7bdd661","74025cf02053edb09b93ef532a37099d","c3518632d60f897d84ae62e75a7059a3","66dfb17c08b6dbc2846fbe8938bece1a","2f0744735d8b124cc0e31a349770d1f4","cd13fcc1a2806a75322d5a9fda0feaa4","f611a8eb968d4d4b0dd82d8a05b2d8eb","23f8f118f4e76e8cc1488514e6bc6881","d31849f975223a06e765d3433d3e6a9b","4502d00825ccae4c3507cfe1749980d1","62925225e48a9b0fe497dcde66de9227","54688f1c40550d113b8f4f513bf6b8d4","9c2b39d22d0b3e4012eb6e962e99b31b","1564dacd34ace94eb4abfe2f378abe87","1b890b7fa38069745c1b7c7729b242c1","23a0120db1384da7fed62a9100c2f56f","07500e20b49fd14ea5880aa279061aea","72c35043e9a0ea06dc3a29e0409af6ed","415110f4d85b09cf6618aa13164f6b87","8bcf9c8ca170528891bb9eb4ffcbaec0","506c76f5422e92297f4daa453a0d195b","8608a6edb997d0abfec8f88782ff61bd","56d153108902aa4bfe5dab55d9298250","763ec57476e3923eb3f4d9309c5651d6","6938b4aafd39bd136141a2ac31fc8141"]
        }, {
        	'sn': '1231231',
	        'an' : ["44f2b05d74192e31478846f1b7bdd661","55025cf02053edb09b93ef532a37099d","66518632d60f897d84ae62e75a7059a3","77dfb17c08b6dbc2846fbe8938bece1a","880744735d8b124cc0e31a349770d1f4","cd13fcc1a2806a75322d5a9fda0feaa4","f611a8eb968d4d4b0dd82d8a05b2d8eb","23f8f118f4e76e8cc1488514e6bc6881","d31849f975223a06e765d3433d3e6a9b","4502d00825ccae4c3507cfe1749980d1","62925225e48a9b0fe497dcde66de9227","54688f1c40550d113b8f4f513bf6b8d4","9c2b39d22d0b3e4012eb6e962e99b31b","1564dacd34ace94eb4abfe2f378abe87","1b890b7fa38069745c1b7c7729b242c1","23a0120db1384da7fed62a9100c2f56f","07500e20b49fd14ea5880aa279061aea","72c35043e9a0ea06dc3a29e0409af6ed","415110f4d85b09cf6618aa13164f6b87","8bcf9c8ca170528891bb9eb4ffcbaec0","506c76f5422e92297f4daa453a0d195b","8608a6edb997d0abfec8f88782ff61bd","56d153108902aa4bfe5dab55d9298250","763ec57476e3923eb3f4d9309c5651d6","6938b4aafd39bd136141a2ac31fc8141"]
        }]
}

// Example call to the RAIDA:
raidaJS.apiSend(params)

// Example call to the RAIDA and execute another function (callback) after each RAIDA server returns the response:
raidaJS.apiSend(params, raidaNumber => {})

// Callback example
raidaJS.apiSend(params, raidaNumber => {
	console.log("RAIDA " + raidaNumber + " just finished sending")
})

```

Data Returned:

The same as the one for the apiDetect


#### apiFixFracked

This service can be used as a standalone call but it is reasonable to call it right after the apiDetect call. 
The method accepts apiDetect response.result as its input value

Input

```js
// Per-coin results
{
	coinSN0 : {             // Coin serial number
		// Coin Info
		nn: Number,     // Coin network number
		sn: Number,     // Coin serial number

		pownstring: String // PownString 
        },

	coinSN1 : { //  Next Coin
		...
	}

}

// Example call to the RAIDA:
raidaJS.apiDetect(params).then(response => {
	console.log("Detect finished. Fixing Fracked coins")
	raidaJS.apiFixfracked(response.result).then(response => {
		console.log("Fixing finished. Total coins fixed: " + response.fixedNotes)
	})
})


// Example call to the RAIDA and execute another function (callback) after each RAIDA server returns the response:
raidaJS.apiDetect(params, raidaNumber => {
	console.log("RAIDA " + raidaNumber + " finished detecting")
}).then(response => {
	console.log("Detect finished. Fixing Fracked coins")
	raidaJS.apiFixfracked(response.result, (raidaNumber, operation) => {
		console.log("RAIDA " + raidaNumber + " finished " + operation)  // 'operation' is either 'multi_fix' or 'multi_get_ticket'
	}).then(response => {
		console.log("Fixing finished. Total coins fixed: " + response.fixedNotes)
	})
})
```

Data Returned

```js
{
	// General statistics
	totalNotes: Number,  // The number of notes in the initial request
	fixedNotes: Number   // The number of successfully fixed notes

	// Per-coin info
	result: {
		coinSN0: {
			// Coin static data
			nn: Number,
			sn: Number,
			denomination: Number,

			// Fix statistics
			errors: Number,
			counterfeit: Number,
			authentic: Number

			// Result of fixing
			result: String,  // either 'fracked' or 'fixed'
			pownstring: String,
			an: [] // The array of ANs after the fixing. It is crucial to save it!
		},
		coinSN1: {
			...
		}
	}
}

```

#### apiFixTransferSync

Fixes coins previously returned by apiShowCoins() call.
The function fixes no more than this.options.maxCoinsPerIteraiton coins at a time. Default is 200

Input:
```js
{
  sn0: [],  // Array of 25 values of enum ["yes", "no", "unknown"]
  sn1: [],  // Array of 25 values of enum ["yes", "no", "unknown"]
  ...
}
```

Data returned:

```js
{
  "status":"done"
}
```

#### apiFixTransfer

The function has the same input and output signature as apiFixTransferSync
The only difference is that the coins are fixed asynchronously


#### apiReceive

Receives coins from a Sky Wallet. (!) It is crucial to save the received Authenticity Numbers from the received coins.

Input:

```js
// Parameters
let params = {
	// Source Wallet Info.
	// Serial Number
	sn: 102,

	// Array of AN numbers
	an:["44f2b05d74192e31478846f1b7bdd661","55025cf02053edb09b93ef532a37099d","66518632d60f897d84ae62e75a7059a3","77dfb17c08b6dbc2846fbe8938bece1a","880744735d8b124cc0e31a349770d1f4","cd13fcc1a2806a75322d5a9fda0feaa4","f611a8eb968d4d4b0dd82d8a05b2d8eb","23f8f118f4e76e8cc1488514e6bc6881","d31849f975223a06e765d3433d3e6a9b","4502d00825ccae4c3507cfe1749980d1","62925225e48a9b0fe497dcde66de9227","54688f1c40550d113b8f4f513bf6b8d4","9c2b39d22d0b3e4012eb6e962e99b31b","1564dacd34ace94eb4abfe2f378abe87","1b890b7fa38069745c1b7c7729b242c1","23a0120db1384da7fed62a9100c2f56f","07500e20b49fd14ea5880aa279061aea","72c35043e9a0ea06dc3a29e0409af6ed","415110f4d85b09cf6618aa13164f6b87","8bcf9c8ca170528891bb9eb4ffcbaec0","506c76f5422e92297f4daa453a0d195b","8608a6edb997d0abfec8f88782ff61bd","56d153108902aa4bfe5dab55d9298250","763ec57476e3923eb3f4d9309c5651d6","6938b4aafd39bd136141a2ac31fc8141"],

	// Array of PAN numbrs (optional)
	pan:["44f2b05d74192e31478846f1b7bdd661","55025cf02053edb09b93ef532a37099d","66518632d60f897d84ae62e75a7059a3","77dfb17c08b6dbc2846fbe8938bece1a","880744735d8b124cc0e31a349770d1f4","cd13fcc1a2806a75322d5a9fda0feaa4","f611a8eb968d4d4b0dd82d8a05b2d8eb","23f8f118f4e76e8cc1488514e6bc6881","d31849f975223a06e765d3433d3e6a9b","4502d00825ccae4c3507cfe1749980d1","62925225e48a9b0fe497dcde66de9227","54688f1c40550d113b8f4f513bf6b8d4","9c2b39d22d0b3e4012eb6e962e99b31b","1564dacd34ace94eb4abfe2f378abe87","1b890b7fa38069745c1b7c7729b242c1","23a0120db1384da7fed62a9100c2f56f","07500e20b49fd14ea5880aa279061aea","72c35043e9a0ea06dc3a29e0409af6ed","415110f4d85b09cf6618aa13164f6b87","8bcf9c8ca170528891bb9eb4ffcbaec0","506c76f5422e92297f4daa453a0d195b","8608a6edb997d0abfec8f88782ff61bd","56d153108902aa4bfe5dab55d9298250","763ec57476e3923eb3f4d9309c5651d6","6938b4aafd39bd136141a2ac31fc8141"],

	// Amount to receive. Optional. If not set all coins will be received
	amount: 300,

	// ID of the Change Maker. Optional. Default is 2
	changeMakerId: 2
}

// Example call to the RAIDA
raidaJS.apiReceive(params)

// Example call to the RAIDA and execute another function (callback) after each RAIDA server returns the response:
raidaJS.apiReceive(params, raidaNumber => {})
```

Data Returned:

The same as the one for the apiDetect


#### embedImage

Takes an PNG URL  and an array of coins, then embeds the array into the PNG template. WARNING: in order to follow CORS policy the URL must be the same as the one where the script runs

Input:

```js
params = {
	// array of coins
	"coins" :[{
		"sn" : "4343",
		"an" :  ["f9f2b05d74192e31478846f1b7bdd661","74025cf02053edb09b93ef532a37099d","c3518632d60f897d84ae62e75a7059a3","66dfb17c08b6dbc2846fbe8938bece1a","2f0744735d8b124cc0e31a349770d1f4","cd13fcc1a2806a75322d5a9fda0feaa4","f611a8eb968d4d4b0dd82d8a05b2d8eb","23f8f118f4e76e8cc1488514e6bc6881","d31849f975223a06e765d3433d3e6a9b","4502d00825ccae4c3507cfe1749980d1","62925225e48a9b0fe497dcde66de9227","54688f1c40550d113b8f4f513bf6b8d4","9c2b39d22d0b3e4012eb6e962e99b31b","1564dacd34ace94eb4abfe2f378abe87","1b890b7fa38069745c1b7c7729b242c1","23a0120db1384da7fed62a9100c2f56f","07500e20b49fd14ea5880aa279061aea","72c35043e9a0ea06dc3a29e0409af6ed","415110f4d85b09cf6618aa13164f6b87","8bcf9c8ca170528891bb9eb4ffcbaec0","506c76f5422e92297f4daa453a0d195b","8608a6edb997d0abfec8f88782ff61bd","56d153108902aa4bfe5dab55d9298250","763ec57476e3923eb3f4d9309c5651d6","6938b4aafd39bd136141a2ac31fc8141"]
	}],

	// PNG URL. Must be the compatible with CORS policy
	// The URL can be specified in Base64 format if you prepend 'data:application/octet-binary;base64,' to it
	"template" : "https://127.0.0.1/image.png"

	// Example (base64)
	// "template" : "data:application/octet-binary;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACqSURBVDhPYxhwwAilGa7duCkJZZZBaQEovRFEaGmobwDz0AATlCYbILtgPpS5HUrfh9LNUDoDRABd8gDMgwKKXYBsgAIUH4Di81C8A4pVoRgFUOwCFigNAhOhdCeUvggibj15Vw+i1598EAii0QH1YgEGgLEhAmWqgYjOtefYQPSNp+8XgWgg8AMRJ6dlXQDR1HcBLmCeNc0AyswHEUAXJIJoil0w0ICBAQCRzCfuSDyCswAAAABJRU5ErkJggg=="
}

raidaJS.embedInImage(params).then(response => {
	document.getElementById('imgId').setAttribute('src', 'data:image/png;base64,' + response)
})

```

Data returned

```
Base64-encoded image
```


#### extractStack

Extracts a stack file from a PNG image

Input:

```js
params = {
	"template": "data:application/octet-binary;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADlmNMRGN7ImNsb3VkY29pbiI6W3sic24iOiI0MzQzIiwiYW4iOlsiZjlmMmIwNWQ3NDE5MmUzMTQ3ODg0NmYxYjdiZGQ2NjEiLCI3NDAyNWNmMDIwNTNlZGIwOWI5M2VmNTMyYTM3MDk5ZCIsImMzNTE4NjMyZDYwZjg5N2Q4NGFlNjJlNzVhNzA1OWEzIiwiNjZkZmIxN2MwOGI2ZGJjMjg0NmZiZTg5MzhiZWNlMWEiLCIyZjA3NDQ3MzVkOGIxMjRjYzBlMzFhMzQ5NzcwZDFmNCIsImNkMTNmY2MxYTI4MDZhNzUzMjJkNWE5ZmRhMGZlYWE0IiwiZjYxMWE4ZWI5NjhkNGQ0YjBkZDgyZDhhMDViMmQ4ZWIiLCIyM2Y4ZjExOGY0ZTc2ZThjYzE0ODg1MTRlNmJjNjg4MSIsImQzMTg0OWY5NzUyMjNhMDZlNzY1ZDM0MzNkM2U2YTliIiwiNDUwMmQwMDgyNWNjYWU0YzM1MDdjZmUxNzQ5OTgwZDEiLCI2MjkyNTIyNWU0OGE5YjBmZTQ5N2RjZGU2NmRlOTIyNyIsIjU0Njg4ZjFjNDA1NTBkMTEzYjhmNGY1MTNiZjZiOGQ0IiwiOWMyYjM5ZDIyZDBiM2U0MDEyZWI2ZTk2MmU5OWIzMWIiLCIxNTY0ZGFjZDM0YWNlOTRlYjRhYmZlMmYzNzhhYmU4NyIsIjFiODkwYjdmYTM4MDY5NzQ1YzFiN2M3NzI5YjI0MmMxIiwiMjNhMDEyMGRiMTM4NGRhN2ZlZDYyYTkxMDBjMmY1NmYiLCIwNzUwMGUyMGI0OWZkMTRlYTU4ODBhYTI3OTA2MWFlYSIsIjcyYzM1MDQzZTlhMGVhMDZkYzNhMjllMDQwOWFmNmVkIiwiNDE1MTEwZjRkODViMDljZjY2MThhYTEzMTY0ZjZiODciLCI4YmNmOWM4Y2ExNzA1Mjg4OTFiYjllYjRmZmNiYWVjMCIsIjUwNmM3NmY1NDIyZTkyMjk3ZjRkYWE0NTNhMGQxOTViIiwiODYwOGE2ZWRiOTk3ZDBhYmZlYzhmODg3ODJmZjYxYmQiLCI1NmQxNTMxMDg5MDJhYTRiZmU1ZGFiNTVkOTI5ODI1MCIsIjc2M2VjNTc0NzZlMzkyM2ViM2Y0ZDkzMDljNTY1MWQ2IiwiNjkzOGI0YWFmZDM5YmQxMzYxNDFhMmFjMzFmYzgxNDEiXSwibm4iOjF9XX2ZQ07KAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACqSURBVDhPYxhwwAilGa7duCkJZZZBaQEovRFEaGmobwDz0AATlCYbILtgPpS5HUrfh9LNUDoDRABd8gDMgwKKXYBsgAIUH4Di81C8A4pVoRgFUOwCFigNAhOhdCeUvggibj15Vw+i1598EAii0QH1YgEGgLEhAmWqgYjOtefYQPSNp+8XgWgg8AMRJ6dlXQDR1HcBLmCeNc0AyswHEUAXJIJoil0w0ICBAQCRzCfuSDyCswAAAABJRU5ErkJggg=="
}

r.extractStack(params).then(response => {
	console.log(response)
})


```

Data returned

```js
{
	// Status of the request
	status: String,			// 'done' or 'error'

	// CloudCoin Stack
	cloudcoin: {
		...
	}

}
```


#### apiGetticket

Requests tickets from RAIDA. You need to provide a CloudCoin

Input:

```js
params = {
	 "sn" : "4343",
	 "an" :  ["f9f2b05d74192e31478846f1b7bdd661","74025cf02053edb09b93ef532a37099d","c3518632d60f897d84ae62e75a7059a3","66dfb17c08b6dbc2846fbe8938bece1a","2f0744735d8b124cc0e31a349770d1f4","cd13fcc1a2806a75322d5a9fda0feaa4","f611a8eb968d4d4b0dd82d8a05b2d8eb","23f8f118f4e76e8cc1488514e6bc6881","d31849f975223a06e765d3433d3e6a9b","4502d00825ccae4c3507cfe1749980d1","62925225e48a9b0fe497dcde66de9227","54688f1c40550d113b8f4f513bf6b8d4","9c2b39d22d0b3e4012eb6e962e99b31b","1564dacd34ace94eb4abfe2f378abe87","1b890b7fa38069745c1b7c7729b242c1","23a0120db1384da7fed62a9100c2f56f","07500e20b49fd14ea5880aa279061aea","72c35043e9a0ea06dc3a29e0409af6ed","415110f4d85b09cf6618aa13164f6b87","8bcf9c8ca170528891bb9eb4ffcbaec0","506c76f5422e92297f4daa453a0d195b","8608a6edb997d0abfec8f88782ff61bd","56d153108902aa4bfe5dab55d9298250","763ec57476e3923eb3f4d9309c5651d6","6938b4aafd39bd136141a2ac31fc8141"]
}

r.apiGetticket(params, idx => {
	console.log("RAIDA " + idx + " responded")
}).then(response => {
	console.log(response)
})

rv.apiGetticket(params).then(response => {
	console.log(response)
})
```

Data returned

```
{
	// Status of the request
	status: String, // 'done'
	tickets: []	// array of 25 tickets
}
```


#### apiShowCoins

Returns the SkyWallet contents

Input:

```js
params = {
	"sn" : "4343",
	"an" :  ["f9f2b05d74192e31478846f1b7bdd661","74025cf02053edb09b93ef532a37099d","c3518632d60f897d84ae62e75a7059a3","66dfb17c08b6dbc2846fbe8938bece1a","2f0744735d8b124cc0e31a349770d1f4","cd13fcc1a2806a75322d5a9fda0feaa4","f611a8eb968d4d4b0dd82d8a05b2d8eb","23f8f118f4e76e8cc1488514e6bc6881","d31849f975223a06e765d3433d3e6a9b","4502d00825ccae4c3507cfe1749980d1","62925225e48a9b0fe497dcde66de9227","54688f1c40550d113b8f4f513bf6b8d4","9c2b39d22d0b3e4012eb6e962e99b31b","1564dacd34ace94eb4abfe2f378abe87","1b890b7fa38069745c1b7c7729b242c1","23a0120db1384da7fed62a9100c2f56f","07500e20b49fd14ea5880aa279061aea","72c35043e9a0ea06dc3a29e0409af6ed","415110f4d85b09cf6618aa13164f6b87","8bcf9c8ca170528891bb9eb4ffcbaec0","506c76f5422e92297f4daa453a0d195b","8608a6edb997d0abfec8f88782ff61bd","56d153108902aa4bfe5dab55d9298250","763ec57476e3923eb3f4d9309c5651d6","6938b4aafd39bd136141a2ac31fc8141"]
}

r.apiShowCoins(params).then(response => {
	console.log(response)
})
```

Data returned

```js
{
  coins: {}	// Hashmap with coins. Can be empty if the skywallet balance is zero,
  coinsPerRaida: {} // Hashmap with coins and RAIDA presense
}
```

coinsPerRaida shows the array (25) of coin's presense on RAIDA servers:

```js
...
45345: ["yes", "yes", "no", "unknown", "no", "yes", "yes",  "yes", "yes",  "yes", "yes",  "yes", "yes",  "yes", "yes",  "yes", "yes",  "yes", "yes",  "yes", "yes",  "yes", "yes",  "yes", "yes"]
...
```

// yes - coin is present on raida#

// no - coin is not present

// unknown - the status is unknown (raida server is not responding)

CoinsPerRaida can be passed AS-IS to apiFixTransferSync call

```js

 r.apiShowCoins(data, () => {}).then(response => {
   r.apiFixTransferSync(response.coinsPerRaida).then(response => {
    console.log("done")
   })
 })

```

#### apiShowCoinsAsArray

This one is the same as apiShowCoins but the returned coins are put in Array instead of Object


#### apiShowBalance

Returns the SkyWallet contents

Input:

```js
params = {
	"sn" : "4343",
	"an" :  ["f9f2b05d74192e31478846f1b7bdd661","74025cf02053edb09b93ef532a37099d","c3518632d60f897d84ae62e75a7059a3","66dfb17c08b6dbc2846fbe8938bece1a","2f0744735d8b124cc0e31a349770d1f4","cd13fcc1a2806a75322d5a9fda0feaa4","f611a8eb968d4d4b0dd82d8a05b2d8eb","23f8f118f4e76e8cc1488514e6bc6881","d31849f975223a06e765d3433d3e6a9b","4502d00825ccae4c3507cfe1749980d1","62925225e48a9b0fe497dcde66de9227","54688f1c40550d113b8f4f513bf6b8d4","9c2b39d22d0b3e4012eb6e962e99b31b","1564dacd34ace94eb4abfe2f378abe87","1b890b7fa38069745c1b7c7729b242c1","23a0120db1384da7fed62a9100c2f56f","07500e20b49fd14ea5880aa279061aea","72c35043e9a0ea06dc3a29e0409af6ed","415110f4d85b09cf6618aa13164f6b87","8bcf9c8ca170528891bb9eb4ffcbaec0","506c76f5422e92297f4daa453a0d195b","8608a6edb997d0abfec8f88782ff61bd","56d153108902aa4bfe5dab55d9298250","763ec57476e3923eb3f4d9309c5651d6","6938b4aafd39bd136141a2ac31fc8141"]
}

r.apiShowBalance(params).then(reponse => {
	console.log(response)
})
```

Data returned

```js
{
  balances: {}	// Hashmap of balances. Keys are the balances and values are the number of Raida servers that voted for this balance. Raida servers may disagree about the balance. In this case there will be multiple keys
  raidaStatuses: "ppppppppppppppppppppppppp" // pownstring
  balancesPerRaida: [], // Array of balances for each RAIDA server
}
```

Possible values are:

"p" - "pass"

"f" - "fail" // counterfeit

"u" - "untried"

"n" - "network issue"

"e" - "error"

If balances returned like this:

```js
balances : {
  193: 20,
  191: 2,
  0: 3
}
```

It means that twenty raida servers think that the balance is 193 CloudCoins
Two RAIDA servers think that the balance is 191 CloudCoins
Three RAIDA servers think that the balance is zero



#### apiRegisterSkyWallet

This method creates a SkyWallet for the specified CloudCoin. Method accepts name of the wallet and the coin itself. If "overwrite" attribute is true and the DNS name already exists the library will delete the old record and create a new one.

Input:

```js
params = {
	"name" : "mywallet.skywallet.cc",
  "overwrite" : true,
	"coin" : {
		"sn" : "4343",
		"an" :  ["f9f2b05d74192e31478846f1b7bdd661","74025cf02053edb09b93ef532a37099d","c3518632d60f897d84ae62e75a7059a3","66dfb17c08b6dbc2846fbe8938bece1a","2f0744735d8b124cc0e31a349770d1f4","cd13fcc1a2806a75322d5a9fda0feaa4","f611a8eb968d4d4b0dd82d8a05b2d8eb","23f8f118f4e76e8cc1488514e6bc6881","d31849f975223a06e765d3433d3e6a9b","4502d00825ccae4c3507cfe1749980d1","62925225e48a9b0fe497dcde66de9227","54688f1c40550d113b8f4f513bf6b8d4","9c2b39d22d0b3e4012eb6e962e99b31b","1564dacd34ace94eb4abfe2f378abe87","1b890b7fa38069745c1b7c7729b242c1","23a0120db1384da7fed62a9100c2f56f","07500e20b49fd14ea5880aa279061aea","72c35043e9a0ea06dc3a29e0409af6ed","415110f4d85b09cf6618aa13164f6b87","8bcf9c8ca170528891bb9eb4ffcbaec0","506c76f5422e92297f4daa453a0d195b","8608a6edb997d0abfec8f88782ff61bd","56d153108902aa4bfe5dab55d9298250","763ec57476e3923eb3f4d9309c5651d6","6938b4aafd39bd136141a2ac31fc8141"]
	}
}
```

Data returned

```js
{
	status : "done"  // "done" or "error"
	message : ""     // Information
}
```


#### apiViewreceipt

This method downolads a receipt from a Sky Wallet

Input:

```js
params = {
	// Sky Coin 
	account : "7392040",

	// 32-byte hex receipt ID
	tag : "762c2d8eeb06a193b759eaf681826d9c"
}
```

Data returned

```js
{
	status : "done"  // "done" or "error"
	sns : [],	// array of serial numbers
	total: 20,	// Total coins in receipt
}
```

#### apiGetCCByUsernameAndPassword

This method extracts CC from Username and Password

Input:

```js
params = {
	// Username
	username : "my.skywallet.cc",

	// Password
	password : "q12w3e4r5t67uxcvgdwht4"
}
```

Data returned

```js
{
  status : "done"  // "done" or "error"
  cc : {} // CloudCoin
}
```


#### apiCreateCCForRegistration

This method creates CC from Username, Password and Email

Input:

```js
params = {
  // Serial Number
  sn : 538942,

  // Password
  password : "q12w3e4r5t67uxcvgdwht4",

  // Recovery Email
  email: "my@domain.com"
}
```

Data returned

```js
{
  status : "done"  // "done" or "error",
  pans: [] // array of 25 generated PANs
  rand: string // string used to generate CC
  cvv: string // generated cvv
}
```


#### apiGetCCByCardData

This method extracts CC from Card Number and Cvv

Input:

```js
params = {
  // Username
  username : "my.skywallet.cc",

  // Cardnumber
  cardnumber : "4011131191011149",

  // CVV
  cvv: "2222"
}
```

Data returned

```js
{
  status : "done"  // "done" or "error"
  cc : {} // CloudCoin
}
```

#### apiPay

apiPay is used for transferring CloudCoins from a skywallet to a merchant or to a RAIDA. 

Merchant declares the Callback URL in the TXT record of his skywallet
The record contains an URL that is called by RaidaJS when the transer is done. 

If the "to" begins with "cloudcoin" then this is considered a payment to a merchant. All merchants must have a wallet that starts with "cloudcoin" to receive a payment. If the skywallet starts with "raidapay" then this payment is to a RAIDA. All payments to RAIDA must start with the word "raidapay"

RAIDA declares the Callback URL in the TXT record of their skywallet and the URLs of all the RAIDA are infered from that one URL. ATM calls the raidapay.raidamail.com TXT record and finds the webhook."raida0.raida.tech/service/reportpayment.php". The raidajs will then call the web hook page for all 25 raida by replacing the zero in "raida0" with all the RAIDA Numbers 1-24. 


Input:

```js
params = {
  // array of ANs of the senders's Skywallet ID coin
	an: ["01f2b05d74192e31478846f1b7bdd661","02025cf02053edb09b93ef532a37099d",
	"03518632d60f897d84ae62e75a7059a3","04dfb17c08b6dbc2846fbe8938bece1a",
	"050744735d8b124cc0e31a349770d1f4","0613fcc1a2806a75322d5a9fda0feaa4",
	"0711a8eb968d4d4b0dd82d8a05b2d8eb","08f8f118f4e76e8cc1488514e6bc6881",
	"091849f975223a06e765d3433d3e6a9b","1002d00825ccae4c3507cfe1749980d1",
	"11925225e48a9b0fe497dcde66de9227","12688f1c40550d113b8f4f513bf6b8d4",
	"132b39d22d0b3e4012eb6e962e99b31b","1464dacd34ace94eb4abfe2f378abe87",
	"15890b7fa38069745c1b7c7729b242c1","16a0120db1384da7fed62a9100c2f56f",
	"17500e20b49fd14ea5880aa279061aea","18c35043e9a0ea06dc3a29e0409af6ed",
	"195110f4d85b09cf6618aa13164f6b87","20cf9c8ca170528891bb9eb4ffcbaec0",
	"216c76f5422e92297f4daa453a0d195b","2208a6edb997d0abfec8f88782ff61bd",
	"23d153108902aa4bfe5dab55d9298250","243ec57476e3923eb3f4d9309c5651d6",
	"2538b4aafd39bd136141a2ac31fc8141"]
  
  // Send
  sender_name: "my.skywallet.cc",

  // From (optional, defaulted to sender_name if missing)
  from: "michael.skywallet.cc",

  // Merchant skywallet
  to: "cloudcoin.exchange.com",

  // Or RAIDA skywallet
  to: "raidapay.raidamail.com",

  // Amount
  amount: 100,

  // Memo (optional)
  memo: "my memo",

  // GUID of the receipt (optional, will be generated if not present)
  guid: "216c76f5422e92297f4daa453a0d195b"
}
```

Data returned

The same as the one for the apiDetect. A 'guid' (transaction ID) parameter is added to the response. 

#### apiGetFreeCoin

Function queries the FreeCoin Server and downloads a coin from there. It accepts a Uniq Hardware ID which is 32 character hexidecimal string
The generation of HardwareID is up to the caller. It can be an MD5 sum of the IP address or MAC address


Input:
```js
hwId - 32 hex string
```

Data Returned:
```js
// CloudCoin
{
  "an" : array,
  "sn" : string,
  "nn" : string,
  "pown" : string // ponwString
  "ed" : stirng // expiration Date
}
```

```js
let c = r.apiGetFreeCoin("102f5037fe6474019fe947b4977bb2a5").then(response => {
  if ('status' in response && response.status == 'error')  {
    console.error("Error")
    return
  }

  console.log("cloudcoin")
  console.log(response)
}
```

#### apiCreateRecord

The function creates a statement on the RAIDA. The function can be called by the sender or receiver if he wants to save transaction details on the RAIDA.

Input:
```js
{
  // CloudCoin (SN and AN must be passed) of the transaction owner
  "coin" : {
    // Serial Number
    "sn" : interger,

    // Array of 25 Authenticity Numbers
    "an" : []
  },

  //Event code. One of ['send', 'recieve', 'transfer_out', 'transfer_in', 'break', 'break_in_bank', 'join', 'join_in_bank', 'unknown'],
  "event_code" : string,

  // Amount of CloudCoins that was sent
  "amount" : integer,

  // 32 chars hexidecimal string. ID of the transaction. Optional, if omitted it will be generated
  "guid" : string,

  // Transaction memo. Optional
  "memo" : string,

  // Optional. One of ['self', 'other_know', 'other_anonymous', 'unknown']. The default is 'self'
  "initiator_type" : string,

  // Optional. ID of the initiator. It can be a SkyWallet Address or a Serial Number of the sender
  "initiator_id" : string,

  // Optional. Image URL to display along with the transaction record
  "initiator_image_url": string,

  // Optional. Description URL
  "initiator_description_url": string
}
```

Data Returned:
```js
{
  // Always RaidaJS.ERR_NO_ERROR (0x0) if the response is successful
  "code" : integer,

  // Guid of the statement
  "guid" : string
}
```

Example
```js
let cc = {
  "sn":3788106,
   "an":["2c4b523bfa2b54a3c2cfec376336ef6e","dc1edbe0708e179e84e6ee0185849811","1b32715dea8bd66c6136f2bb226a9783","cf4a451a23d256299f306e0170632e9c","7bee1781698bfd26a40d384e3e9ba233","57a59cc3fe0a9e2b0ef55d9ee7d83aa0","8741aba5f9ada55cd4cc7ad9ff8cfc5e","27a940f79e5bb895218dc6fee619439a","6d7611020258dc07544255aecb05f94e","8fd75c4a543107c762473cb5c6814b25","b8fb577d62bee5e47622084deec2dc72","2dddefde6b2da5f85d8a50af78a8c6ef","0152c280f2b1df572e679edc5bf5aae4","213bce1b1e301b90e82189ba0a908e89","2f35eda22494903e5c680856304610b1","64bdfe44432444514e8234fa115b9352","6943424a235be73f86a065fe97756b03","e037963736d439d4bc72efa49aa4f2e5","da555eaad78e610e5beb51ec5d051781","47849f44ee8ee1d0d41782ca21dacdc3","4ec1fea2c736e8e82e1836cef7512cdb","de9ec5865fa289a09059ab8a87e73ac4","fb5fca0a5196333023043f080a6fb666","c8df8adefe8b25103358df30491c5409","dae2b572756a596fa8c97f55e8712854"]
}

let trdata = {
  "coin" : cc,
  "event_code": "transfer",
  "initiator_type" : "self",
  "initiator_id" : "mywallet.skywallet.cc",
  "initiator_image_url" : "https://mydomain.com/assets/logo.jpg",
  "initiator_description_url": "https://mydomain.com/faq",
  "memo" : "payment for the car",
  "amount" : 125000,
  "guid" : "ae596e96d15cfed1d137c2e99de50754"
}

let c = r.apiCreateRecord(trdata, () => {}).then(response => {
  if (response.code != RaidaJS.ERR_NO_ERROR) {
    console.log("Record has been saved successfully")
  }
}
```

#### apiShowRecords

apiShowRecords gets saved records from the RAIDA. It downloads all statements from the servers, decrypts them and returns them to the caller.
The function doesn't support pagination (limit and offset) and most of the filters. The only filter that is supported by the Backend is 'start_ts' which allows to set the starting datetime of the transactions. Sorting is not supported on the Backend too. The function internally sorts records on the client after downloading all of them.

The function automatically tries to synchronize records if it finds any inconsistency. The sync call (either sync_add or sync_delete) is transparent to the caller.

Input:
```js
{
  // CloudCoin (SN and AN must be passed) of the transactions owner
  "coin" : {
    // Serial Number
    "sn" : interger,

    // Array of 25 Authenticity Numbers
    "an" : []
  },

  // Filtering on the Backend. Timestamp. If specified, only transactions created after this datetime will be returned
  "start_ts" : integer,

  // Optional. Sorting field. One of ["amount", "guid", "from", "memo"]
  "order_by" : string,

  // Optinal. If true the sorting will be in asceding order.
  "order_asc": true
}
```

Output:
```js
// CloudCoin
{
  // Always RaidaJS.ERR_NO_ERROR (0x0) if the response is successful
  "code" : integer,

  // Array of  Records
  "records" : [

  ]
}
```

Record structure
```js
{
  // Amount of CloudCoins 
  "amount" : integer,

  // 32 chars hexidecimal string. ID of the transaction. 
  "guid" : string,

  // Transaction memo. 
  "memo" : string,

  // Sender's identity. 
  "inititator_id" : string,

  // Image URL
  "initiator_umage_url": string,

  // Description URL
  "initiator_description_url" : string,

  // Initiator type. One of ['self', 'other_know', 'other_anonymous', 'unknown'].
  "initiator_type": string,

  // Created Timestamp
  "date" : integer
}
```

Example:

```js
let cc = {
  "sn":3788106,
   "an":["2c4b523bfa2b54a3c2cfec376336ef6e","dc1edbe0708e179e84e6ee0185849811","1b32715dea8bd66c6136f2bb226a9783","cf4a451a23d256299f306e0170632e9c","7bee1781698bfd26a40d384e3e9ba233","57a59cc3fe0a9e2b0ef55d9ee7d83aa0","8741aba5f9ada55cd4cc7ad9ff8cfc5e","27a940f79e5bb895218dc6fee619439a","6d7611020258dc07544255aecb05f94e","8fd75c4a543107c762473cb5c6814b25","b8fb577d62bee5e47622084deec2dc72","2dddefde6b2da5f85d8a50af78a8c6ef","0152c280f2b1df572e679edc5bf5aae4","213bce1b1e301b90e82189ba0a908e89","2f35eda22494903e5c680856304610b1","64bdfe44432444514e8234fa115b9352","6943424a235be73f86a065fe97756b03","e037963736d439d4bc72efa49aa4f2e5","da555eaad78e610e5beb51ec5d051781","47849f44ee8ee1d0d41782ca21dacdc3","4ec1fea2c736e8e82e1836cef7512cdb","de9ec5865fa289a09059ab8a87e73ac4","fb5fca0a5196333023043f080a6fb666","c8df8adefe8b25103358df30491c5409","dae2b572756a596fa8c97f55e8712854"]
}

let trdata = {
  "coin" : cc,
  "start_ts" : 1619359363,
  "order_by" : "guid",
  "order_asc" : false
}
let c = r.apiShowRecords(trdata, () => {}).then(response => {
  if (response.code != RaidaJS.ERR_NO_ERROR) {
    for (let record in response.records) {
      console.log("Transaction " + record.guid + " amount: " + record.amount)
    }
  }
}
```

#### apiDeleteRecord

The function deletes a statement on the RAIDA. 

Input:
```js
{
  // CloudCoin (SN and AN must be passed) of the transaction owner
  "coin" : {
    // Serial Number
    "sn" : interger,

    // Array of 25 Authenticity Numbers
    "an" : []
  },

  // 32 chars hexidecimal string. ID of the transaction. Optional, if omitted it will be generated
  "guid" : string,
}
```

Data Returned:
```js
{
  // Always RaidaJS.ERR_NO_ERROR (0x0) if the response is successful
  "code" : integer,
}
```

Example

```js
let cc = {
  "sn":3788106,
   "an":["2c4b523bfa2b54a3c2cfec376336ef6e","dc1edbe0708e179e84e6ee0185849811","1b32715dea8bd66c6136f2bb226a9783","cf4a451a23d256299f306e0170632e9c","7bee1781698bfd26a40d384e3e9ba233","57a59cc3fe0a9e2b0ef55d9ee7d83aa0","8741aba5f9ada55cd4cc7ad9ff8cfc5e","27a940f79e5bb895218dc6fee619439a","6d7611020258dc07544255aecb05f94e","8fd75c4a543107c762473cb5c6814b25","b8fb577d62bee5e47622084deec2dc72","2dddefde6b2da5f85d8a50af78a8c6ef","0152c280f2b1df572e679edc5bf5aae4","213bce1b1e301b90e82189ba0a908e89","2f35eda22494903e5c680856304610b1","64bdfe44432444514e8234fa115b9352","6943424a235be73f86a065fe97756b03","e037963736d439d4bc72efa49aa4f2e5","da555eaad78e610e5beb51ec5d051781","47849f44ee8ee1d0d41782ca21dacdc3","4ec1fea2c736e8e82e1836cef7512cdb","de9ec5865fa289a09059ab8a87e73ac4","fb5fca0a5196333023043f080a6fb666","c8df8adefe8b25103358df30491c5409","dae2b572756a596fa8c97f55e8712854"]
}

let trdata = {
  "coin" : cc,
  "guid" : "ae596e96d15cfed1d137c2e99de50754"
}

let c = r.apiDeleteRecordr(trdata, () => {}).then(response => {
  if (response.code != RaidaJS.ERR_NO_ERROR) {
    console.log("Record has been deleted successfully")
  }
}
```


#### apiHealthCheck

apiHealthCheck receives an ID coins and executes three calls to the RAIDA. 'show_transfer_balance', 'show' and 'show?content=true'. It collects and analyzes the responses and return a so called 'Health Check array' that holds the status of every coin in the SkyWallet for each RAIDA server. The response of the apiHealthCheck can be further used to fix the coins that are out-of-sync.


Input:
```js
{
  // ID CloudCoin (SN and AN must be passed) 
  "coin" : {
    // Serial Number
    "sn" : interger,

    // Array of 25 Authenticity Numbers
    "an" : []
  },
}
```

Output:
```js
// CloudCoin
{
  // Always RaidaJS.ERR_NO_ERROR (0x0) if the response is successful
  "code" : integer,

  // Array of 25 balances returned by 'show_transfer_balance' call
  "balances" : [

  ],

  // 'Winner' Balance
  "balance" : integer,

  // Array of 25 balances calculated by doing 'show?content=1' call
  "show_balances" : [

  ],

  // Object of Serial Numbers. The key in the object is Serial Number. The value in the object is an array of 25 numbers
  "sns" : object
}
```

"SNS" object structure
```js
{
  1234 : ["yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes"],
  4567 : ["yes", "no", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes"],
  154567 : ["no", "no", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes"]
}
```

SNS Item array
```js
// Array of 25 booleans. 'True'. Array index is a RAIDA server number. Array value says whether the coin exists on the RAIDA server
// "yes" - coin is present on the RAIDA server
// "no" - coin is NOT present on the RAIDA server
[
"yes", "yes", "no", "yes", "yes", 
"yes", "yes", "no", "yes", "yes", 
"yes", "yes", "no", "yes", "yes", 
"yes", "yes", "no", "yes", "yes", 
"yes", "yes", "no", "yes", "yes"
]
```


Example:
```js
let cc = {
  "sn":3788106,
   "an":["2c4b523bfa2b54a3c2cfec376336ef6e","dc1edbe0708e179e84e6ee0185849811","1b32715dea8bd66c6136f2bb226a9783","cf4a451a23d256299f306e0170632e9c","7bee1781698bfd26a40d384e3e9ba233","57a59cc3fe0a9e2b0ef55d9ee7d83aa0","8741aba5f9ada55cd4cc7ad9ff8cfc5e","27a940f79e5bb895218dc6fee619439a","6d7611020258dc07544255aecb05f94e","8fd75c4a543107c762473cb5c6814b25","b8fb577d62bee5e47622084deec2dc72","2dddefde6b2da5f85d8a50af78a8c6ef","0152c280f2b1df572e679edc5bf5aae4","213bce1b1e301b90e82189ba0a908e89","2f35eda22494903e5c680856304610b1","64bdfe44432444514e8234fa115b9352","6943424a235be73f86a065fe97756b03","e037963736d439d4bc72efa49aa4f2e5","da555eaad78e610e5beb51ec5d051781","47849f44ee8ee1d0d41782ca21dacdc3","4ec1fea2c736e8e82e1836cef7512cdb","de9ec5865fa289a09059ab8a87e73ac4","fb5fca0a5196333023043f080a6fb666","c8df8adefe8b25103358df30491c5409","dae2b572756a596fa8c97f55e8712854"]
}

let trdata = {
  "coin" : cc,
}
let c = r.apiHealthCheck(trdata, () => {}).then(response => {
  if (response.code != RaidaJS.ERR_NO_ERROR) {
    console.log("Balance: " + response.balance)
    for (let i = 0; i < 25; i++) {
      console.log("raida " + i + " balance:" + r.balances[i] + ", content balance " + r.show_balances[i])
      for (let sn in response.sns) {
        let arr = response.sns[sn]
        console.log("SN #" + sn + " present on this raida: " + response.sns[sn][i])
      }
    }
  }
}
```


#### apiNFTInsert

Function uploads an NFT token to the RAIDA and assotiates it with a CloudCoin. The caller can include an optional ID Proof picture (jpeg or png).
The function can receive a protocol version.

Two protocol versions are supported:

0 - Data is passed as a base64-encoded message which is further split into 25 chunks with two mirrors each

1 - The same is protocol 0 but it also accepts ID Proof Picture as a parameter


Input:
```js
{
  // ID CloudCoin (SN and AN must be passed) 
  "coin" : {
    // Serial Number
    "sn" : interger,

    // Array of 25 Authenticity Numbers
    "an" : []
  },

  // Base64 data
  "data" : string,

  // Base64 data for ID Proof Picture
  "proofdata": string,

  // Protocol version. Only 0 and 1 are supported
  "protocol" : 0,

  // Metadata
  "metadata" : {}
}
```

Metadata Object structure depends on the protocol version. The structure for v.0
```js
{
  // File name
  "filename" : string

  // MIME Content-Type. Optional. Default is application/octet-stream
  "mimetype" : string

  // MIME type of the ID Proof. Optional. Default is image/jpeg
  "proofmimetype" : string
}
```

Output:
```js
// CloudCoin
{
  // Always RaidaJS.ERR_NO_ERROR (0x0) if the response is successful
  "code" : integer,
}
```

Example:
```js
let cc = {
  "sn":3788106,
   "an":["2c4b523bfa2b54a3c2cfec376336ef6e","dc1edbe0708e179e84e6ee0185849811","1b32715dea8bd66c6136f2bb226a9783","cf4a451a23d256299f306e0170632e9c","7bee1781698bfd26a40d384e3e9ba233","57a59cc3fe0a9e2b0ef55d9ee7d83aa0","8741aba5f9ada55cd4cc7ad9ff8cfc5e","27a940f79e5bb895218dc6fee619439a","6d7611020258dc07544255aecb05f94e","8fd75c4a543107c762473cb5c6814b25","b8fb577d62bee5e47622084deec2dc72","2dddefde6b2da5f85d8a50af78a8c6ef","0152c280f2b1df572e679edc5bf5aae4","213bce1b1e301b90e82189ba0a908e89","2f35eda22494903e5c680856304610b1","64bdfe44432444514e8234fa115b9352","6943424a235be73f86a065fe97756b03","e037963736d439d4bc72efa49aa4f2e5","da555eaad78e610e5beb51ec5d051781","47849f44ee8ee1d0d41782ca21dacdc3","4ec1fea2c736e8e82e1836cef7512cdb","de9ec5865fa289a09059ab8a87e73ac4","fb5fca0a5196333023043f080a6fb666","c8df8adefe8b25103358df30491c5409","dae2b572756a596fa8c97f55e8712854"]
}

let data = {
  "coin" : cc,
  "data" : "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "metadata": {
    "filename": "mypicture.jpg"
  }
}
let c = r.apiNFTInsert(data, () => {}).then(response => {
  if (response.code != RaidaJS.ERR_NO_ERROR) {
    console.log("Token has been created")
  }
}
```


#### apiNFTRead

Function reads an NFT token from the RAIDA and assotiated with a CloudCoin

Input:
```js
{
  // ID CloudCoin (SN and AN must be passed) 
  "coin" : {
    // Serial Number
    "sn" : interger,

    // Array of 25 Authenticity Numbers
    "an" : []
  },
}
```

Output:
```js
// CloudCoin
{
  // Always RaidaJS.ERR_NO_ERROR (0x0) if the response is successful
  "code" : integer,

  // Data, base64 encoded
  "data": string,

  // Base64 data for ID Proof Picture
  "proofdata": string,

  // Protocol version
  "protocol": integer,

  // Metadata, specific to the protocol version
  "metadata": {}
}
```

Example:
```js
let cc = {
  "sn":3788106,
   "an":["2c4b523bfa2b54a3c2cfec376336ef6e","dc1edbe0708e179e84e6ee0185849811","1b32715dea8bd66c6136f2bb226a9783","cf4a451a23d256299f306e0170632e9c","7bee1781698bfd26a40d384e3e9ba233","57a59cc3fe0a9e2b0ef55d9ee7d83aa0","8741aba5f9ada55cd4cc7ad9ff8cfc5e","27a940f79e5bb895218dc6fee619439a","6d7611020258dc07544255aecb05f94e","8fd75c4a543107c762473cb5c6814b25","b8fb577d62bee5e47622084deec2dc72","2dddefde6b2da5f85d8a50af78a8c6ef","0152c280f2b1df572e679edc5bf5aae4","213bce1b1e301b90e82189ba0a908e89","2f35eda22494903e5c680856304610b1","64bdfe44432444514e8234fa115b9352","6943424a235be73f86a065fe97756b03","e037963736d439d4bc72efa49aa4f2e5","da555eaad78e610e5beb51ec5d051781","47849f44ee8ee1d0d41782ca21dacdc3","4ec1fea2c736e8e82e1836cef7512cdb","de9ec5865fa289a09059ab8a87e73ac4","fb5fca0a5196333023043f080a6fb666","c8df8adefe8b25103358df30491c5409","dae2b572756a596fa8c97f55e8712854"]
}

let data = {
  "coin" : cc
}
let c = r.apiNFTRead(data, () => {}).then(response => {
  if (response.code != RaidaJS.ERR_NO_ERROR) {
    console.log("Token has been downloaded, filename " + response.metadata.filename)
    img.src = "data:image/png;base64," + response.data
  }
}
```


#### apiNFTDelete

Deletes an NFT token from the RAIDA 

Input:
```js
{
  // ID CloudCoin (SN and AN must be passed) 
  "coin" : {
    // Serial Number
    "sn" : interger,

    // Array of 25 Authenticity Numbers
    "an" : []
  },
}
```

Output:
```js
// CloudCoin
{
  // Always RaidaJS.ERR_NO_ERROR (0x0) if the response is successful
  "code" : integer,
}
```

Example:
```js
let cc = {
  "sn":3788106,
   "an":["2c4b523bfa2b54a3c2cfec376336ef6e","dc1edbe0708e179e84e6ee0185849811","1b32715dea8bd66c6136f2bb226a9783","cf4a451a23d256299f306e0170632e9c","7bee1781698bfd26a40d384e3e9ba233","57a59cc3fe0a9e2b0ef55d9ee7d83aa0","8741aba5f9ada55cd4cc7ad9ff8cfc5e","27a940f79e5bb895218dc6fee619439a","6d7611020258dc07544255aecb05f94e","8fd75c4a543107c762473cb5c6814b25","b8fb577d62bee5e47622084deec2dc72","2dddefde6b2da5f85d8a50af78a8c6ef","0152c280f2b1df572e679edc5bf5aae4","213bce1b1e301b90e82189ba0a908e89","2f35eda22494903e5c680856304610b1","64bdfe44432444514e8234fa115b9352","6943424a235be73f86a065fe97756b03","e037963736d439d4bc72efa49aa4f2e5","da555eaad78e610e5beb51ec5d051781","47849f44ee8ee1d0d41782ca21dacdc3","4ec1fea2c736e8e82e1836cef7512cdb","de9ec5865fa289a09059ab8a87e73ac4","fb5fca0a5196333023043f080a6fb666","c8df8adefe8b25103358df30491c5409","dae2b572756a596fa8c97f55e8712854"]
}

let data = {
  "coin" : cc
}
let c = r.apiNFTDelete(data, () => {}).then(response => {
  if (response.code != RaidaJS.ERR_NO_ERROR) {
    console.log("Token has been deleted")
  }
}
```

#### apiBillPay

The apiBillPay function can be used to transfer CloudCoins from a skywallet to multiple skywallets at once. The functions accepts a CSV file that follows the BillPay standard

https://github.com/CloudCoinConsortium/CloudCoin/tree/master/Merchant%20Tools/BillPay

According to the standards above the CSV file must have 11 comma-separated fields:

<em>field#0</em> is always "TransferToSkywallet"

<em>field#1</em> is always "stack"

<em>field#2</em> holds the amount to transfer

<em>field#3</em> through <em>field#7</em> are zeroes

<em>field#8</em> must hold a recipient skywallet address

<em>field#9</em> is a memo

<em>field#10</em> holds key-value metadata. Optional.

<em>field#11</em> can be "ready" or "skip"

Example of a CSV file
```csv
TransferToSkywallet, stack, 100, 0,0,0,0,0, alex.skywallet.cc, Car payment,, ready
TransferToSkywallet, stack, 150, 0,0,0,0,0, john.skywallet.cc, My debt,, ready
TransferToSkywallet, stack, 21150, 0,0,0,0,0, roller.skywallet.cc, Chargeback,, ready
```

The function uses the Local Storage to keep track of sent payments. It is possible to use the same CSV file again to re-send unset payments if an error occurs. It is necesseary to pass a BillPay ID to assosiate the state of the payment with the CSV file. If the ID is not passed it will be generated and the payment will be rendered as a new payment.

if the ID is passed and the corresponding object exists in the LocalStorage then 'paydata' will be ignored and taken from the LocalStorage instead

Input:
```js
{
  // ID CloudCoin (SN and AN must be passed) 
  "coin" : {
    // Serial Number
    "sn" : interger,

    // Array of 25 Authenticity Numbers
    "an" : []
  },

  // Holds the CVS data above
  "paydata" : string,

  // ID of the BillPay. Optional, will be generated if empty
  "guid" : string
}
```

Output:
```js
// CloudCoin
{
  // Always RaidaJS.ERR_NO_ERROR (0x0) if the response is successful. Can be RaidaJS.ERR_BILLPAY_SENT_PARTIALLY 
  "code" : integer,

  // Amount sent,
  "amount : integer,

  // Recipients sent. Array of successful transfers
  "recipients": [],

  // Guid of the payment
  "guid" : string
}
```

Recipient structure
```js
{
  // Skywallet address
  "address" : string,

  // Status: "skip", "error" or "sent"
  "status" : string,

  // Message (Error description or success)
  "message" : string
}
```

Example:
```js
let cc = {
  "sn":3788106,
   "an":["2c4b523bfa2b54a3c2cfec376336ef6e","dc1edbe0708e179e84e6ee0185849811","1b32715dea8bd66c6136f2bb226a9783","cf4a451a23d256299f306e0170632e9c","7bee1781698bfd26a40d384e3e9ba233","57a59cc3fe0a9e2b0ef55d9ee7d83aa0","8741aba5f9ada55cd4cc7ad9ff8cfc5e","27a940f79e5bb895218dc6fee619439a","6d7611020258dc07544255aecb05f94e","8fd75c4a543107c762473cb5c6814b25","b8fb577d62bee5e47622084deec2dc72","2dddefde6b2da5f85d8a50af78a8c6ef","0152c280f2b1df572e679edc5bf5aae4","213bce1b1e301b90e82189ba0a908e89","2f35eda22494903e5c680856304610b1","64bdfe44432444514e8234fa115b9352","6943424a235be73f86a065fe97756b03","e037963736d439d4bc72efa49aa4f2e5","da555eaad78e610e5beb51ec5d051781","47849f44ee8ee1d0d41782ca21dacdc3","4ec1fea2c736e8e82e1836cef7512cdb","de9ec5865fa289a09059ab8a87e73ac4","fb5fca0a5196333023043f080a6fb666","c8df8adefe8b25103358df30491c5409","dae2b572756a596fa8c97f55e8712854"]
}

let data = {
  "coin" : cc,
  "paydata" : "email, stack, 100, 0,0,0,0,0, alex.skywallet.cc, Car payment,, ready\nemail, stack, 150, 0,0,0,0,0, john.skywallet.cc, My debt,, ready\nemail, stack, 21150, 0,0,0,0,0, roller.skywallet.cc, Chargeback,, ready",
  "id": "f2494e21fcd4e54a5acd7be6f2be6e50"

}
let c = r.apiBillPay(data, () => {}).then(response => {
  if (response.code != RaidaJS.ERR_NO_ERROR) {
    console.log("Billpay sent")
    return
  }

  if (response.code == RaidaJS.ERR_SENT_PARTIALLY) {
    console.log("Only " + response.amount + " CloudCoins sent. Try again later using the same ID: " + response.id)
    console.log("Recipients NOT sent:")
    for (let i = 0; i < response.recipients; i++) {
      if (response.recipients[i].status == "ready")
        console.log(response.recipients[i].address + ",")
    }
  }
}
```


#### apiBillPayList

The function show the status of previous BillPay payments.

Input:
```js
{
  // ID of the BillPay. Optional, will be generated if empty
  "guid" : string
}
```

Output:
```js
// CloudCoin
{
  // Always RaidaJS.ERR_NO_ERROR (0x0) if the response is successful. 
  "code" : integer,

  // Total Amount,
  "amounttotal": integer,

  // ID
  "guid" : string,

  // Amount sent,
  "amount : integer,

  // Array of recipients sent.
  "recipients": [],
}
```



Example:
```js
let data = {
  "guid": "f2494e21fcd4e54a5acd7be6f2be6e50"
}
let c = r.apiBillPayList(data, () => {}).then(response => {
  for (let i = 0; i < response.recipients; i++) {
    console.log(response.recipients[i].address + ": " + response.recipients[i].status + "<br>")
  }
}
```


