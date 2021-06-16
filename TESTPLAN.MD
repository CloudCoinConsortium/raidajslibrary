# RaidaJS TestPlan


## Table of Contents
[Universal Tests](TESTPLAN.MD#Universal-Tests)

[NFT](TESTPLAN.MD#NFT)

[Statements and Records](TESTPLAN.MD#Statements-and-Records)

[Bill Pay](TESTPLAN.MD#BillPay)

[Account Maintenance](TESTPLAN.MD#Account-Maintenance)

[Accounts](TESTPLAN.MD#Accounts)

[Balance and AutoSync](TESTPLAN.MD#Balance-and-AutoSync)

[Transfer](TESTPLAN.MD#Transfer)

[Everything Else](TESTPLAN.MD#Everything-Else)


# Universal Tests
These are the test plans apply to every method in the library that uses a CloudCoin.
## How We're Testing:
We use nodeJS and mocha to create automated tests of each function.
## Tests for error codes:
Test Number |  Title | Code
---|---|---
1 | No Coin Given | 0x1001
2 | Empty Coin Parameter | 0x1002
3 | Fake/Counterfeit Coin | 0x2001
4 | Successful Operation | 0x0

## Tests for Specific Conditions
For a successful test coin needs to be provided, hard coded into the test.

Testing for less that ideal conditions:
Test Number |  Title
---|---
5 | Test with 3 RAIDA Down
6 | Test with Fracked Coin (3 Bad AN)
## Results Expected:
Expect appropriate error codes to show up in r.code. r.code should always be 0x0 if testing a sucessful run.

Tests running with a few RAIDA down or slightly fracked coin should still return a 0x0 code.

# Specific Tests
Everything below covers the tests that need to be specifically done on each method, that isn't already covered above.

# NFT
## apiNFTInsert
### Tests:

Test Number |  Title | Expected Return Code | Expected Reponse (phase 2)
---|---|---|---
1 | No Coin Given | 0x1001|  Comming Soon
2 | Empty Coin Parameter | 0x1002|  Comming Soon
3 | Fake/Counterfeit Coin | 0x2001|  Comming Soon
4 | Successful Operation | 0x0|  Comming Soon
5 | Test with 3 RAIDA Down|  Comming Soon
6 | Test with Fracked Coin (3 Bad AN)|  Comming Soon
7 | No Metadata Given | 0x1014 |  Comming Soon
8 | No Filename Within Metadata | 0x1014 |  Comming Soon
9 | No Data Given |  0x1010 |  Comming Soon
10 | Empty Data Parameter | 0x1024 |  Comming Soon
11 | Too Much Data | 0x1016 |  Comming Soon
12 | Unsupported Protocol | 0x1013 | Comming Soon

### apiNFTRead
#### Tests Ran
Tests for error codes:
Test Number |  Title | Code
---|---|---
1-6 | Universal Tests | 0x0
#### Results Expected





# Statements and Records
### apiCreateRecord

#### Tests Ran

Tests for error codes:
Test Number |  Title | Code
---|---|---
1-6 | Universal Tests | 0x0
7 | No Amount Given | 0x1005
8 | Invalid Event Code | 0x1007
9 | Invalid Initiator Type | 0x1008
10 | Invalid GUID: Short | 0x1004
11 | Invalid GUID: Integer | 0x1004
12 | Successful record created, send/self | 0x0
13 | Successful record created, other_know/receive | 0x0


#### Results Expected
the following test of apiShowRecords can be used to check if recorded data matches what was provided and the GUID that was generated. manually confirming RAIDA's data may be necessary if unexpected results.

### apiShowRecords
#### Tests Ran
Tests for error codes:
Test Number |  Title | Code
---|---|---
1-6 | Universal Tests | 0x0
7 | invalid timestamp: negative number | 0x1009
8 | invalid timestamp: string | 0x1009

a test record will be created with apiCreateRecord and the info from that record will be used for the automated test.

#### Results Expected
in a successful test expect for r.records to hold data matching that of the test record created. manually confirming RAIDA's data may be necessary if unexpected results.


### apiDeleteRecord
#### Tests Ran
Tests for error codes:
Test Number |  Title | Code
---|---|---
1-6 | Universal Tests | 0x0
7 | invalid GUID: short | 0x1004
8 | invalid GUID: integer | 0x1004
9 | no GUID | 0x1003

data shall be the same as provided in the previous tests, GUID used should be the one generated and returned by the apiCreateRecord test
10 | successful record deleted, send/self | 0x0)
11 | successful record deleted, other_know/receive | 0x0)

#### Results Expected
apiShowRecords can be used to confirm that the test record is deleted.


# Bill Pay
### apiBillPay
#### Tests Ran
Tests for error codes:
Test Number |  Title | Code
---|---|---
1-6 | Universal Tests | 0x0
7 | no paydata given | 0x1017
8 | invalid paydata method | 0x1019
9 | invalid paydata fileformat  | 0x1020
10 | invalid paydata amount: written in text | 0x1021
11 | invalid paydata amount: negative number | 0x1021
12 | invalid paydata denominations aren't 0 | 0x1021
13 | invalid paydata status | 0x1022
14 | invalid GUID | 0x1004

#### Results Expected
apiBillPayList test will be used for verification.

### apiBillPayList
#### Tests Ran
Tests for error codes:
Test Number |  Title | Code
---|---|---
1-6 | Universal Tests | 0x0
7 | no GUID given | 0x1003
8 | invalid GUID: short | 0x1004
9 | invalid GUID: integer | 0x1004
10 | no record made | 0x2003

use same GUID as the test for apiBillPay.

#### Results Expected
Return data should match the data given in the apiBillPay test.



# Account Maintenance
### apiHealthCheck
#### Tests Ran
Test Number |  Title | Code
---|---|---
1-6 | Universal Tests | 0x0
#### Results Expected

### apiFixFracked
#### Tests Ran
Test Number |  Title | Code
---|---|---
1-6 | Universal Tests | 0x0
#### Results Expected


### apiRegisterSkyWallet
#### Tests Ran
Tests for error codes:
Test Number |  Title | Code
---|---|---
1-6 | Universal Tests | 0x0
7 | missing DNS name | 0x1025
8 | DNS record already exists | 0x5003
9 | failed to get tickets | 0x5002
10 | incorrect DNS response | 0x5004

incorrect responses from DNS will be created using promises
#### Results Expected


### apiGenerateCard
#### Tests Ran
Tests for error codes:
Test Number |  Title | Code
---|---|---
1-6 | Universal Tests | 0x0
7 | missing card number | 0x1027
8 | missing cvv | 0x1028
9 | missing DNS name | 0x1025
10 | missing expiration | 0x1029
11 | invalid card from wrong cvv | 0x1027
12 | invalid expiration | 0x1030
13 | invalid cardnumber | 0x1025
14 | invalid http response | 0x5005
15 | invalid http content type | 0x506
16 | failed to embed stack | 0x2004

will use promises to manipulate http responses
#### Results Expected


### apiRecoverID
#### Tests Ran
Tests for error codes:
Test Number |  Title | Code
---|---|---
1-6 | Universal Tests | 0x0
7 | missing DNS name | 0x1025
8 | missing email | 0x1031
9 | can't find DNS | 0x5001

#### Results Expected


### apiDeleteSkyWallet
#### Tests Ran
Tests for error codes:
Test Number |  Title | Code
---|---|---
1-6 | Universal Tests | 0x0
7 | missing DNS name | 0x1025
9 | failed to get tickets | 0x5002
10 | incorrect DNS response | 0x5004

#### Results Expected




# Accounts
### apiResolveSkywallet
#### Tests Ran
Tests for error codes:
Test Number |  Title | Code
---|---|---
1-6 | Universal Tests | 0x0
7 | can't find DNS | 0x5001

#### Results Expected

### apiRestoreCard
#### Tests Ran
Tests for error codes:
Test Number |  Title | Code
---|---|---
1-6 | Universal Tests | 0x0
7 | missing DNS name | 0x1025
8 | can't find DNS | 0x5001
9 | invalid card | 0x1027
#### Results Expected


### apiGetFreeCoin
#### Tests Ran
Tests for error codes:
Test Number |  Title | Code
---|---|---
1-6 | Universal Tests | 0x0
7 | no response
8 | fail to get coin

will give a fake response to test error
#### Results Expected


# Balance and AutoSync
### apiEcho
#### Tests Ran
Test Number |  Title | Code
---|---|---
1-6 | Universal Tests | 0x0

#### Results Expected

### apiShowBalance
#### Tests Ran
Test Number |  Title | Code
---|---|---
1-6 | Universal Tests | 0x0

#### Results Expected


### apiFixTransferSync
#### Tests Ran
run same tests as apiFixTransfer

#### Results Expected


# Transfer
### apiTransfer
#### Tests Ran
Tests for error codes:
Test Number |  Title | Code
---|---|---
1-6 | Universal Tests | 0x0
7 | missing 'to' Parameter
8 | can't find DNS that's being transfered to
9 | missing amount
10 | invalid GUID
11 | not enough cloudcoin
12 | surpass coin transfer amount limit

#### Results Expected
expecting error messages instead of codes

### apiViewReceipt
#### Tests Ran
Tests for error codes:
Test Number |  Title | Code
---|---|---
1-6 | Universal Tests | 0x0
7 | missing account
8 | missing tag
9 | account invalid due to invalid SN
10 | invalid tag

#### Results Expected
expecting error messages instead of codes



# Everything else
### apiDetect
#### Tests Ran
Test Number |  Title | Code
---|---|---
1-6 | Universal Tests | 0x0

#### Results Expected

### apiSend
#### Tests Ran
Test Number |  Title | Code
---|---|---
1-6 | Universal Tests | 0x0

#### Results Expected

### apiReceive
#### Tests Ran
Test Number |  Title | Code
---|---|---
1-6 | Universal Tests | 0x0

#### Results Expected

### embedImage
#### Tests Ran
Test Number |  Title | Code
---|---|---
1-6 | Universal Tests | 0x0

#### Results Expected

### extractStack
#### Tests Ran
Test Number |  Title | Code
---|---|---
1-6 | Universal Tests | 0x0

#### Results Expected

### apiGetTicket
#### Tests Ran
Test Number |  Title | Code
---|---|---
1-6 | Universal Tests | 0x0

#### Results Expected

### apiShowCoins
#### Tests Ran
Test Number |  Title | Code
---|---|---
1-6 | Universal Tests | 0x0

#### Results Expected

### apiShowCoinsAsArray
#### Tests Ran
Test Number |  Title | Code
---|---|---
1-6 | Universal Tests | 0x0

#### Results Expected

### GetCCByUsernameAndPassword
#### Tests Ran
Test Number |  Title | Code
---|---|---
1-6 | Universal Tests | 0x0

#### Results Expected

### apiCreatCCForRegistration
#### Tests Ran
Test Number |  Title | Code
---|---|---
1-6 | Universal Tests | 0x0

#### Results Expected

### apiGetCCByCardData
#### Tests Ran
Test Number |  Title | Code
---|---|---
1-6 | Universal Tests | 0x0

#### Results Expected

### apiPay
#### Tests Ran
Test Number |  Title | Code
---|---|---
1-6 | Universal Tests | 0x0

#### Results Expected
