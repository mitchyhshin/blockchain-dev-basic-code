import hre, { ethers } from 'hardhat';
import BasicCertificateArtifact from '../../artifacts/contracts/BasicCertificate.sol/BasicCertificate.json';
import { getGasOption } from '../utils/gas';
import * as fs from 'fs';

async function main() {
  const [admin] = await hre.ethers.getSigners();

  const chainId = hre.network.config.chainId || 0;

  const factory = await ethers.getContractFactory(
    BasicCertificateArtifact.contractName,
  );

  const gasOption = getGasOption(chainId);
  gasOption.gasLimit = 10000000;

  const contract = await factory.deploy('BasicCertificate', 'BC', gasOption);
  const receipt = await contract.deployTransaction.wait();

  const deployedContract = {
    address: contract.address,
    blockNumber: receipt.blockNumber,
    chainId: hre.network.config.chainId,
    abi: BasicCertificateArtifact.abi,
  };

  const filename = __dirname + `/basic.certificate.deployed.json`;

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
