import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { ethers, waffle } from 'hardhat';
import PresaleArtifact from '../artifacts/contracts/Presale.sol/Presale.json';
import { Presale } from '../typechain';
import NewMonkeyArtifact from '../artifacts/contracts/NewMonkey.sol/NewMonkey.json';
import { NewMonkey } from '../typechain';
import MomoArtifact from '../artifacts/contracts/Momo.sol/Momo.json';
import { Momo } from '../typechain';

describe('NewMonkey', () => {
  let momo: Momo;
  let newMonkey: NewMonkey;
  let presale: Presale;

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
  });

  it('test buy', async () => {
    expect(await newMonkey.owner()).to.be.equal(admin.address);

    expect(
      await newMonkey.hasRole(await newMonkey.MINTER_ROLE(), admin.address),
    ).to.be.equal(true);

    const MAX_UINT256: BigNumber = BigNumber.from(
      '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
    );

    await momo.approve(presale.address, MAX_UINT256);

    await expect(presale.buy('brown')).to.revertedWith(
      'Caller is not a minter',
    );

    await newMonkey.grantRole(await newMonkey.MINTER_ROLE(), presale.address);

    await presale.buy('brown');

    const tokenOwner = await newMonkey.ownerOf(1);

    expect(tokenOwner).to.be.equal(admin.address);
  });

  it('presale over', async () => {
    const MAX_UINT256: BigNumber = BigNumber.from(
      '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
    );

    await momo.approve(presale.address, MAX_UINT256);

    await newMonkey.grantRole(await newMonkey.MINTER_ROLE(), presale.address);

    await presale.buy('brown');
    await presale.buy('brown');
    await presale.buy('brown');
    await presale.buy('brown');
    await presale.buy('brown');

    await expect(presale.buy('brown')).to.revertedWith('Presale is over');
  });
});
