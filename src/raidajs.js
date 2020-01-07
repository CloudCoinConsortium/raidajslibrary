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
	apiEcho(cb = null) {
		let rqs = this._launchRequests("echo", {}, 'GET', cb)
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
	apiDetect(params, cb = null) {
		if (!Array.isArray(params)) {
			console.error("Invalid input data")
			return null
		}
		
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
				rqdata[i].pans.push(coin.an[i])
				rqdata[i].denomination.push(this.getDenomination(coin.sn))
			}
		}

		// Launch Requests
		let rqs = this._launchRequests("multi_detect", rqdata, 'POST', cb)

		// Parse the response from all RAIDA servers
		let mainPromise = rqs.then(response => {
			// Return value
			let rv = {
				totalNotes: params.length,
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
			for (let i = 0; i < params.length; i++) {
				let sn = params[i].sn
				rcoins[sn] = {
					nn: params[i].nn,
					sn: sn,
					denomination: this.getDenomination(sn),
					errors: 0,
					counterfeit: 0,
					authentic: 0,
					pownstring: "",
					result: "unknown"
				}
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
					let sn = params[i].sn
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
						rcoins[sn].errors++;
						rcoins[sn].pownstring += "e"
					}
				}
			})

			// Detect the result of each coin
			Object.keys(rcoins).map(sn => {
				rcoins[sn].result = this._gradeCoin(rcoins[sn].authentic, 
					rcoins[sn].counterfeit, rcoins[sn].errors)

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


	/*** INTERNAL FUNCTIONS. Use witch caution ***/
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
		
	_parseMainPromise(response, arrayLength, rv, cb) {
		for (let i = 0; i < response.length; i++) {
			let serverResponse

			if (response[i].status != 'fulfilled') {
				this._addDetails(rv)
				cb("error")
				continue
			}

			serverResponse = response[i].value.data
			if (arrayLength == 0) {
				if (!('status' in serverResponse)) {
					console.error("Invalid response from RAIDA: " + i +". No status")
					this._addDetails(rv)
					cb("error")
					continue
				}
			} else {
				if (!Array.isArray(serverResponse)) {
					console.error("Expected array from RAIDA: " + i)
					this._addDetails(rv)
					cb("error")
					continue
				}

				if (serverResponse.length != arrayLength) {
					console.error("Invalid length returned from RAIDA: " + i
						+ ". Expected: " + arrayLength +", got " + serverResponse.length)
					this._addDetails(rv)
					cb("error")
					continue
				}
			}

			cb(serverResponse, i)	
			this._addDetails(rv, serverResponse)
		}
	}

	_addDetails(rv, serverResponse = null) {
		if (this.options.debug)
			rv['details'].push(serverResponse)
	}

	_launchRequests(url, params = null, method = 'POST', cb = null) {
		if (params == null)
			params = {}
			console.log("params0")
			console.log(params)

		let pms = []
		for (let i = 0; i < this._totalServers; i++) {
			let rq = this._raidaServers[i] + "/service/" + url

			let pm
			let options = {
				timeout : this.options.timeout
			}

			let rparams
			if (typeof(params) === 'object' && Array.isArray(params))
				rparams = params[i]
			else
				rparams = params

			console.log("params1")
			console.log(rparams)
			if (method == 'GET') {
				options.params = rparams
				pm = this._axInstance.get(rq, options)
			} else {
				pm = this._axInstance.post(rq, qs.stringify(rparams), options)
			}

			pm.then(response => {
				if (cb != null)
					cb(i)

				return response.data
			}).catch(error => {
				if (error.response) {
					console.log("Invalid server response from RAIDA" + i + ": " + error.response.status)
				} else {
					console.log("Failed to get a respose from RAIDA" + i)
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
		console.log(this.options)
		for (let i = 0; i < this._totalServers; i++)
			this._raidaServers[i] = this.options.protocol + "://" + this.options.prefix 
				+ i + "." +this.options.domain
	}

	// Check if the coin is valid
	_validateCoin(coin) {
		console.log(coin)
		if (typeof(coin) !== 'object')
			return false;

		if (!('sn' in coin))
			return false;

		if (!('an' in coin))
			return false;

		if (typeof(coin.an) != 'object' || !Array.isArray(coin.an)) 
			return false

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

}



// Export to the Window Object if we are in browser
if (_isBrowser) {
	window.RaidaJS = RaidaJS
}

// ES6 export
export default RaidaJS

// Es5 export
//module.exports = RaidaJS
