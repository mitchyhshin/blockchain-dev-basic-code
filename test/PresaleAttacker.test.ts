import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { ethers, waffle } from 'hardhat';
import PresaleArtifact from '../artifacts/contracts/Presale.sol/Presale.json';
import { Presale } from '../typechain';
import PresaleAttackerArtifact from '../artifacts/contracts/PresaleAttacker.sol/PresaleAttacker.json';
import { PresaleAttacker } from '../typechain';
import NewMonkeyArtifact from '../artifacts/contracts/NewMonkey.sol/NewMonkey.json';
import { NewMonkey } from '../typechain';
import MomoArtifact from '../artifacts/contracts/Momo.sol/Momo.json';
import { Momo } from '../typechain';

describe('NewMonkey', () => {
  let momo: Momo;
  let newMonkey: NewMonkey;
  let presale: Presale;
  let presaleAttacker: PresaleAttacker;

  const initial = ethers.utils.parseUnits('1000000000', 'ether');

  const [admin, other0, other1, other2, receiver] =
    waffle.provider.getWallets();

  before(async () => {});

  beforeEach(async () => {
    momo = (await waffle.deployContract(admin, MomoArtifact, [
      'Momo',
      'Mom',
      initial,
    ])) as Momo;

    newMonkey = (await waffle.deployContract(admin, NewMonkeyArtifact, [
      'NewMonkey',
      'NMon',
    ])) as NewMonkey;

    presale = (await waffle.deployContract(admin, PresaleArtifact, [
      newMonkey.address,
      momo.address,
    ])) as Presale;

    presaleAttacker = (await waffle.deployContract(
      admin,
      PresaleAttackerArtifact,
      [presale.address, momo.address],
    )) as PresaleAttacker;

    await newMonkey.grantRole(await newMonkey.MINTER_ROLE(), presale.address);

    await momo.transfer(
      presaleAttacker.address,
      BigNumber.from(10).pow(18).mul(100000),
    );
  });

  it('attack', async () => {
    await presaleAttacker.attack();
    await expect(presaleAttacker.attack()).to.revertedWith('Presale is over');
  });
});
