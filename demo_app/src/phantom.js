import * as abi from './abi.js'
import Web3 from 'web3';
import Fortmatic from 'fortmatic';

const fmPhantom = new Fortmatic.Phantom('pk_test_0DBC72C8476764F8');
const web3 = new Web3(fmPhantom.getProvider());
var contract = new web3.eth.Contract(abi.contractAbi); // need abi of smart contract
contract.options.address = '0xb21E4D8cDcb6D0a5f61c6dcb9486F590027e569E';


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
  //const threshold = document.getElementById('threshold').value;
  const threshold = 3;

  var txnHash;

  await contract.methods.setupTransaction(sendAddress, threshold, amount).send({
    from: userAddress,
    gas: 1500000,
    gasPrice: '3000000000000',
    value: amount
  })
    .on('receipt', (rec) => {
      console.log(rec);
      txnHash = rec.transactionHash;
      document.getElementById('status').innerHTML = "Transaction started";
    });

  await contract.methods.setHash(txnHash).send({
    from: userAddress,
    gas: 1500000,
    gasPrice: '3000000000000'
  })
    .then(console.log);
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
  document.getElementById("thing").innerHTML = 'Whitelist of ' + contract.options.address;
  var whitelist;

  var list = document.getElementById('list');
  while (list != null && list.hasChildNodes()) {
    list.removeChild(list.firstChild);
  }

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
  var txnHash;

  await contract.methods.getPendingTx().call()
    .then((rec) => {
      pending = rec;
    });

  await contract.methods.getHashes().call()
    .then((rec) => {
      txnHash = rec;
    });

  console.log(pending);
  console.log(txnHash);

  for (let i = 0; i < pending.length; i++) {
    var node = document.createElement('li');
    var nodeLink = document.createElement('a');
    var textnode = document.createTextNode(txnHash[i])
    var link = "https://rinkeby.etherscan.io/tx/" + txnHash;
    nodeLink.appendChild(textnode);
    nodeLink.title = textnode;
    nodeLink.href = link;
    node.append(nodeLink);
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
  textnode.appendChild(document.createTextNode("From: " + pending[index].txnData.from));
  node.appendChild(textnode);

  var textnode1 = document.createElement('p');
  textnode1.appendChild(document.createTextNode("To: " + pending[index].txnData.to));
  node.appendChild(textnode1);

  var textnode2 = document.createElement('p');
  textnode2.appendChild(document.createTextNode("Amount: " + pending[index].txnData.amount));
  node.appendChild(textnode2);

  var textnode3 = document.createElement('p');
  textnode3.appendChild(document.createTextNode("Threshold: " + pending[index].txnData.threshold));
  node.appendChild(textnode3);

  var textnode4 = document.createElement('p');
  textnode4.appendChild(document.createTextNode("Number of Signatures: " + pending[index].numSigs));
  node.appendChild(textnode4);

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