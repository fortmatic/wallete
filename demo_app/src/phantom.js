import * as abi from './abi.js'
import Web3 from 'web3';
import Fortmatic from 'fortmatic';

const fmPhantom = new Fortmatic.Phantom('pk_test_0DBC72C8476764F8');
const web3 = new Web3(fmPhantom.getProvider());
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
      gas: 4000000,
      gasPrice: '3000000000000'
    })
    .on('receipt', (rec) => {
      contract.options.address = rec.contractAddress;
      console.log(rec);
      document.getElementById('status').innerHTML = 'Contract deployed at ' + contract.options.address;
    });
};

let setupTransaction = async () => {
  const userAddress = (await fmPhantom.user.getMetadata()).publicAddress;
  const amount = document.getElementById('exchangeAmt').value;
  const sendAddress = document.getElementById('sendAddress').value;
  const threshold = document.getElementById('threshold').value;

  await contract.methods.setupTransaction(sendAddress, threshold, amount).send({
    from: userAddress,
    gas: 1500000,
    gasPrice: '3000000000000',
    value: amount
  })
    .on('receipt', (rec) => {
      console.log(rec);
      document.getElementById('status').innerHTML = "Transaction started";
    });
}

let addToWhiteList = async () => {
  const userAddress = (await fmPhantom.user.getMetadata()).publicAddress;
  const address = document.getElementById('address').value

  await contract.methods.addAddress(address).send({
    from: userAddress,
    gas: 1500000,
    gasPrice: '3000000000000'
  })
    .on('receipt', (rec) => {
      console.log(rec);
      document.getElementById('status').innerHTML = rec.events.AddedWhiteList.returnValues[0] + " added to Whitelist";
    });
}

let signContract = async (index) => {
  const userAddress = (await fmPhantom.user.getMetadata()).publicAddress;

  await contract.methods.signTransaction(index).send({
    from: userAddress,
    gas: 1500000,
    gasPrice: '3000000000000'
  })
    .on('receipt', (rec) => {
      console.log(rec);
      if (rec.events.transactionOccured != null) {
        document.getElementById('status').innerHTML = "Transacted " + rec.events.transactionOccured.returnValues[0]
          + " to " + rec.events.transactionOccured.returnValues[1];
      }
      else {
        document.getElementById('status').innerHTML = rec.events.SignedTransact.returnValues[0] + " signed transaction";
      }
    });
};

let checkStatus = async () => {
  const userAddress = (await fmPhantom.user.getMetadata()).publicAddress;
  var index;

  await contract.methods.checkStatus(index).send({
    from: userAddress,
    gas: 1500000,
    gasPrice: '3000000000000'
  })
    .then(console.log);
};

let contractConnect = () => {
  contract.options.address = document.getElementById('contractAdd').value;
  document.getElementById('status').innerHTML = 'Contract connected at ' + contract.options.address;
}

let getBalance = async () => {
  await contract.methods.contractBalance().call()
    .then((rec) => {
      document.getElementById('balance').innerHTML = rec;
    });
}

let getWhitelist = async () => {
  var whitelist;

  await contract.methods.getWhitelistAdd().call()
    .then((rec) => {
      whitelist = rec;
    });

  for (let i = 0; i < whitelist.length; i++) {
    var node = document.createElement("LI");
    var textnode = document.createTextNode(whitelist[i]);
    node.appendChild(textnode);
    document.getElementById("list").appendChild(node);
  }
}

let getPending = async () => {
  var pending;

  await contract.methods.getPendingTx().call()
    .then((rec) => {
      pending = rec;
    });

  for (let i = 0; i < pending.length; i++) {
    var node = document.createElement("LI");
    var textnode = document.createTextNode(pending[i].to);
    node.appendChild(textnode);
    document.getElementById("pendingList").appendChild(node);

    var opt = document.createElement('option');
    opt.appendChild(document.createTextNode(i + 1));
    opt.value = i;

    document.getElementById("pendTxns").appendChild(opt);
  }
}

let getComp = async (index) => {
  var pending;

  await contract.methods.getPendingTx().call()
    .then((rec) => {
      pending = rec;
    });

  var node = document.createElement("div");

  var title = document.createElement('h2');
  title.appendChild(document.createTextNode("Composing Transactions"));
  node.appendChild(title)

  var textnode = document.createElement('p');
  textnode.appendChild(document.createTextNode("From: " + pending[index].from));
  node.appendChild(textnode);

  var textnode1 = document.createElement('p');
  textnode1.appendChild(document.createTextNode("To: " + pending[index].to));
  node.appendChild(textnode1);

  var textnode2 = document.createElement('p');
  textnode2.appendChild(document.createTextNode("Amount: " + pending[index].amount));
  node.appendChild(textnode2);

  var textnode3 = document.createElement('p');
  textnode3.appendChild(document.createTextNode("Threshold: " + pending[index].threshold));
  node.appendChild(textnode3);

  document.getElementById('compositionTx').appendChild(node);
}

export {
  checkStatus,
  signContract,
  addToWhiteList,
  deploying,
  handleGetMetadata,
  handleLogout,
  handleLoginWithMagicLink,
  handleIsLoggedIn,
  setupTransaction,
  contractConnect,
  getBalance,
  getWhitelist,
  getPending,
  getComp
};