import hre, { ethers } from 'hardhat';
import PresaleArtifact from '../../artifacts/contracts/Presale.sol/Presale.json';
import { getGasOption } from '../utils/gas';
import * as fs from 'fs';
import { Momo, NewMonkey } from '../../typechain';
import { BigNumber } from '@ethersproject/bignumber';

async function main() {
  const [admin] = await hre.ethers.getSigners();

  const chainId = hre.network.config.chainId || 0;

  let deployedContractJson = fs.readFileSync(
    __dirname + '/../new-monkey/new-monkey.deployed.json',
    'utf-8',
  );
  const newMonkeyDeployedContract = JSON.parse(deployedContractJson);

  deployedContractJson = fs.readFileSync(
    __dirname + '/../momo/momo.deployed.json',
    'utf-8',
  );
  const momoDeployedContract = JSON.parse(deployedContractJson);

  const factory = await ethers.getContractFactory(PresaleArtifact.contractName);
  const contract = await factory.deploy(
    newMonkeyDeployedContract.address,
    momoDeployedContract.address,
    getGasOption(chainId),
  );

  const receipt = await contract.deployTransaction.wait();

  const newMonkey = (await ethers.getContractAt(
    newMonkeyDeployedContract.abi,
    newMonkeyDeployedContract.address,
  )) as NewMonkey;

  const receipt2 = await newMonkey.grantRole(
    await newMonkey.MINTER_ROLE(),
    contract.address,
  );
  await receipt2.wait();

  const momo = (await ethers.getContractAt(
    momoDeployedContract.abi,
    momoDeployedContract.address,
  )) as Momo;

  const MAX_UINT256: BigNumber = BigNumber.from(
    '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
  );

  const receipt3 = await momo.approve(contract.address, MAX_UINT256);
  await receipt3.wait();

  const deployedContract = {
    address: contract.address,
    blockNumber: receipt.blockNumber,
    chainId: hre.network.config.chainId,
    abi: PresaleArtifact.abi,
  };

  const filename = __dirname + `/presale.deployed.json`;

  deployedContractJson = JSON.stringify(deployedContract, null, 2);
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
