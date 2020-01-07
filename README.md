# RaidaJS

RAIDA Javascript Library

## Features

- Make asynchronuos requests to the RAIDA
- Accept, analyze, parse and aggregate responses from the RAIDA
- Supported callbacks and hooks for tracing the progress of each request
- Debug information and raw-responses can be attached if necessary
- Supported flexible configuration of the RAIDA parameters

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

```js
	let r = new RaidaJS({ timeout: 20000, debug: false })
	r.apiEcho().then(response => { 
		console.log("Available servers: " + response.onlineServers) 
	})

	let data = [{
		sn: 20,
		an: ["01f2b05d74192e31478846f1b7bdd661","02025cf02053edb09b93ef532a37099d","03518632d60f897d84ae62e75a7059a3","04dfb17c08b6dbc2846fbe8938bece1a","050744735d8b124cc0e31a349770d1f4","0613fcc1a2806a75322d5a9fda0feaa4","0711a8eb968d4d4b0dd82d8a05b2d8eb","08f8f118f4e76e8cc1488514e6bc6881","091849f975223a06e765d3433d3e6a9b","1002d00825ccae4c3507cfe1749980d1","11925225e48a9b0fe497dcde66de9227","12688f1c40550d113b8f4f513bf6b8d4","132b39d22d0b3e4012eb6e962e99b31b","1464dacd34ace94eb4abfe2f378abe87","15890b7fa38069745c1b7c7729b242c1","16a0120db1384da7fed62a9100c2f56f","17500e20b49fd14ea5880aa279061aea","18c35043e9a0ea06dc3a29e0409af6ed","195110f4d85b09cf6618aa13164f6b87","20cf9c8ca170528891bb9eb4ffcbaec0","216c76f5422e92297f4daa453a0d195b","2208a6edb997d0abfec8f88782ff61bd","23d153108902aa4bfe5dab55d9298250","243ec57476e3923eb3f4d9309c5651d6","2538b4aafd39bd136141a2ac31fc8141"]
	}]

	r.apiDetect().then(response => {
		console.log("Authentic Notes: " + response.authenticNotes)
		console.log("Total Notes: " + response.totalNotes)
		Object.keys(response.result).map(sn => {
			console.log("SN: " + sn + " pown: " + response.result[sn].pownstring)
		})
	})



```
