import hre, { ethers } from 'hardhat';
import { getGasOption } from '../utils/gas';
import * as fs from 'fs';
import { Monkey } from '../../typechain';

async function main() {
  const [admin] = await hre.ethers.getSigners();

  const chainId = hre.network.config.chainId || 0;

  const deployedContractJson = fs.readFileSync(
    __dirname + '/monkey.deployed.json',
    'utf-8',
  );
  const deployedContract = JSON.parse(deployedContractJson);
  const monkey = (await ethers.getContractAt(
    deployedContract.abi,
    deployedContract.address,
  )) as Monkey;

  const transaction = await monkey.mint('brown', getGasOption(chainId));
  await transaction.wait();
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
