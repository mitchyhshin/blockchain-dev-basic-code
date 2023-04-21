import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { ethers, waffle } from 'hardhat';
import NewMonkeyArtifact from '../artifacts/contracts/NewMonkey.sol/NewMonkey.json';
import { NewMonkey } from '../typechain';

describe('NewMonkey', () => {
  let newMonkey: NewMonkey;

  const [admin, other0, other1, other2, receiver] =
    waffle.provider.getWallets();

  before(async () => {});

  beforeEach(async () => {
    newMonkey = (await waffle.deployContract(admin, NewMonkeyArtifact, [
      'NewMonkey',
      'NMon',
    ])) as NewMonkey;
  });

  it('mint', async () => {
    await newMonkey.mint(admin.address, 'brown');
    await newMonkey.mint(admin.address, 'james');
    const balance = await newMonkey.balanceOf(admin.address);
    expect(balance).to.be.equal(BigNumber.from(2));
    const totalSupply = await newMonkey.totalSupply();
    expect(totalSupply).to.be.equal(BigNumber.from(2));

    await expect(
      newMonkey.connect(other0).mint(other0.address, 'brown'),
    ).to.revertedWith('Caller is not a minter');
  });

  it('train', async () => {
    await newMonkey.mint(admin.address, 'brown');
    const level = await newMonkey.getLevels(1);
    expect(level).to.be.equal(BigNumber.from(1));

    const blockNumber = await ethers.provider.getBlockNumber();
    if (blockNumber % 2 == 0) {
      await ethers.provider.send('evm_mine', []);
    }
    await newMonkey.train(1);

    await expect(newMonkey.train(1)).to.revertedWith('fail train');

    const afterLevel = await newMonkey.getLevels(1);
    expect(afterLevel).to.be.equal(BigNumber.from(2));
  });
});
