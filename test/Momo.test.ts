import { expect } from 'chai';
import { ethers, waffle } from 'hardhat';
import MomoArtifact from '../artifacts/contracts/Momo.sol/Momo.json';
import { Momo } from '../typechain';

describe('Momo', () => {
  let momo: Momo;
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
  });

  it('constructor', async () => {
    const totalSupply = await momo.totalSupply();
    expect(totalSupply).to.be.equal(initial);
    const balance = await momo.balanceOf(admin.address);
    expect(balance).to.be.equal(initial);
  });
});
