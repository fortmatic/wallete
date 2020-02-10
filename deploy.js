var abi = contractAbi;

var userAddress;

let deploying = async() => {
    contract.deploy({
    })
        .send({
            data: byteCode,
            from: publicAdd,
            gas: '1000000',
            gasPrice: '1500'
        })
        .then(console.log);
};


var contract = new web3.eth.Contract(abi); // need abi of smart contract 

let addWhitelist = async (address) => {
    contract.methods.addAddress(address).send({
        from: publicAdd
    })
    .then(console.log);
}

let signContract = async () => {
    contract.methods.signTransaction().send({
        from: publicAdd
    })
    .then(console.log);
};



