let handleLoginWithMagicLink = (e) => {
  fmPhantom.loginWithMagicLink({email: getInputValue(e, 'email')}).then((user) => {
    document.getElementById('status').innerHTML = 'Log in successful!'
  }).catch((err) => (document.getElementById('status').innerHTML = err));
  document.getElementById('status').innerHTML = 'Magic Link Sent, Please Check your email'
};

let handleGetDecentralizedIdToken = async () => {
  if (await fmPhantom.user.isLoggedIn())  {
    const dat = await fmPhantom.user.getIdToken();
    document.getElementById('your-id-token').innerHTML = dat;
  }
  else alert('Please log in to generate an id token');
};

let handleIsLoggedIn = async () => {
  alert(await fmPhantom.user.isLoggedIn());
};

let handleGetMetadata = async () => {
  const metadata = await fmPhantom.user.getMetadata();
  alert(JSON.stringify(metadata));
}

let handleLogout = async () => {
  await fmPhantom.user.logout();
  document.getElementById('status').innerHTML = 'Login Status'
};

/**
 * Web3 methods
*/
let handleEthSendTransaction = (e) => {
  let value = web3.utils.toWei(getInputValue(e, 'value'), 'ether');
  let to = getInputValue(e, 'to');
  web3.eth.sendTransaction({
    from: placeholderAddress,
    to: to,
    value: value
  }).once('transactionHash', (txnHash) => {
    console.log(txnHash);
  });
};

let handleGetAccounts = () => {
  web3.eth.getAccounts().then(console.log);
};

let handleGetCoinbase = () => {
  web3.eth.getCoinbase().then(console.log);
};

let handleProviderEnable = () => {
  web3.currentProvider.enable().then(console.log);
};

let handlePersonalSign = (e) => {
  let message = getInputValue(e, 'message');
  web3.eth.getAccounts((err, accounts) => {
    if (err) return console.error(err);
    var from = accounts[0];
    var params = [message, from];
    var method = 'personal_sign';
    web3.currentProvider.sendAsync({
      id: 1,
      method,
      params,
      from,
    }, (err, result) => {
      if (err) return console.error(err);
      if (result.error) return console.error(result.error);
      console.log(result);
    })
  });
};

let handleSignTypedData = (e) => {
  let json = getJsonValue(e);
  web3.eth.getAccounts((err, accounts) => {
    if (err) return console.error(err);
    var from = accounts[0];
    var params = [json, from];
    var method = 'eth_signTypedData';
    web3.currentProvider.sendAsync({
      id: 1,
      method,
      params,
      from,
    }, (err, result) => {
      if (err) return console.error(err);
      if (result.error) return console.error(result.error);
      console.log(result);
    })
  });
};


let handleERC20Transfer = (e) => {
  let value = getInputValue(e, 'value');
  let to = getInputValue(e, 'to');
  let contractAddress = getInputValue(e, 'contract-address');
  let erc20Contract = new web3.eth.Contract(erc20ContractAbi, contractAddress);
  erc20Contract.methods.decimals().call().then((decimals) => {
    // Calculate contract compatible value for transfer with proper decimal points using BigNumber
    let calculatedValue = calculateHexValue(value, decimals, web3.utils.BN);
    erc20Contract
        .methods
        .transfer(to, calculatedValue)
        .send({ from: placeholderAddress }, (err, txnHash) => {
        console.log(err);
        console.log(txnHash);
    });
  });
};

let handleERC20Approve = (e) => {
  let amount = getInputValue(e, 'amount');
  let address = getInputValue(e, 'address');
  let contractAddress = getInputValue(e, 'contract-address');
  let erc20Contract = new web3.eth.Contract(erc20ContractAbi, contractAddress);
  erc20Contract.methods.decimals().call().then((decimals) => {
    // Calculate contract compatible value for transfer with proper decimal points using BigNumber
    let calculatedValue = calculateHexValue(amount, decimals, web3.utils.BN);
    erc20Contract
        .methods
        .approve(address, calculatedValue)
        .send({ from: placeholderAddress }, (err, txnHash) => {
        console.log(err);
        console.log(txnHash);
    });
  });
};

let handleERC20TransferFrom = (e) => {
  let value = getInputValue(e, 'value');
  let from = getInputValue(e, 'from');
  let to = getInputValue(e, 'to');
  let contractAddress = getInputValue(e, 'contract-address');
  let erc20Contract = new web3.eth.Contract(erc20ContractAbi, contractAddress);
  erc20Contract.methods.decimals().call().then((decimals) => {
    // Calculate contract compatible value for transfer with proper decimal points using BigNumber
    web3.eth.getAccounts().then((accounts) => {
      let calculatedValue = calculateHexValue(value, decimals, web3.utils.BN);
      erc20Contract
          .methods
          .transferFrom(from, to, calculatedValue)
          .send({ from: accounts[0] }, (err, txnHash) => {
          console.log(err);
          console.log(txnHash);
      });
    });
  });
};