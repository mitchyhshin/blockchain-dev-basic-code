import hre, { ethers } from 'hardhat';
import PresaleArtifact from '../../artifacts/contracts/Presale.sol/Presale.json';
import { getGasOption } from '../utils/gas';
import * as fs from 'fs';
import { Presale } from '../../typechain';

async function main() {
  const [admin] = await hre.ethers.getSigners();

  const chainId = hre.network.config.chainId || 0;

  const deployedContractJson = fs.readFileSync(
    __dirname + '/presale.deployed.json',
    'utf-8',
  );
  const deployedContract = JSON.parse(deployedContractJson);
  const presale = (await ethers.getContractAt(
    deployedContract.abi,
    deployedContract.address,
  )) as Presale;

  const estimateGas = await presale.estimateGas.buy('front');
  console.log(estimateGas.toString());
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
