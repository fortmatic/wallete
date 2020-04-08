import * as abi from './abi.js'
import Web3 from 'web3';
import Fortmatic from 'fortmatic';

const fmPhantom = new Fortmatic.Phantom('pk_test_0DBC72C8476764F8');
const web3 = new Web3(fmPhantom.getProvider());
export var contract = new web3.eth.Contract(abi.contractAbi); // need abi of smart contract
contract.options.address = '0x737b4D07e54f19810E5b6214A377dD233eCc3E49';


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

let getPending = async () => {
  var list = document.getElementById('pendingList');
  while (list != null && list.hasChildNodes()) {
    list.removeChild(list.firstChild);
  }

  var pending = await contract.methods.getPendingTx().call();
  var txnHash = await contract.methods.getHashes().call();

  console.log(pending);
  console.log(txnHash);

  var table = document.getElementById("list");

  for (let i = 0; i < pending.length; i++) {
    var row = table.insertRow(0);

    var hash = row.insertCell(0);
    hash.setAttribute("id", "rowCol1");

    var to = row.insertCell(1);
    to.setAttribute("id", "rowCol2");

    var amount = row.insertCell(2);
    amount.setAttribute("id", "rowCol3");

    for (let j = 0; j < 10; ++j) {
      to.innerHTML += pending[i].txnData.to[j]
    }
    to.innerHTML += "...";

    amount.innerHTML = pending[i].txnData.amount;

    var button = document.createElement('button');
    for (let j = 0; j < 10; ++j) {
      button.innerHTML += txnHash[i][j];
    }
    button.innerHTML += "...";
    button.style.backgroundColor = "whitesmoke";
    button.style.borderRadius = "3px";
    button.style.fontSize = "13px";
    button.style.fontWeight = "5px";

    hash.appendChild(button);
    
    var open = -1;

    button.addEventListener("click",
      async function () {
        if (open != i) {
          open = i;
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
          //etherLink.title = textnode;
          etherLink.href = link;
          compositionNode.append(etherLink);

          var brake = document.createElement('br');
          compositionNode.append(brake);
          var brake2 = document.createElement('br');
          compositionNode.append(brake2);

          var button2 = document.createElement('button');
          button2.innerHTML = "Sign Transaction";
          button2.style.backgroundColor = "whitesmoke";
          button2.style.borderRadius = "2px";
          button2.style.fontSize = "10px";
          button2.style.fontWeight = "3px";
          compositionNode.append(button2);
          button2.addEventListener("click", await signContract(i));
        }
        else if (open == i) {
          open = -1;
          var div = document.getElementById('compositionTx');
          while (div.firstChild) {
            div.removeChild(div.firstChild);
          }
        }
      })
  }
}

let getComp = async (index) => {
  var pending = await contract.methods.getPendingTx().call();

  var node = document.createElement("div");

  // var title = document.createElement('h2');
  // title.appendChild(document.createTextNode("Composing Transactions"));
  // node.appendChild(title)

  var txnHash = await contract.methods.getHashes().call();

  var textnode0 = document.createElement('p');
  textnode0.appendChild(document.createTextNode("Transaction Hash: " + txnHash[index]));
  node.appendChild(textnode0);

  var textnode = document.createElement('p');
  textnode.appendChild(document.createTextNode("From: " + pending[index].txnData.from));
  node.appendChild(textnode);

  var textnode1 = document.createElement('p');
  textnode1.appendChild(document.createTextNode("To: " + pending[index].txnData.to));
  node.appendChild(textnode1);

  // var textnode2 = document.createElement('p');
  // textnode2.appendChild(document.createTextNode("Amount: " + pending[index].txnData.amount));
  // node.appendChild(textnode2);

  var textnode4 = document.createElement('p');
  textnode4.appendChild(document.createTextNode("Number of Signatures: " + pending[index].numSigs + "/" + pending[index].txnData.threshold));
  node.appendChild(textnode4);

  document.getElementById('compositionTx').appendChild(node);
}

export {
  checkStatus,
  signContract,
  deploying,
  setupTransaction,
  contractConnect,
  getPending,
  getComp
};
