# Here are the test plans for each of our raidajs functions:

##apiEcho
automated test running 'let r= raidaJS.apiEcho()'
turn on/off connecting to certain raida (with DNS filter?)
check r.onlineServers and r.details[] for expected Results
example: with no connection to Raida2, r.onlineServers == 24, and r.details[2] == NULL?

##apiDetect
automated test raidaJS.apiDetect(params) using fake params to check responses
