var abi = contractAbi;

var userAddress;

let deploying = async() => {
    contract.deploy({
    })
        .send({
            data: byteCode,
            from: fmPhantom.user.getMetadata().publicAddress,
            gas: '1000000',
            gasPrice: '1500'
        })
        .then(console.log);
};


var contract = new web3.eth.Contract(abi); // need abi of smart contract 

let addWhitelist = async (address) => {
    contract.methods.addAddress(address).send({
        from: fmPhantom.user.getMetadata().publicAddress
    })
    .then(console.log);
}

let signContract = async () => {
    contract.methods.signTransaction().send({
        from: fmPhantom.user.getMetadata().publicAddress
    })
    .then(console.log);
};

let checkStatus = async () => {
    contract.methods.returnN().call({
        from: fmPhantom.user.getMetadata().publicAddress
    })
    .then(console.log);
}


