# Here are the test plans for each of our raidajs functions:

### apiCreateRecord
#### testing
automate 'let r = await raidaJS.apiCreateRecord(data)'
#### methods
use invalid params to test error codes
info for coin, mount, memo, initiator_id, initiator_description_url, initiator_image_url can be fabricated. each event_code and initiator_type will be used in the tests. let guid be generated. a test coin may need to be provided
#### expected
if invalid params are used, their associated error codes are expected in r.code
in a successful test r.code is expected to be 0x0. the following test of apiShowRecords can be used to check if recorded data matches what was provided and the guid that was generated. manually confirming RAIDA's data may be necessary if unexpected results


### apiShowRecords
#### testing
automate 'let r = await raidaJS.apiShowRecords(data)' following the test of 'apiCreateRecord'
#### methods
use invalid params to test error codes
a test record will be created with apiCreateRecord and the info from that record will be used for the automated test.
#### expected
if invalid params are used, their associated error codes are expected in r.code
in a successful test expect for r.code to be 0x0 and r.records to hold data matching that of the test record created. manually confirming RAIDA's data may be necessary if unexpected results


### apiDeleteRecord
#### testing
automate 'let r = await raidaJS.apiDeleteRecord(data)' following the tests of apiCreateRecord and apiShowRecords
#### methods
use invalid params to test error codes
data shall be the same as provided in the previous tests, guid used should be the one generated and returned by the apiCreateRecord test
#### expected
if invalid params are used, their associated error codes are expected in r.code
in a successful test r.code is expected to be 0x0. apiShowRecords can be used to confirm that the test record is deleted






### apiEcho
#### testing
automated test running 'let r = await raidaJS.apiEcho()'
#### method
turn on/off connecting to specific or many raida.
check r.onlineServers and r.details[] for expected Results
#### expected
with no connection to Raida2, r.onlineServers == 24, and r.details[2] == NULL
are to be expected



### apiDetect
#### testing
automated test await raidaJS.apiDetect(params) using fake params to check responses
