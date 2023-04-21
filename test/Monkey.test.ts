import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { ethers, waffle } from 'hardhat';
import MonkeyArtifact from '../artifacts/contracts/Monkey.sol/Monkey.json';
import { Monkey } from '../typechain';

describe('Monkey', () => {
  let monkey: Monkey;

  const [admin, other0, other1, other2, receiver] =
    waffle.provider.getWallets();

  before(async () => {});

  beforeEach(async () => {
    monkey = (await waffle.deployContract(admin, MonkeyArtifact, [
      'Monkey',
      'Mon',
    ])) as Monkey;
  });

  it('mint', async () => {
    await monkey.mint('brown');
    await monkey.mint('james');
    const balance = await monkey.balanceOf(admin.address);
    expect(balance).to.be.equal(BigNumber.from(2));
    const totalSupply = await monkey.totalSupply();
    expect(totalSupply).to.be.equal(BigNumber.from(2));
  });

  it('train', async () => {
    await monkey.mint('brown');
    const level = await monkey.getLevels(1);
    expect(level).to.be.equal(BigNumber.from(1));

    await monkey.train(1);

    const afterLevel = await monkey.getLevels(1);
    expect(afterLevel).to.be.equal(BigNumber.from(2));
  });
});
