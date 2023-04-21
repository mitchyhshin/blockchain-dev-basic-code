const Web3 = require('web3');
const newMonkeyContract = require('../../src/new-monkey/new-monkey.deployed.json');
const presaleContract = require('../../src/presale/presale.deployed.json');
const momoContract = require('../../src/momo/momo.deployed.json');

(async () => {
  let currentAccount = '';

  if (window.ethereum && window.ethereum.isMetaMask == true) {
    console.log('ready metamask');
  } else {
    console.log('no metamask');
  }

  window.ethereum.removeAllListeners();

  function accountsChanged(accounts) {
    console.log('on accountsChanged: ' + JSON.stringify(accounts));

    const selectedAccount = document.getElementById('selectedAccount');
    selectedAccount.innerText = accounts[0];
    currentAccount = accounts[0];
  }

  function chainIdChanged(chainId) {
    console.log('on chainChanged: ' + chainId);

    const selectedChainId = document.getElementById('selectedChainId');
    selectedChainId.innerText = Web3.utils.hexToNumberString(chainId);
  }

  window.ethereum.on('accountsChanged', accountsChanged);

  window.ethereum.on('chainChanged', chainId => {
    chainIdChanged(chainId);
  });

  window.ethereum.on('connect', connectInfo => {
    console.log('on connect: ' + JSON.stringify(connectInfo));
  });

  window.ethereum.on('disconnect', error => {
    console.log('on disconnect: ' + JSON.stringify(error));
  });

  window.ethereum.on('message', message => {
    console.log('on message: ' + JSON.stringify(message));
  });

  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts',
  });

  accountsChanged(accounts);

  const chainId = await window.ethereum.request({ method: 'eth_chainId' });

  chainIdChanged(chainId);

  const web3 = new Web3();
  var newMonkey = new web3.eth.Contract(
    newMonkeyContract.abi,
    newMonkeyContract.address,
  );
  const data = newMonkey.methods.balanceOf(currentAccount).encodeABI();

  const balanceOfParam = {
    from: currentAccount,
    to: newMonkeyContract.address,
    data: data,
  };

  const myBalance = await window.ethereum.request({
    method: 'eth_call',
    params: [balanceOfParam],
  });

  const newMonkeyBalance = document.getElementById('newMonkeyBalance');
  newMonkeyBalance.innerText = Web3.utils.hexToNumberString(myBalance);

  const totalSupplydata = newMonkey.methods.totalSupply().encodeABI();

  const totalSupplyParam = {
    from: currentAccount,
    to: newMonkeyContract.address,
    data: totalSupplydata,
  };

  const totalSupply = await window.ethereum.request({
    method: 'eth_call',
    params: [totalSupplyParam],
  });

  const newMonkeyTotalSupply = document.getElementById('newMonkeyTotalSupply');
  newMonkeyTotalSupply.innerText = Web3.utils.hexToNumberString(totalSupply);

  const mintButton = document.getElementById('mintButton');
  mintButton.onclick = async function mint() {
    const web3 = new Web3();

    var momo = new web3.eth.Contract(momoContract.abi, momoContract.address);

    const allowanceData = momo.methods
      .allowance(currentAccount, presaleContract.address)
      .encodeABI();

    const allowanceParam = {
      from: currentAccount,
      to: momoContract.address,
      data: allowanceData,
    };

    const allowance = await window.ethereum.request({
      method: 'eth_call',
      params: [allowanceParam],
    });

    if (Web3.utils.hexToNumberString(allowance) == '0') {
      const approveData = momo.methods
        .approve(
          presaleContract.address,
          '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
        )
        .encodeABI();

      const approveParam = {
        from: currentAccount,
        to: momoContract.address,
        gasLimit: Web3.utils.toHex('5000000'),
        gasPrice: Web3.utils.toHex(Web3.utils.toWei('750', 'gwei')),
        value: Web3.utils.toHex('0'),
        data: approveData,
      };

      await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [approveParam],
      });

      return;
    }

    var presale = new web3.eth.Contract(
      presaleContract.abi,
      presaleContract.address,
    );

    const data = presale.methods.buy('front').encodeABI();

    const param = {
      from: currentAccount,
      to: presaleContract.address,
      gasLimit: Web3.utils.toHex('5000000'),
      gasPrice: Web3.utils.toHex(Web3.utils.toWei('750', 'gwei')),
      value: Web3.utils.toHex('0'),
      data: data,
    };

    const transactionHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [param],
    });

    const txHash = document.getElementById('txHash');
    txHash.innerText = transactionHash;
  };
})();
