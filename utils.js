let getInputValue = (e, name) => {
    let query = "[name='" + name + "']";
    return e.parentNode.querySelector(query).value
  };
  
  let getJsonValue = (e) => {
    let query = "[name='json']";
    return JSON.parse(e.parentNode.querySelector(query).value);
  };
  
  let isString = (s) => {
    return (typeof s === 'string' || s instanceof String)
  };
  
  let calculateHexValue = (value, decimals, BN) => {
    if (!isString(value)) {
      throw new Error('Pass strings to prevent floating point precision issues.')
    }
    const ten = new BN(10);
    const base = ten.pow(new BN(decimals));
  
    if (value === '.') { 
      throw new Error(
      `Invalid value ${value} cannot be converted to`
      + ` base unit with ${decimals} decimals.`); 
    }
  
    // Split it into a whole and fractional part
    let comps = value.split('.');
    if (comps.length > 2) { throw new Error('Too many decimal points'); }
  
    let whole = comps[0], fraction = comps[1];
  
    if (!whole) { whole = '0'; }
    if (!fraction) { fraction = '0'; }
    if (fraction.length > decimals) { 
      throw new Error('Too many decimal places'); 
    }
  
    while (fraction.length < decimals) {
      fraction += '0';
    }
  
    whole = new BN(whole);
    fraction = new BN(fraction);
    let result = (whole.mul(base)).add(fraction);
  
    return web3.utils.toHex(result);
  };