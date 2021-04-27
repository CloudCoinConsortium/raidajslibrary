# Here are the test plans for each of our raidajs functions:

### apiEcho
#### testing
automated test running 'let r= raidaJS.apiEcho()'
#### method
turn on/off connecting to certain raida (with DNS filter?)
check r.onlineServers and r.details[] for expected Results
#### expected
example: with no connection to Raida2, r.onlineServers == 24, and r.details[2] == NULL?

### apiDetect
#### testing
automated test raidaJS.apiDetect(params) using fake params to check responses
