import hre, { ethers } from 'hardhat';
import MonkeyArtifact from '../../artifacts/contracts/Monkey.sol/Monkey.json';
import { getGasOption } from '../utils/gas';
import * as fs from 'fs';

async function main() {
  const [admin] = await hre.ethers.getSigners();

  const chainId = hre.network.config.chainId || 0;

  const factory = await ethers.getContractFactory(MonkeyArtifact.contractName);
  const contract = await factory.deploy('Monkey', 'Mon', getGasOption(chainId));
  const receipt = await contract.deployTransaction.wait();

  const deployedContract = {
    address: contract.address,
    blockNumber: receipt.blockNumber,
    chainId: hre.network.config.chainId,
    abi: MonkeyArtifact.abi,
  };

  const filename = __dirname + `/monkey.deployed.json`;

  const deployedContractJson = JSON.stringify(deployedContract, null, 2);
  fs.writeFileSync(filename, deployedContractJson, {
    flag: 'w',
    encoding: 'utf8',
  });

  console.log(deployedContractJson);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
