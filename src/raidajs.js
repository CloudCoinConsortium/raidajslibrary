import axios from 'axios'
import qs from 'qs'

let _isBrowser = false
if (typeof(process.browser) !== 'undefined' && process.browser) {
	_isBrowser = true
}

// Entry Point for the Library
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
			debug: false
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


	// Return the array of raida servers
	getServers() {
		return this._raidaServers
	}

	/*** RAIDA SERVICES API ***/

	// Echo
	apiEcho(callback = null) {
		let rqs = this._launchRequests("echo", {}, 'GET', callback)
		let rv = {
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

			return rv
		})
		
		return mainPromise
	}

	// Detect
	apiDetect(params, callback = null) {
		if (!Array.isArray(params)) {
			console.error("Invalid input data")
			return null
		}
		
		let rqdata = this._formRequestData(params)

		// Launch Requests
		let rqs = this._launchRequests("multi_detect", rqdata, 'POST', callback)

		return this._getGenericMainPromise(rqs, params)	
	}

	// FixFracked
	async apiFixfracked(params, callback = null) {
		let coins = []

		// Filter out fracked coins
		for (let k in params) {
			let coin = params[k]

			if (!('pownstring' in coin))
				continue

			if (!('result' in coin))
				continue

			if (coin.result != this.__frackedResult)
				continue

		//	coin['an'] = []
		//	for (let x = 0; x < this._totalServers; x++)
		//		coin['an'][x] = this._generatePan()

			if (!this._validateCoin(coin))
				continue

			coin.pownArray = coin.pownstring.split("")
			coin.pownstring = ""
			for (let x = 0; x < this._totalServers; x++) {
				if (coin.pownArray[x] != 'p') {
					coin.an[x] = this._generatePan()
					coin.pan[x] = coin.an[x]
				}
			}
			coins.push(coin)
		}

		// Round 1
		for (let i = 0; i < this._totalServers; i++) {
			let ctfix = []
			for (let j = 0; j < coins.length; j++) {
				if (coins[j].pownArray[i] == 'p')
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
				if (coins[j].pownArray[i] == 'p')
					continue;

				ctfix.push(coins[j])
			}
			if (ctfix.length != 0) {
				await this._realFix(1, i, coins, callback)
			}
		}

		let rv = {
			totalNotes: coins.length,
			fixedNotes: 0,
			result : {},
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

		return rv
	}

	// Send
	apiSend(params, callback = null) {
		if (!'coins' in params) {
			console.error("Invalid input data")
			return null
		}

		if (!Array.isArray(params['coins'])) {
			console.error("Invalid input data")
			return null
		}

		if (!'to' in params) {
			console.error("Invalid params. To is not defined")
			return null
		}
		
		let rqdata = []
		let memo = 'memo' in params ? params['memo'] : "Send"

		// Assemble input data for each Raida Server
		for (let i = 0; i < this._totalServers; i++) {
			rqdata.push({
				sns: [],
				nns: [],
				ans: [],
				pans: [],	
				denomination: [],
				to_sn: params['to'],
				tag: memo
			})
			for (let j = 0; j < params['coins'].length; j++) {
				let coin = params['coins'][j]
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

		// Launch Requests
		let rqs = this._launchRequests("send", rqdata, 'POST', callback)

		return this._getGenericMainPromise(rqs, params['coins'])	
	}

	// Transfer
	async apiTransfer(params, callback = null) {
		let coin = this._getCoinFromParams(params)
		if (coin == null) 
			return null

		if (!'to' in params) {
			console.error("Invalid params. To is not defined")
			return null
		}

		let changeMakerId = this.options._changeMakerId
		if ('changeMakerId' in params) {
			changeMakerId = params['changeMakerId']
		}


		if (!('amount' in params)) {
			console.error("Invalid params. Amount is not defined")
			return null
		}

		let memo = 'memo' in params ? params['memo'] : "Transfer from SN#" + coin.sn

		let gcRqs = await this._getCoins(coin, callback)
		let sns = Object.keys(gcRqs.coins)

		let nns = new Array(sns.length)
		nns.fill(this.options.defaultCoinNn)

		sns = [ 1, 2,3, 6291450, 16777210, 16777211]
		if (params.amount > this._calcAmount(sns)) {
			console.error("Not enought cloudcoins")
			return null
		}

		console.log("rq")

		console.log(sns)


		let rqdata = []

		let rvalues = this._pickCoinsAmountFromArrayWithExtra(sns, params.amount)

		let coinsToSend = rvalues.coins
		let changeCoin = rvalues.extra

		
		return
		// Assemble input data for each Raida Server
		for (let i = 0; i < this._totalServers; i++) {
			rqdata.push({
				sns: sns,
				nns: nns,
				an: coin.an[i],
				pan: coin.pan[i],
				sn: coin.sn,
				nn: coin.nn,
				denomination: this.getDenomination(coin.sn),
				to_sn: params['to'],
				tag: memo
			})
		}

		// Launch Requests
		let rqs = this._launchRequests("transfer", rqdata, 'POST', callback)
	
		let coins = new Array(sns.length)
		sns.forEach((value, idx) => { 
			coins[idx] = { sn: sns[idx], nn: nns[idx] }
		})

		return this._getGenericMainPromise(rqs, coins)	
	}

	/*** INTERNAL FUNCTIONS. Use witch caution ***/
	async _getCoins(coin, callback) {
		let rqdata = []

		// Assemble input data for each Raida Server
		for (let i = 0; i < this._totalServers; i++) {
			rqdata.push({
				sn: coin.sn,
				nn: coin.nn,
				an: coin.an[i],
				pan: coin.pan[i],
				denomination: this.getDenomination(coin.sn),
			})
		}
		let rv = {
			coins: {}
		}
		let rqs = this._launchRequests("show", rqdata, 'GET', callback).then(response => {
			this._parseMainPromise(response, 0, rv, response => {
				if (response.status !== "pass") {
					return
				}

				let coins = response.message
				for (let i = 0; i < coins.length; i++) {
					let key = coins[i].sn

					if (!(key in rv.coins)) {
						rv.coins[key] = {
							passed: 0
						}
					}

					rv.coins[key].passed++
				}

			
			}) 

			let nrv = {
				coins: {}
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

	_getGenericMainPromise(rqs, coins, gradeFunction = null) {
		// Parse the response from all RAIDA servers
		let mainPromise = rqs.then(response => {
			// Return value
			let rv = {
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
					result: "unknown"
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

		if (e > 12)
			return this.__errorResult

		if (f > a || f > 5)
			return this.__counterfeitResult

		if (f > 0 || e > 0)
			return this.__frackedResult

		return this.__authenticResult
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
				callback("error")
				continue
			}

			serverResponse = response[i].value.data
			if (arrayLength == 0) {
				if (!('status' in serverResponse)) {
					console.error("Invalid response from RAIDA: " + i +". No status")
					this._addDetails(rv)
					callback("error")
					continue
				}
			} else {
				if (!Array.isArray(serverResponse)) {
					console.error("Expected array from RAIDA: " + i)
					this._addDetails(rv)
					callback("error")
					continue
				}

				if (serverResponse.length != arrayLength) {
					console.error("Invalid length returned from RAIDA: " + i
						+ ". Expected: " + arrayLength +", got " + serverResponse.length)
					this._addDetails(rv)
					callback("error")
					continue
				}
			}

			callback(serverResponse, i)	
			this._addDetails(rv, serverResponse)
		}
	}

	_addDetails(rv, serverResponse = null) {
		if (this.options.debug)
			rv['details'].push(serverResponse)
	}

	_launchRequests(url, params = null, method = 'POST', callback = null, servers = null) {
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
			if (typeof(params) === 'object' && Array.isArray(params))
				rparams = params[raidaIdx]
			else
				rparams = params

			if (method == 'GET') {
				options.params = rparams
				pm = this._axInstance.get(rq, options)
			} else {
				pm = this._axInstance.post(rq, qs.stringify(rparams), options)
			}

			pm.then(response => {
				if (callback != null)
					callback(raidaIdx, url)

				return response.data
			}).catch(error => {
				if (error.response) {
					console.error("Invalid server response from RAIDA" + i + ": " + error.response.status)
				} else {
					console.error("Failed to get a respose from RAIDA" + i)
				}

				return null
			})

			pms.push(pm)
		}
		
		return Promise.allSettled(pms)
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

	// Assemble message from 25 Raida Servers
	_assembleMessage(mparts) {
		let cs = 0, length

		// Determine the chunk size
		for (let i = 0; i < this._totalServers; i++) {
			if (mparts[i] == null)
				continue

			cs = mparts[i].length / 3
			break
		}

		// Failed to determine the chunk size
		if (cs == 0)
			return null

		// The length of the message
		length = cs * this._totalServers
		let msg = [length]

		for (let i = 0; i < this._totalServers; i++) {
			if (mparts[i] == null)
				continue

			// Split the data from one RAIDA server
			let chrs = mparts[i].split('')

			// Go over this data
			for (let j = 0; j < chrs.length; j += 3) {
				let triplet = j / 3

				let cidx0 = triplet * this._totalServers + i
				let cidx1 = triplet * this._totalServers + i + 3
				let cidx2 = triplet * this._totalServers + i + 6

				if (cidx0 >= length)
					cidx0 -= length

				if (cidx1 >= length)
					cidx1 -= length

				if (cidx1 >= length)
					cidx1 -= length

				if (cidx2 >= length)
					cidx2 -= length

				msg[cidx0] = chrs[j]
				msg[cidx1] = chrs[j + 1]
				msg[cidx2] = chrs[j + 2]
			}
		}

		// Check if the message is full
		for (let i = 0; i < length; i++) {
			if (typeof(msg[i]) == 'undefined')
				return null
		}

		// Join the string together
		msg = msg.join('')

		// Trim pads at the end
		msg = msg.replace(/-+$/g, '');

		return msg
	}

	// Split message into 25 chunks
	_splitMessage(message) {
		// Pad the message to have it multily of 25
		let pads = message.length % this._totalServers
		for (let i = 0; i < (this._totalServers - pads); i++)
			message += "-"

		// Break the message
		let cs = message.split('')

		// Init array
		let nrmessage = []
		for (let i = 0; i < this._totalServers; i++)
			nrmessage[i] = ""

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
			nrmessage[ridx] += cs[i]
			nrmessage[ridx] += cs[cidx0]
			nrmessage[ridx] += cs[cidx1]
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
		console.log("t")
		console.log(totals)
		exps = this._getExpCoins(amount, totals, true)
        
		collected = rest = 0
		console.log(exps)
		for (let i = 0; i < coins.length; i++) {
			denomination = this.getDenomination(coins[i]);
			console.log("d="+denomination)
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
}



// Export to the Window Object if we are in browser
if (_isBrowser) {
	window.RaidaJS = RaidaJS
}

// ES6 export
export default RaidaJS

// Es5 export
//module.exports = RaidaJS
