# Wallete

Wallete is Multi-Signature ethereum wallet that utilizes the Fortmatic Magic Link SDK for the user authentication. This allows the user to interact with the rinkeby (ethereum testnet) without cumbersome passkeys or addresses. The contract the web app interacts with is included in the contracts folder.

## Installation

Ensure that the following tools are installed:

- Node Package Manager `npm`
- Truffle `truffle` (If planning on modifying/compiling contract)

```bash
cd ./demo_app/
npm ci
```

## Usage

To launch on localhost:

```bash
cd ./demo_app/
npm start
```

This should open a webpage to http://localhost:3000/

## Features

Wallete has the login page which authenticates using the Magic link SDK. The DID Token given for the session contains the information neccessary for the web app to do ether transactions.

### Assets

This tab displays the amount of ether that is currently stored on the smart contract that is deployed. The address of the contract is written above the table.

### Whitelist

### Transactions

