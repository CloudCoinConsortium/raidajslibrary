# Here are the test plans for each of our raidajs functions:


### apiNFTInsert
#### testing
use nodejs to automate test: let r = await apiNFTInsert(params).
#### methods
start with testing for error codes. false and missing info will also be given to test error codes.
1. no coin given (code 0x1001)
2. empty coin param (code 0x1002)
3. no metadata given (code 0x1014)
4. no filename within metadata (code 0x1014)
5. no data given (code 0x1010)
6. empty data (code 0x1024)
7. too much data (code 0x1016)
8. unsupported protocol (code 0x1013)
9. fake/counterfeit coin (code 0x2001)

for a successful test coin needs to be provided. test coin and image data will be hard coded into the test.
10. successful nft insert (code 0x0)
#### expected
expect appropriate error codes to show up in r.code. 0x0 for success. apiNFTRead test will be used for verification

### apiNFTRead
#### testing
use nodejs to automate test: let r = await apiNFTRead(params), following the test of apiNFTInsert
#### methods
test for error codes using false and missing info
1. no coin given (code 0x1001)
2. empty coin param (code 0x1002)
3. fake/counterfeit coin (code 0x2001)
use same test coin as the test for apiNFTInsert.
4. successful nft read (code 0x0)
#### expected
expected return data should match the data given in the apiNFTInsert test. r.code should always be 0x0 if test was successful





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
turn on/off connecting to specific or many raida. implemented with callbacks that reject responses from certain raida
check r.onlineServers and r.details[] for expected Results
#### expected
with no connection to Raida2, r.onlineServers == 24, and r.details[2] == NULL
are to be expected



### apiDetect
#### testing
automated test 'let r = await raidaJS.apiDetect(params)' using fake params to check responses
#### method
fake sn and an will be sent to ensure proper responses. then if test coin data is supplied that info will be used in tests
#### expected
expecting r.status == 'done' r.result.coinSN0 info to match given params. if testing for errors r.errorText should match the error that's being tested
