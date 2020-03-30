import * as abi from './abi.js'
import Web3 from 'web3';
import Fortmatic from 'fortmatic';

const fmPhantom = new Fortmatic.Phantom('pk_test_0DBC72C8476764F8');
const web3 = new Web3(fmPhantom.getProvider());
var contract = new web3.eth.Contract(abi.contractAbi); // need abi of smart contract
contract.options.address = '0x737b4D07e54f19810E5b6214A377dD233eCc3E49';


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
  const address = document.getElementById('address').value;
  const acctName = document.getElementById('name').value;

  await contract.methods.addAddress(address, acctName).send({
    from: userAddress,
    gas: 1500000,
    gasPrice: '3000000000000'
  })
    .on('receipt', (rec) => {
      console.log(rec);
      document.getElementById('status').innerHTML = address + " added to Whitelist";
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
      console.log(whitelist);
    });

  var table = document.getElementById("list");

  for (let i = 0; i < whitelist.length; i++) {
    var row = table.insertRow(0);

    var name = row.insertCell(0);
    var address = row.insertCell(1);

    name.innerHTML = whitelist[i].email;
    address.innerHTML = whitelist[i].whiteAdd;

    name.setAttribute("class", "whitelistName");
    address.setAttribute("class", "address");
  }
}

let getPending = async () => {
  var list = document.getElementById('pendingList');
  while (list != null && list.hasChildNodes()) {
    list.removeChild(list.firstChild);
  }

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

  var table = document.getElementById("pendingList");

  for (let i = 0; i < pending.length; i++) {
    var node = document.createElement('li');
    var nodeLink = document.createElement('a');
    // var textnode = document.createTextNode(txnHash[i])
    // var link = "https://rinkeby.etherscan.io/tx/" + txnHash;
    // nodeLink.appendChild(textnode);
    // nodeLink.title = textnode;
    // nodeLink.href = link;
    // node.append(nodeLink);

    var row = table.insertRow(0);

    var hash = row.insertCell(0);
    var to = row.insertCell(1);
    var amount = row.insertCell(2);

    hash.innerHTML = txnHash[i];
    to.innerHTML = pending[i].txnData.to;
    amount.innerHTML = pending[i].txnData.amount;

    var button = document.createElement('button');
    button.innerHTML = "More Info";
    button.style.backgroundColor = "whitesmoke";
    button.style.borderRadius = "3px";
    button.style.fontSize = "13px";
    button.style.fontWeight = "5px";

    var btnViewHash = row.insertCell(3);
    btnViewHash = button;

    button.addEventListener("click",
      async function () {
        var div = document.getElementById('compositionTx');
        while (div.firstChild) {
          div.removeChild(div.firstChild);
        }

        await getComp(i);
        var compositionNode = document.getElementById('compositionTx');

        var etherLink = document.createElement('a');
        var textnode = document.createTextNode("View on Etherscan")
        var link = "https://rinkeby.etherscan.io/tx/" + txnHash[i];
        etherLink.appendChild(textnode);
        etherLink.title = textnode;
        etherLink.href = link;
        compositionNode.append(etherLink);

        var button2 = document.createElement('button');
        button2.innerHTML = "close";
        button2.style.backgroundColor = "whitesmoke";
        button2.style.borderRadius = "3px";

        var nodeLink2 = document.createElement('a');
        nodeLink2.append(button2);
        button2.addEventListener("click",
          async function () {
            var div = document.getElementById('compositionTx');
            while (div.firstChild) {
              div.removeChild(div.firstChild);
            }
          })

        compositionNode.append(nodeLink2);
        document.getElementById("pendingList").appendChild(node);
      })
    node.append(nodeLink);

    document.getElementById("pendingList").appendChild(node);

    // var opt = document.createElement('option');
    // opt.appendChild(document.createTextNode(i + 1));
    // opt.value = i;

    // document.getElementById("pendTxns").appendChild(opt);
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
