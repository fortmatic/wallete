# Wallete

Wallete is Multi-Signature ethereum wallet that utilizes the Fortmatic Magic Link SDK. This runs 

## Installation

Ensure that the following tools are installed:

- Node Package Manager
- Truffle (If planning on modifying/compiling contract)

```bash
cd ./demo_app/
npm ci
```

## Usage

To launch on localhost:

`cd ./demo_app/`
`npm start`

## Features

Wallete has the login page which authenticates using the Magic link SDK. The DID Token given for that session 

### Assets

This tab displays the amount of ether that is currently stored on the smart contract that is deployed. The address of the contract is written above the table.

### Whitelist

### Transactions

## Authors and acknowledgment

This project was made by:

Sai Pavan Yerra (spvyerra)
Sangil Lee (iisangil)
Helen Gao (hegaoo)


Prototype of using Whitelabel SDK for signing and adding keys to a smart contract.

The prototype of this application can be on rinkeby or local.
The goal is to demonstrate using the Whitelabel SDK as one of the keys to sign the approval message.

Use Whitelabel SDK to add one key to the smart contract
Use Whitelabel SDK to sign a transaction
Show that the smart contract can send out transaction after it collects n-of-m signatures (this given)
