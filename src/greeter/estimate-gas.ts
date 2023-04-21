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

  const estimateGas = await greeter.estimateGas.setGreeting('setGreeting msg');
  console.log(estimateGas);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
