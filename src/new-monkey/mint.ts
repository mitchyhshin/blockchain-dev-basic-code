import hre, { ethers } from 'hardhat';
import { getGasOption } from '../utils/gas';
import * as fs from 'fs';
import { NewMonkey } from '../../typechain';

async function main() {
  const [admin] = await hre.ethers.getSigners();

  const chainId = hre.network.config.chainId || 0;

  const deployedContractJson = fs.readFileSync(
    __dirname + '/new-monkey.deployed.json',
    'utf-8',
  );
  const deployedContract = JSON.parse(deployedContractJson);
  const newMonkey = (await ethers.getContractAt(
    deployedContract.abi,
    deployedContract.address,
  )) as NewMonkey;

  const transaction = await newMonkey.mint(
    admin.address,
    'brown',
    getGasOption(chainId),
  );
  await transaction.wait();
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
