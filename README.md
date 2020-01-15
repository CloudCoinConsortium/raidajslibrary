# class Raida

The raida.min.js file contains the Raida class and other supporting libraries such as Axios. The Raida class has functions that allow you to quickly connect to RAIDA Cloud such as CloudCoin and CloudBanks such as SkyWallet. The Raida class uses the latest callback, tracing and debug techniques available today.

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

## RaidaJS Initialization

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
	debug: false
}

let raidaJS = new RaidaJS(options)
```

## RaidaJS API

All methods are executed asynchronously and return Javascript Promise Object
If there is an error with the input data the method returns null

Each API method has an optional `callback` argument. If defined this function is called after each raida returns or fails. It helps to track the progress of the whole bunch of requests

```js
let progress = 0
raidaJS.apiDetect(data, idx => {
	console.log("RAIDA " + idx + " finished")
	progress++
}).then(response => console.log(response))	
```

### Set functions

```js
raidaJS.setTimeout(15000)
raidaJS.setProtocol("http")
raidaJS.setDomain("raida.tech")
```

### Get functions
```js
// Returns the current set of the RAIDA URLs
raidaJS.getServers()

// Returns the denomination of the coin
raidaJS.getDenomination(12500)
```

### Api Methods

#### apiEcho

Echos RAIDA servers

Input:

```js
// callback function (optional)

raidaJS.apiEcho()
raidaJS.apiEcho(idx => {})

```

Output:

```js
{
	onlineServers: Number,
	totalServers: Number,
	details: []	
}
```

#### apiDetect

Sends multi_detect request to the RAIDA

Input:

```js
// Array of coins. If pan parameter is not set, it will be replicated from an
let params = [{sn:1,an:[]},{sn:2,an:[]}]

// callback function (optional)

raidaJS.apiDetect(params)
raidaJS.apiDetect(params, idx => {})
```

Output:

```js
{
	// General Statistics
	totalNotes: Number,
	authenticNotes: Number,
	frackedNotes: Number,
	counterfeitNotes: Number,
	errorNotes: Number,

	// Per-coin results
	result: {
		coinSN0 : {
			// Coin Info
			nn: Number,
			sn: Number,
			denomination: Number,

			// Results from the RAIDA servers 
			authentic: Number,
			counterfeit: Number,
			errors: Number,

			// Computed Results
			pownstring: String,
			result: String
		},
		coinSN1 : {
			...
		}
	}

{
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

	// Array of the Serial Numbers of the coins to send
	sns: [1,2,3],

	// Array on the Network Numbers of the coins to send (optional)
	nns: [1,1,1],

	// The Serial Number of the Destination Wallet
	to: 103,

	// Memo (optional)
	memo: 'From Mike'
}

// Callback (optional)
callback

raidaJS.apiTransfer(params)
raidaJS.apiTransfer(params, idx => {})
```

Output:

The same as the one for the apiDetect

#### apiSend

Sends coins from a Local Wallet to a Remote Wallet

Input

```js
let params = {
        'to' : 444,
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

raidaJS.apiSend(params)
raidaJS.apiSend(params, idx => {})

```

Output:

The same as the one for the apiDetect
