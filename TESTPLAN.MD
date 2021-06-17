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


# Universal Info About Tests
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

# NFT
## apiNFTInsert
### Tests:

Test Number |  Title | Expected Return Code | Expected Reponse (phase 2)
---|---|---|---
1 | No Coin Given | 0x1001|  Coming Soon
2 | Empty Coin Parameter | 0x1002|  Coming Soon
3 | Fake/Counterfeit Coin | 0x2001|  Coming Soon
4 | Successful Operation | 0x0|  Coming Soon
5 | Test with 3 RAIDA Down| 0x0 |  Coming Soon
6 | Test with Fracked Coin (3 Bad AN)| 0x0 |  Coming Soon
7 | No Metadata Given | 0x1014 |  Coming Soon
8 | No FileName Within Metadata | 0x1014 |  Coming Soon
9 | No Data Given |  0x1010 |  Coming Soon
10 | Empty Data Parameter | 0x1024 |  Coming Soon
11 | Too Much Data | 0x1016 |  Coming Soon
12 | Unsupported Protocol | 0x1013 | Coming Soon

### apiNFTRead
### Tests:
Test Number |  Title | Expected Return Code | Expected Reponse (phase 2)
---|---|---|---
1 | No Coin Given | 0x1001|  Coming Soon
2 | Empty Coin Parameter | 0x1002|  Coming Soon
3 | Fake/Counterfeit Coin | 0x2001|  Coming Soon
4 | Successful Operation | 0x0|  Coming Soon
5 | Test with 3 RAIDA Down| 0x0 |  Coming Soon
6 | Test with Fracked Coin (3 Bad AN)| 0x0 |  Coming Soon



# Statements and Records
### apiCreateRecord
### Tests:
Test Number |  Title | Expected Return Code | Expected Reponse (phase 2)
---|---|---|---
1 | No Coin Given | 0x1001|  Coming Soon
2 | Empty Coin Parameter | 0x1002|  Coming Soon
3 | Fake/Counterfeit Coin | 0x2001|  Coming Soon
4 | Successful Operation | 0x0|  Coming Soon
5 | Test with 3 RAIDA Down| 0x0 |  Coming Soon
6 | Test with Fracked Coin (3 Bad AN)| 0x0 |  Coming Soon
7 | No Amount Given | 0x1005|  Coming Soon
8 | Invalid Event Code | 0x1007|  Coming Soon
9 | Invalid Initiator Type | 0x1008|  Coming Soon
10 | Invalid GUID: Short | 0x1004|  Coming Soon
11 | Invalid GUID: Integer | 0x1004|  Coming Soon
12 | Successful Record Created, send/self | 0x0|  Coming Soon
13 | Successful Record Created, other_know/receive | 0x0|  Coming Soon


### apiShowRecords
### Tests:
Test Number |  Title | Expected Return Code | Expected Reponse (phase 2)
---|---|---|---
1 | No Coin Given | 0x1001|  Coming Soon
2 | Empty Coin Parameter | 0x1002|  Coming Soon
3 | Fake/Counterfeit Coin | 0x2001|  Coming Soon
4 | Successful Operation | 0x0|  Coming Soon
5 | Test with 3 RAIDA Down| 0x0 |  Coming Soon
6 | Test with Fracked Coin (3 Bad AN)| 0x0 |  Coming Soon
7 | Invalid Timestamp: Negative Number | 0x1009|  Coming Soon
8 | Invalid Timestamp: String | 0x1009|  Coming Soon


### apiDeleteRecord
### Tests:
Test Number |  Title | Expected Return Code | Expected Reponse (phase 2)
---|---|---|---
1 | No Coin Given | 0x1001|  Coming Soon
2 | Empty Coin Parameter | 0x1002|  Coming Soon
3 | Fake/Counterfeit Coin | 0x2001|  Coming Soon
4 | Successful Operation | 0x0|  Coming Soon
5 | Test with 3 RAIDA Down| 0x0 |  Coming Soon
6 | Test with Fracked Coin (3 Bad AN)| 0x0 |  Coming Soon
7 | Invalid GUID: Short | 0x1004
8 | Invalid GUID: Integer | 0x1004
9 | No GUID | 0x1003
10 | Successful Record deleted, send/self | 0x0|  Coming Soon
11 | Successful Record deleted, other_know/receive | 0x0|  Coming Soon


# Bill Pay
### apiBillPay
### Tests:
Test Number |  Title | Expected Return Code | Expected Reponse (phase 2)
---|---|---|---
1 | No Coin Given | 0x1001|  Coming Soon
2 | Empty Coin Parameter | 0x1002|  Coming Soon
3 | Fake/Counterfeit Coin | 0x2001|  Coming Soon
4 | Successful Operation | 0x0|  Coming Soon
5 | Test with 3 RAIDA Down| 0x0 |  Coming Soon
6 | Test with Fracked Coin (3 Bad AN)| 0x0 |  Coming Soon
7 | No Paydata Given | 0x1017|  Coming Soon
8 | Invalid Paydata Method | 0x1019|  Coming Soon
9 | Invalid Paydata Fileformat  | 0x1020|  Coming Soon
10 | Invalid Paydata Amount: Written in Text | 0x1021|  Coming Soon
11 | Invalid Paydata Amount: Negative Number | 0x1021|  Coming Soon
12 | Invalid Paydata Denominations Aren't 0 | 0x1021|  Coming Soon
13 | Invalid Paydata Status | 0x1022|  Coming Soon
14 | Invalid GUID | 0x1004|  Coming Soon


### apiBillPayList
### Tests:
Test Number |  Title | Expected Return Code | Expected Reponse (phase 2)
---|---|---|---
1 | Successful Operation | 0x0|  Coming Soon
2 | Test with 3 RAIDA Down| 0x0 |  Coming Soon
3 | Test with Fracked Coin (3 Bad AN)| 0x0 |  Coming Soon
4 | No GUID Given | 0x1003|  Coming Soon
5 | Invalid GUID: Short | 0x1004|  Coming Soon
6 | Invalid GUID: Integer | 0x1004|  Coming Soon
7 | No Record Made | 0x2003|  Coming Soon



# Account Maintenance
### apiHealthCheck
### Tests:
Test Number |  Title | Expected Return Code | Expected Reponse (phase 2)
---|---|---|---
1 | No Coin Given | 0x1001|  Coming Soon
2 | Empty Coin Parameter | 0x1002|  Coming Soon
3 | Fake/Counterfeit Coin | 0x2001|  Coming Soon
4 | Successful Operation | 0x0|  Coming Soon
5 | Test with 3 RAIDA Down| 0x0 |  Coming Soon
6 | Test with Fracked Coin (3 Bad AN)| 0x0 |  Coming Soon

### apiFixFracked
### Tests:
Test Number |  Title | Expected Return Code | Expected Reponse (phase 2)
---|---|---|---
1 | No Coin Given | 0x1001|  Coming Soon
2 | Empty Coin Parameter | 0x1002|  Coming Soon
3 | Fake/Counterfeit Coin | 0x2001|  Coming Soon
4 | Successful Operation | 0x0|  Coming Soon
5 | Test with 3 RAIDA Down| 0x0 |  Coming Soon
6 | Test with Fracked Coin (3 Bad AN)| 0x0 |  Coming Soon


### apiRegisterSkyWallet
### Tests:
Test Number |  Title | Expected Return Code | Expected Reponse (phase 2)
---|---|---|---
1 | No Coin Given | 0x1001|  Coming Soon
2 | Empty Coin Parameter | 0x1002|  Coming Soon
3 | Fake/Counterfeit Coin | 0x2001|  Coming Soon
4 | Successful Operation | 0x0|  Coming Soon
5 | Test with 3 RAIDA Down| 0x0 |  Coming Soon
6 | Test with Fracked Coin (3 Bad AN)| 0x0 |  Coming Soon
7 | Missing DNS Name | 0x1025|  Coming Soon
8 | DNS Record Already Exists | 0x5003|  Coming Soon
9 | Failed to get Tickets | 0x5002|  Coming Soon
10 | Incorrect DNS Response | 0x5004|  Coming Soon


### apiGenerateCard
### Tests:
Test Number |  Title | Expected Return Code | Expected Reponse (phase 2)
---|---|---|---
1 | Successful Operation | 0x0|  Coming Soon
2 | Test with 3 RAIDA Down| 0x0 |  Coming Soon
3 | Test with Fracked Coin (3 Bad AN)| 0x0 |  Coming Soon
4 | Missing Card Number | 0x1027|  Coming Soon
5 | Missing CVV | 0x1028|  Coming Soon
6 | Missing DNS Name | 0x1025|  Coming Soon
7 | Missing Expiration | 0x1029|  Coming Soon
8 | Invalid Card from Wrong CVV | 0x1027|  Coming Soon
9 | Invalid Expiration | 0x1030|  Coming Soon
10 | Invalid Card Number | 0x1025|  Coming Soon
11 | Invalid http Response | 0x5005|  Coming Soon
12 | Invalid http Content Type | 0x506|  Coming Soon
13 | Failed to Embed Stack | 0x2004|  Coming Soon


### apiRecoverID
### Tests:
Test Number |  Title | Expected Return Code | Expected Reponse (phase 2)
---|---|---|---
1 | No Coin Given | 0x1001|  Coming Soon
2 | Empty Coin Parameter | 0x1002|  Coming Soon
3 | Fake/Counterfeit Coin | 0x2001|  Coming Soon
4 | Successful Operation | 0x0|  Coming Soon
5 | Test with 3 RAIDA Down| 0x0 |  Coming Soon
6 | Test with Fracked Coin (3 Bad AN)| 0x0 |  Coming Soon
7 | Missing DNS Name | 0x1025|  Coming Soon
8 | Missing Email | 0x1031|  Coming Soon
9 | Can't Find DNS | 0x5001|  Coming Soon


### apiDeleteSkyWallet
### Tests:
Test Number |  Title | Expected Return Code | Expected Reponse (phase 2)
---|---|---|---
1 | No Coin Given | 0x1001|  Coming Soon
2 | Empty Coin Parameter | 0x1002|  Coming Soon
3 | Fake/Counterfeit Coin | 0x2001|  Coming Soon
4 | Successful Operation | 0x0|  Coming Soon
5 | Test with 3 RAIDA Down| 0x0 |  Coming Soon
6 | Test with Fracked Coin (3 Bad AN)| 0x0 |  Coming Soon
7 | Missing DNS Name | 0x1025|  Coming Soon
9 | Failed to get Tickets | 0x5002|  Coming Soon
10 | Incorrect DNS Response | 0x5004|  Coming Soon



# Accounts
### apiResolveSkywallet
### Tests:
Test Number |  Title | Expected Return Code | Expected Reponse (phase 2)
---|---|---|---
1 | Successful Operation | 0x0|  Coming Soon
2 | Test with 3 RAIDA Down| 0x0 |  Coming Soon
3 | Test with Fracked Coin (3 Bad AN)| 0x0 |  Coming Soon
4 | Can't Find DNS | 0x5001|  Coming Soon


### apiRestoreCard
### Tests:
Test Number |  Title | Expected Return Code | Expected Reponse (phase 2)
---|---|---|---
1 | Successful Operation | 0x0|  Coming Soon
2 | Test with 3 RAIDA Down| 0x0 |  Coming Soon
3 | Test with Fracked Coin (3 Bad AN)| 0x0 |  Coming Soon
4 | Missing DNS Name | 0x1025|  Coming Soon
5 | Can't Find DNS | 0x5001|  Coming Soon
6 | Invalid Card | 0x1027|  Coming Soon


### apiGetFreeCoin
### Tests:
Test Number |  Title | Expected Return Code | Expected Reponse (phase 2)
---|---|---|---
1 | Successful Operation | 0x0|  Coming Soon
2 | Test with 3 RAIDA Down| 0x0 |  Coming Soon
3 | Test with Fracked Coin (3 Bad AN)| 0x0 |  Coming Soon
4 | No Response| ? |  Coming Soon
5 | Fail to get Coin| ? |  Coming Soon



# Balance and AutoSync
### apiEcho
### Tests:
Test Number |  Title | Expected Return Code | Expected Reponse (phase 2)
---|---|---|---
1 | Successful Operation | 0x0|  Coming Soon
2 | Test with 3 RAIDA Down| 0x0 |  Coming Soon
3 | Test with Fracked Coin (3 Bad AN)| 0x0 |  Coming Soon


### apiShowBalance
### Tests:
Test Number |  Title | Expected Return Code | Expected Reponse (phase 2)
---|---|---|---
1 | No Coin Given | 0x1001|  Coming Soon
2 | Empty Coin Parameter | 0x1002|  Coming Soon
3 | Fake/Counterfeit Coin | 0x2001|  Coming Soon
4 | Successful Operation | 0x0|  Coming Soon
5 | Test with 3 RAIDA Down| 0x0 |  Coming Soon
6 | Test with Fracked Coin (3 Bad AN)| 0x0 |  Coming Soon


### apiFixTransferGeneric
### Tests:
Test Number |  Title | Expected Return Code | Expected Reponse (phase 2)
---|---|---|---
1 | No Coin Given | 0x1001|  Coming Soon
2 | Empty Coin Parameter | 0x1002|  Coming Soon
3 | Fake/Counterfeit Coin | 0x2001|  Coming Soon
4 | Successful Operation | 0x0|  Coming Soon
5 | Test with 3 RAIDA Down| 0x0 |  Coming Soon
6 | Test with Fracked Coin (3 Bad AN)| 0x0 |  Coming Soon



# Transfer
### apiTransfer
### Tests:
Test Number |  Title | Expected Return Code | Expected Reponse (phase 2)
---|---|---|---
1 | No Coin Given | 0x1001|  Coming Soon
2 | Empty Coin Parameter | 0x1002|  Coming Soon
3 | Fake/Counterfeit Coin | 0x2001|  Coming Soon
4 | Successful Operation | 0x0|  Coming Soon
5 | Test with 3 RAIDA Down| 0x0 |  Coming Soon
6 | Test with Fracked Coin (3 Bad AN)| 0x0 |  Coming Soon
7 | Missing 'to' Parameter | ? |  Coming Soon
8 | Can't Find DNS That's Being Transfered to|?|  Coming Soon
9 | Missing Amount|?|  Coming Soon
10 | Invalid GUID|?|  Coming Soon
11 | Not Enough CloudCoin|?|  Coming Soon
12 | Surpass Coin Transfer Amount Limit|?|  Coming Soon


### apiViewReceipt
### Tests:
Test Number |  Title | Expected Return Code | Expected Reponse (phase 2)
---|---|---|---
1 | No Coin Given | 0x1001|  Coming Soon
2 | Empty Coin Parameter | 0x1002|  Coming Soon
3 | Fake/Counterfeit Coin | 0x2001|  Coming Soon
4 | Successful Operation | 0x0|  Coming Soon
5 | Test with 3 RAIDA Down| 0x0 |  Coming Soon
6 | Test with Fracked Coin (3 Bad AN)| 0x0 |  Coming Soon
7 | Missing Account|?|  Coming Soon
8 | Missing Tag|?|  Coming Soon
9 | account Invalid Due to Invalid SN|?|  Coming Soon
10 | Invalid Tag|?|  Coming Soon




# Everything else (Incomplete)
### apiDetect
### Tests:
Test Number |  Title | Expected Return Code | Expected Reponse (phase 2)
---|---|---|---
1 | No Coin Given | 0x1001|  Coming Soon
2 | Empty Coin Parameter | 0x1002|  Coming Soon
3 | Fake/Counterfeit Coin | 0x2001|  Coming Soon
4 | Successful Operation | 0x0|  Coming Soon
5 | Test with 3 RAIDA Down| 0x0 |  Coming Soon
6 | Test with Fracked Coin (3 Bad AN)| 0x0 |  Coming Soon


### apiSend
### Tests:
Test Number |  Title | Expected Return Code | Expected Reponse (phase 2)
---|---|---|---
1 | No Coin Given | 0x1001|  Coming Soon
2 | Empty Coin Parameter | 0x1002|  Coming Soon
3 | Fake/Counterfeit Coin | 0x2001|  Coming Soon
4 | Successful Operation | 0x0|  Coming Soon
5 | Test with 3 RAIDA Down| 0x0 |  Coming Soon
6 | Test with Fracked Coin (3 Bad AN)| 0x0 |  Coming Soon


### apiReceive
### Tests:
Test Number |  Title | Expected Return Code | Expected Reponse (phase 2)
---|---|---|---
1 | No Coin Given | 0x1001|  Coming Soon
2 | Empty Coin Parameter | 0x1002|  Coming Soon
3 | Fake/Counterfeit Coin | 0x2001|  Coming Soon
4 | Successful Operation | 0x0|  Coming Soon
5 | Test with 3 RAIDA Down| 0x0 |  Coming Soon
6 | Test with Fracked Coin (3 Bad AN)| 0x0 |  Coming Soon


### embedImage
### Tests:
Test Number |  Title | Expected Return Code | Expected Reponse (phase 2)
---|---|---|---
1 | No Coin Given | 0x1001|  Coming Soon
2 | Empty Coin Parameter | 0x1002|  Coming Soon
3 | Fake/Counterfeit Coin | 0x2001|  Coming Soon
4 | Successful Operation | 0x0|  Coming Soon
5 | Test with 3 RAIDA Down| 0x0 |  Coming Soon
6 | Test with Fracked Coin (3 Bad AN)| 0x0 |  Coming Soon


### extractStack
### Tests:
Test Number |  Title | Expected Return Code | Expected Reponse (phase 2)
---|---|---|---
1 | No Coin Given | 0x1001|  Coming Soon
2 | Empty Coin Parameter | 0x1002|  Coming Soon
3 | Fake/Counterfeit Coin | 0x2001|  Coming Soon
4 | Successful Operation | 0x0|  Coming Soon
5 | Test with 3 RAIDA Down| 0x0 |  Coming Soon
6 | Test with Fracked Coin (3 Bad AN)| 0x0 |  Coming Soon


### apiGetTicket
### Tests:
Test Number |  Title | Expected Return Code | Expected Reponse (phase 2)
---|---|---|---
1 | No Coin Given | 0x1001|  Coming Soon
2 | Empty Coin Parameter | 0x1002|  Coming Soon
3 | Fake/Counterfeit Coin | 0x2001|  Coming Soon
4 | Successful Operation | 0x0|  Coming Soon
5 | Test with 3 RAIDA Down| 0x0 |  Coming Soon
6 | Test with Fracked Coin (3 Bad AN)| 0x0 |  Coming Soon


### apiShowCoins
### Tests:
Test Number |  Title | Expected Return Code | Expected Reponse (phase 2)
---|---|---|---
1 | No Coin Given | 0x1001|  Coming Soon
2 | Empty Coin Parameter | 0x1002|  Coming Soon
3 | Fake/Counterfeit Coin | 0x2001|  Coming Soon
4 | Successful Operation | 0x0|  Coming Soon
5 | Test with 3 RAIDA Down| 0x0 |  Coming Soon
6 | Test with Fracked Coin (3 Bad AN)| 0x0 |  Coming Soon


### apiShowCoinsAsArray
### Tests:
Test Number |  Title | Expected Return Code | Expected Reponse (phase 2)
---|---|---|---
1 | No Coin Given | 0x1001|  Coming Soon
2 | Empty Coin Parameter | 0x1002|  Coming Soon
3 | Fake/Counterfeit Coin | 0x2001|  Coming Soon
4 | Successful Operation | 0x0|  Coming Soon
5 | Test with 3 RAIDA Down| 0x0 |  Coming Soon
6 | Test with Fracked Coin (3 Bad AN)| 0x0 |  Coming Soon


### GetCCByUserNameAndPassword
### Tests:
Test Number |  Title | Expected Return Code | Expected Reponse (phase 2)
---|---|---|---
1 | No Coin Given | 0x1001|  Coming Soon
2 | Empty Coin Parameter | 0x1002|  Coming Soon
3 | Fake/Counterfeit Coin | 0x2001|  Coming Soon
4 | Successful Operation | 0x0|  Coming Soon
5 | Test with 3 RAIDA Down| 0x0 |  Coming Soon
6 | Test with Fracked Coin (3 Bad AN)| 0x0 |  Coming Soon


### apiCreatCCForRegistration
### Tests:
Test Number |  Title | Expected Return Code | Expected Reponse (phase 2)
---|---|---|---
1 | No Coin Given | 0x1001|  Coming Soon
2 | Empty Coin Parameter | 0x1002|  Coming Soon
3 | Fake/Counterfeit Coin | 0x2001|  Coming Soon
4 | Successful Operation | 0x0|  Coming Soon
5 | Test with 3 RAIDA Down| 0x0 |  Coming Soon
6 | Test with Fracked Coin (3 Bad AN)| 0x0 |  Coming Soon


### apiGetCCByCardData
### Tests:
Test Number |  Title | Expected Return Code | Expected Reponse (phase 2)
---|---|---|---
1 | No Coin Given | 0x1001|  Coming Soon
2 | Empty Coin Parameter | 0x1002|  Coming Soon
3 | Fake/Counterfeit Coin | 0x2001|  Coming Soon
4 | Successful Operation | 0x0|  Coming Soon
5 | Test with 3 RAIDA Down| 0x0 |  Coming Soon
6 | Test with Fracked Coin (3 Bad AN)| 0x0 |  Coming Soon


### apiPay
### Tests:
Test Number |  Title | Expected Return Code | Expected Reponse (phase 2)
---|---|---|---
1 | No Coin Given | 0x1001|  Coming Soon
2 | Empty Coin Parameter | 0x1002|  Coming Soon
3 | Fake/Counterfeit Coin | 0x2001|  Coming Soon
4 | Successful Operation | 0x0|  Coming Soon
5 | Test with 3 RAIDA Down| 0x0 |  Coming Soon
6 | Test with Fracked Coin (3 Bad AN)| 0x0 |  Coming Soon
