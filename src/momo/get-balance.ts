import hre, { ethers } from 'hardhat';
import { getGasOption } from '../utils/gas';
import * as fs from 'fs';
import { Momo } from '../../typechain';

async function main() {
  const [admin] = await hre.ethers.getSigners();

  const chainId = hre.network.config.chainId || 0;

  const deployedContractJson = fs.readFileSync(
    __dirname + '/momo.deployed.json',
    'utf-8',
  );
  const deployedContract = JSON.parse(deployedContractJson);
  const momo = (await ethers.getContractAt(
    deployedContract.abi,
    deployedContract.address,
  )) as Momo;

  const adminBalance = await momo.balanceOf(admin.address);

  console.log(adminBalance);
  console.log(ethers.utils.formatEther(adminBalance));
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
