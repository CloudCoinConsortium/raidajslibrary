# RaidaJS TestPlan


## Table of Contents
[Universal Tests](TESTPLAN.MD#Universal Tests)

[NFT](TESTPLAN.MD#NFT)

[Statements and Records](TESTPLAN.MD#Statements&Records)

[Bill Pay](TESTPLAN.MD#BillPay)

[Account Maintenance](TESTPLAN.MD#AccountMaintenance)

[Accounts](TESTPLAN.MD#Accounts)

[Balance and AutoSync](TESTPLAN.MD#Balance&AutoSync)

[Transfer](TESTPLAN.MD#Transfer)

[Everything Else](TESTPLAN.MD#EverythingElse)


# Universal Tests
These are the test plans apply to every method in the library that uses a CloudCoin
#### how we're testing
we use nodejs and mocha to create automated tests of each function
#### methods
tests for error codes:
Test Number |  Title | Code
---|---|---
1. no coin given (code 0x1001)
2. empty coin param (code 0x1002)
3. fake/counterfeit coin (code 0x2001)

for a successful test coin needs to be provided, hard coded into the test.

4. successful operation (code 0x0)

testing for less that ideal conditions

5. test with 3 raida down
6. test with fracked coin (2 bad AN)
#### expected
expect appropriate error codes to show up in r.code (indicated in parentheses). r.code should always be 0x0 if test was successful. should still be functional with only a few raida down or slightly fracked coin.

# Specific Tests
Everything below covers the tests that need to be specifically done on each method, that isn't already covered above

# NFT
### apiNFTInsert
#### methods
tests for error codes:
Test Number |  Title | Code
---|---|---
7 | no metadata given | 0x1014
8 | no filename within metadata | 0x1014
9 | no data given |  0x1010
10 | empty data | 0x1024
11 | too much data | 0x1016
12 | unsupported protocol | 0x1013

#### expected


### apiNFTRead
#### methods
tests for error codes:
(nothing new from universal tests)
#### expected





# Statements & Records
### apiCreateRecord

#### methods

Tests for error codes:

* Info for coin
* Amount
* Memo
* Initiator_id
* Initiator_description_url
* Initiator_image_url


Test Number |  Title | Code
---|---|---
7 | No Amount Given | 0x1005
8 | Invalid Event Code | 0x1007
9 | Invalid Initiator Type | 0x1008
10 | Invalid GUID: Short | 0x1004
11 | Invalid GUID: Integer | 0x1004
12 | Successful record created, send/self | 0x0
13 | Successful record created, other_know/receive | 0x0

NOTE: Multiple test for success will be ran. Each event_code and initiator_type will be used in the tests. let the guid be generated. for successful a tests coin will be provided.


#### expected
the following test of apiShowRecords can be used to check if recorded data matches what was provided and the guid that was generated. manually confirming RAIDA's data may be necessary if unexpected results.

### apiShowRecords
#### methods
tests for error codes:

7. invalid timestamp: negative number (code 0x1009)
8. invalid timestamp: string (code 0x1009)

a test record will be created with apiCreateRecord and the info from that record will be used for the automated test.

#### expected
in a successful test expect for r.records to hold data matching that of the test record created. manually confirming RAIDA's data may be necessary if unexpected results.


### apiDeleteRecord
#### methods
tests for error codes:

7. invalid guid: short (code 0x1004)
8. invalid guid: integer (code 0x1004)
9. no guid (code 0x1003)

data shall be the same as provided in the previous tests, guid used should be the one generated and returned by the apiCreateRecord test
10. successful record deleted, send/self (code 0x0)
11. successful record deleted, other_know/receive (code 0x0)

#### expected
apiShowRecords can be used to confirm that the test record is deleted.


# Bill Pay
### apiBillPay
#### methods
tests for error codes:

7. no paydata given (code 0x1017)
8. invalid paydata method (code 0x1019)
9. invalid paydata fileformat  (code 0x1020)
10. invalid paydata amount: written in text (code 0x1021)
11. invalid paydata amount: negative number (code 0x1021)
12. invalid paydata denominations aren't 0 (code 0x1021)
13. invalid paydata status (code 0x1022)
14. invalid guid (code 0x1004)

#### expected
apiBillPayList test will be used for verification.

### apiBillPayList
#### methods
tests for error codes:

7. no guid given (code 0x1003)
8. invalid guid: short (code 0x1004)
9. invalid guid: integer (code 0x1004)
10. no record made (code 0x2003)

use same guid as the test for apiBillPay.

#### expected
expected return data should match the data given in the apiBillPay test.



# Account Maintenance
### apiHealthCheck
#### methods
tests for error codes:
(nothing new from universal tests)
#### expected

### apiFixFracked
#### methods
tests for error codes:
(nothing new from universal tests)
#### expected


### apiRegisterSkyWallet
#### methods
tests for error codes:
7. missing dns name (code 0x1025)
8. dns record already exists (code 0x5003)
9. failed to get tickets (code 0x5002)
10. incorrect dns response (code 0x5004)

incorrect responses from dns will be created using promises
#### expected


### apiGenerateCard
#### methods
tests for error codes:
7. missing card number (code 0x1027)
8. missing cvv (code 0x1028)
9. missing dns name (code 0x1025)
10. missing expiration (code 0x1029)
11. invalid card from wrong cvv (code 0x1027)
12. invalid expiration (code 0x1030)
13. invalid cardnumber (code 0x1025)
14. invalid http response (code 0x5005)
15. invalid http content type (code 0x506)
16. failed to embed stack (code 0x2004)

will use promises to manipulate http responses
#### expected


### apiRecoverID
#### methods
tests for error codes:
7. missing dns name (code 0x1025)
8. missing email (code 0x1031)
9. can't find dns (code 0x5001)

#### expected


### apiDeleteSkyWallet
#### methods
tests for error codes:
7. missing dns name (code 0x1025)
9. failed to get tickets (code 0x5002)
10. incorrect dns response (code 0x5004)

#### expected




# Accounts
### apiResolveSkywallet
#### methods
tests for error codes:
7. can't find dns (code 0x5001)

#### expected

### apiRestoreCard
#### methods
tests for error codes:
7. missing dns name (code 0x1025)
8. can't find dns (code 0x5001)
9. invalid card (code 0x1027)
#### expected


### apiGetFreeCoin
#### methods
tests for error codes:
7. no response
8. fail to get coin

will give a fake response to test error
#### expected


# Balance & AutoSync
### apiEcho
#### methods
tests for error codes:
(nothing new from universal tests)

#### expected

### apiShowBalance
#### methods
tests for error codes:
(nothing new from universal tests)

#### expected


### apiFixTransferSync
#### methods
run same tests as apiFixTransfer

#### expected


# Transfer
### apiTransfer
#### methods
tests for error codes:
7. missing 'to' param
8. can't find dns that's being transfered to
9. missing amount
10. invalid guid
11. not enough cloudcoin
12. surpass coin transfer amount limit

#### expected
expecting error messages instead of codes

### apiViewReceipt
#### methods
tests for error codes:
7. missing account
8. missing tag
9. account invalid due to invalid SN
10. invalid tag

#### expected
expecting error messages instead of codes



# Everything else
### apiDetect
#### methods
tests for error codes:
(nothing new from universal tests)

#### expected

### apiSend
#### methods
tests for error codes:
(nothing new from universal tests)

#### expected

### apiReceive
#### methods
tests for error codes:
(nothing new from universal tests)

#### expected

### embedImage
#### methods
tests for error codes:
(nothing new from universal tests)

#### expected

### extractStack
#### methods
tests for error codes:
(nothing new from universal tests)

#### expected

### apiGetTicket
#### methods
tests for error codes:
(nothing new from universal tests)

#### expected

### apiShowCoins
#### methods
tests for error codes:
(nothing new from universal tests)

#### expected

### apiShowCoinsAsArray
#### methods
tests for error codes:
(nothing new from universal tests)

#### expected

### GetCCByUsernameAndPassword
#### methods
tests for error codes:
(nothing new from universal tests)

#### expected

### apiCreatCCForRegistration
#### methods
tests for error codes:
(nothing new from universal tests)

#### expected

### apiGetCCByCardData
#### methods
tests for error codes:
(nothing new from universal tests)

#### expected

### apiPay
#### methods
tests for error codes:
(nothing new from universal tests)

#### expected
