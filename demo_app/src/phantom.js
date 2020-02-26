import * as abi from './abi.js'
import Web3 from 'web3';
import Fortmatic from 'fortmatic';

const fmPhantom = new Fortmatic.Phantom('pk_test_0DBC72C8476764F8');
const web3 = new Web3(fmPhantom.getProvider());

var txHash;

var contract = new web3.eth.Contract(abi.contractAbi); // need abi of smart contract

let handleLoginWithMagicLink = async () => {
  const email = document.getElementById('user-email').value;

  fmPhantom.loginWithMagicLink({ email })
    .then((user) => {
      document.getElementById('status').innerHTML = 'Log in successful!'
    })
    .catch((err) => (document.getElementById('status').innerHTML = err));
  document.getElementById('status').innerHTML = 'Magic Link Sent, Please Check your email';
};


let handleIsLoggedIn = async () => {
  alert(await fmPhantom.user.isLoggedIn());
};

let handleLogout = async () => {
  await fmPhantom.user.logout()
    .then(document.getElementById('status').innerHTML = 'Logged out');
};

let handleGetMetadata = async () => {
  const metadata = await fmPhantom.user.getMetadata();
  document.getElementById('status').innerHTML = JSON.stringify(metadata);
};

let deploying = async () => {
  const userAddress = (await fmPhantom.user.getMetadata()).publicAddress;

  contract.deploy({ data: abi.byteCode })
    .send({
      from: userAddress,
      gas: 1500000,
      gasPrice: '3000000000000'
    })
    .on('receipt', (rec) => {
      contract.options.address = rec.contractAddress;
      console.log(rec);
      document.getElementById('status').innerHTML = 'Contract deployed at ' + contract.options.address;
    });
};

let setupTransaction = async () => {
  
}

let addToWhiteList = async () => {
  const userAddress = (await fmPhantom.user.getMetadata()).publicAddress;
  const address = document.getElementById('address').value

  await contract.methods.addAddress(address).send({
    from: userAddress,
    gas: 1500000,
    gasPrice: '3000000000000'
  })
    .then(console.log);
}

let signContract = async () => {
  const userAddress = (await fmPhantom.user.getMetadata()).publicAddress;

  await contract.methods.signTransaction().send({
    from: userAddress,
    gas: 1500000,
    gasPrice: '3000000000000',
    value: '1000000000000000000'
  })
    .then(console.log);

};

let checkStatus = async () => {
  const userAddress = (await fmPhantom.user.getMetadata()).publicAddress;

  await contract.methods.checkStatus().send({
    from: userAddress,
    gas: 1500000,
    gasPrice: '3000000000000'
  })
    .then(console.log);
};


export {
  checkStatus,
  signContract,
  addToWhiteList,
  deploying,
  handleGetMetadata,
  handleLogout,
  handleLoginWithMagicLink,
  handleIsLoggedIn,
  setupTransaction
};