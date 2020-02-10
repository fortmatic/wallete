const contract = new web3.eth.Contract(contractAbi); // need abi of smart contract

const handleLoginWithMagicLink = async () => {
  const email = document.getElementById('user-email').value;

  fmPhantom.loginWithMagicLink({ email })
    .then((user) => {
      document.getElementById('status').innerHTML = 'Log in successful!'
    })
    .catch((err) => (document.getElementById('status').innerHTML = err));
  document.getElementById('status').innerHTML = 'Magic Link Sent, Please Check your email';
};


const handleIsLoggedIn = async () => {
  alert(await fmPhantom.user.isLoggedIn());
};

const handleLogout = async () => {
  await fmPhantom.user.logout();
};

let handleGetMetadata = async () => {
  const metadata = await fmPhantom.user.getMetadata();
  alert(JSON.stringify(metadata));
};

const deploying = async () => {
  const userAddress = (await fmPhantom.user.getMetadata()).publicAddress;

  contract.deploy({ data: byteCode })
    .send({
      from: userAddress,
      gas: 1500000,
      gasPrice: '3000000000000'
    })
    .on('receipt', (rec) => {
      contract.options.address = rec.contractAddress;
      console.log(rec);
    });
};

let addWhitelist = async (address) => {
  const userAddress = (await fmPhantom.user.getMetadata()).publicAddress;

  contract.methods.addAddress(address).send({
    from: userAddress,
    gas: 1500000,
    gasPrice: '3000000000000'
  })
    .then(console.log);
}

let signContract = async () => {
  const userAddress = (await fmPhantom.user.getMetadata()).publicAddress;

  contract.methods.signTransaction().send({
    from: userAddress,
    gas: 1500000,
    gasPrice: '3000000000000'
  })
    .then(console.log);

};

let checkStatus = async () => {
  const userAddress = (await fmPhantom.user.getMetadata()).publicAddress;

  contract.methods.returnN().call({
    from: userAddress
  })
    .then(console.log);
};