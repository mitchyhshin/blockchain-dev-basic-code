import hre, { ethers } from 'hardhat';
import NewMonkeyArtifact from '../../artifacts/contracts/NewMonkey.sol/NewMonkey.json';
import { getGasOption } from '../utils/gas';
import * as fs from 'fs';

async function main() {
  const [admin] = await hre.ethers.getSigners();

  const chainId = hre.network.config.chainId || 0;

  const factory = await ethers.getContractFactory(
    NewMonkeyArtifact.contractName,
  );
  const contract = await factory.deploy(
    'NewMonkey',
    'NMon',
    getGasOption(chainId),
  );
  const receipt = await contract.deployTransaction.wait();

  const deployedContract = {
    address: contract.address,
    blockNumber: receipt.blockNumber,
    chainId: hre.network.config.chainId,
    abi: NewMonkeyArtifact.abi,
  };

  const filename = __dirname + `/new-monkey.deployed.json`;

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
