import hre, { ethers } from 'hardhat';
import { getGasOption } from '../utils/gas';
import * as fs from 'fs';
import { Greeter } from '../../typechain';

async function main() {
  const [admin] = await hre.ethers.getSigners();
  const chainId = hre.network.config.chainId || 0;

  const deployedGreeterJson = fs.readFileSync(
    __dirname + '/greeter.deployed.json',
    'utf-8',
  );
  const deployedGreeter = JSON.parse(deployedGreeterJson);
  const greeter = (await ethers.getContractAt(
    deployedGreeter.abi,
    deployedGreeter.address,
  )) as Greeter;

  const gasOption = getGasOption(chainId);
  const option = {
    gasLimit: gasOption.gasLimit,
    gasPrice: gasOption.gasPrice,
    value: ethers.utils.parseUnits('100', 'finney'),
  };

  let transaction = await greeter.setGreetingPayable(
    'setGreetingPayable msg',
    option,
  );
  await transaction.wait();

  transaction = await greeter.setGreeting('setGreeting msg', gasOption);
  await transaction.wait();

  const greetingMsg = await greeter.getGreet();

  console.log('greetingMsg: ' + greetingMsg);

  const historyCount = await greeter.getGreetingHistoryCount();

  console.log('historyCount: ' + historyCount);

  const historyAll = await greeter.getGreetingHistoryAll();

  console.log('historyAll: ' + JSON.stringify(historyAll));

  const firstHistory = await greeter.getGreetingHistoryOne(0);
  console.log('firstHistory: ' + firstHistory);

  const secondHistory = await greeter.getGreetingHistoryOne(1);
  console.log('secondtHistory: ' + secondHistory);

  transaction = await greeter.withdraw(admin.address, getGasOption(chainId));
  await transaction.wait();
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
