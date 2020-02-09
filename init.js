// Initialize elements and events (no need to change)
const defaultValue = 0.01;
const defaultAddress = '0x09ce806Ed04eE2011A70267A6918AD8D3202dDc1';
const defaultFromAddress = '0x0954180A2F7502DD24041f3527E4C689Fbd36C84';

const defaultApproveAmount = 999000000000.005;

// Set default values
let inputsValue = document.getElementsByName('value');
inputsValue.forEach((e) => {
  e.setAttribute('value', defaultValue);
});

// Set default approve amount
let inputsAmount = document.getElementsByName('amount');
inputsAmount.forEach((e) => {
  e.setAttribute('value', defaultApproveAmount);
});

// Set default to address
let inputsTo = document.getElementsByName('to');
inputsTo.forEach((e) => {
  e.setAttribute('value', defaultAddress);
});

// Set default approve address
let inputsAddress = document.getElementsByName('address');
inputsAddress.forEach((e) => {
  e.setAttribute('value', defaultAddress);
});

// Set default from address
let inputsFrom = document.getElementsByName('from');
inputsFrom.forEach((e) => {
  e.setAttribute('value', defaultFromAddress);
});

// Set default to json
let inputsJson = document.getElementsByName('json');
inputsJson.forEach((e) => {
  let json = `[
  {
    "type": "string",
    "name": "fullName",
    "value": "John Doe"
  },
  {
    "type": "uint32",
    "name": "userId",
    "value": "1234"
  }
]`;
  e.innerText = json;
});