# Here are the test plans for each of our raidajs functions:


# NFT
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




# statements and records
### apiCreateRecord
#### testing
automate 'let r = await raidaJS.apiCreateRecord(data)'
#### methods
use invalid paramaters to test error codes
info for coin, amount, memo, initiator_id, initiator_description_url, initiator_image_url can be preset.
1. no coin given (code 0x1001)
2. empty coin param (code 0x1002)
3. no amount given (code 0x1005)
4. invalid event code (code 0x1007)
5. invalid initiator type (code 0x1008)
6. invalid guid: short (code 0x1004)
7. invalid guid: integer (code 0x1004)
8. fake/counterfeit coin (code 0x2001)

each event_code and initiator_type will be used in the tests. let the guid be generated. for successful a tests coin will be provided
9. successful record created, send/self (code 0x0)
10. successful record created, other_know/receive (code 0x0)

testing for less that ideal conditions
11. test with 3 raida down
12. test with fracked coin (2 bad AN)
#### expected
if invalid paramaters are used, their associated error codes are expected in r.code
in a successful test r.code is expected to be 0x0. the following test of apiShowRecords can be used to check if recorded data matches what was provided and the guid that was generated. manually confirming RAIDA's data may be necessary if unexpected results. should still be function as usual with only a few raida down or slightly fracked coin.


### apiShowRecords
#### testing
automate 'let r = await raidaJS.apiShowRecords(data)' following the test of 'apiCreateRecord'
#### methods
use invalid paramaters to test error codes
1. no coin given (code 0x1001)
2. empty coin param (code 0x1002)
3. invalid timestamp: negative number (code 0x1009)
4. invalid timestamp: string (code 0x1009)
5. fake/counterfeit coin (code 0x2001)

a test record will be created with apiCreateRecord and the info from that record will be used for the automated test.
6. sucessful show record (code 0x0)

testing for less that ideal conditions
7. test with 3 raida down
8. test with fracked coin (2 bad AN)
#### expected
if invalid paramaters are used, their associated error codes are expected in r.code
in a successful test expect for r.code to be 0x0 and r.records to hold data matching that of the test record created. manually confirming RAIDA's data may be necessary if unexpected results. should still be function as usual with only a few raida down or slightly fracked coin.


### apiDeleteRecord
#### testing
automate 'let r = await raidaJS.apiDeleteRecord(data)' following the tests of apiCreateRecord and apiShowRecords
#### methods
use invalid paramaters to test error codes
1. no coin given (code 0x1001)
2. empty coin param (code 0x1002)
3. invalid guid: short (code 0x1004)
4. invalid guid: integer (code 0x1004)
5. no guid (code 0x1003)
6. fake/counterfeit coin (code 0x2001)

data shall be the same as provided in the previous tests, guid used should be the one generated and returned by the apiCreateRecord test
7. successful record deleted, send/self (code 0x0)
8. successful record deleted, other_know/receive (code 0x0)

testing for less that ideal conditions
9. test with 3 raida down
10. test with fracked coin (2 bad AN)
#### expected
if invalid paramaters are used, their associated error codes are expected in r.code
in a successful test r.code is expected to be 0x0. apiShowRecords can be used to confirm that the test record is deleted. should still be function as usual with only a few raida down or slightly fracked coin.


# Bill Pay
### apiBillPay
#### testing
use nodejs to automate test: let r = await apiBillPay(params).
#### methods
start with testing for error codes. false and missing info will also be given to test error codes.
1. no coin given (code 0x1001)
2. empty coin param (code 0x1002)
3. no paydata given (code 0x1017)
4. invalid paydata method (code 0x1019)
5. invalid paydata fileformat  (code 0x1020)
6. invalid paydata amount: written in text (code 0x1021)
7. invalid paydata amount: negative number (code 0x1021)
8. invalid paydata denominations aren't 0 (code 0x1021)
9. invalid paydata status (code 0x1022)
10. invalid guid (code 0x1004)

for a successful test coin needs to be provided. test coin and image data will be hard coded into the test.
11. successful Bill pay (code 0x0)

testing for less that ideal conditions
12. test with 3 raida down
13. test with fracked coin (2 bad AN)
#### expected
expect appropriate error codes to show up in r.code. 0x0 for success. apiBillPayList test will be used for verification. should still be functional with only a few raida down or slightly fracked coin.

### apiBillPayList
#### testing
use nodejs to automate test: let r = await apiBillPayList(params), following the test of apiBillPay
#### methods
test for error codes using false and missing info
1. no guid given (code 0x1003)
2. invalid guid: short (code 0x1004)
3. invalid guid: integer (code 0x1004)
4. no record made (code 0x2003)

use same guid as the test for apiBillPay.
5. successful bill pay list (code 0x0)


testing for less that ideal conditions
6. test with 3 raida down
7. test with fracked coin (2 bad AN)
#### expected
expected return data should match the data given in the apiBillPay test. r.code should always be 0x0 if test was successful. should still be functional with only a few raida down or slightly fracked coin.
