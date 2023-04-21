import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { ethers, waffle } from 'hardhat';
import BasicCertificateArtifact from '../artifacts/contracts/BasicCertificate.sol/BasicCertificate.json';
import { BasicCertificate } from '../typechain';

describe('BasicCertificate', () => {
  let basicCertificate: BasicCertificate;

  const [admin, other0, other1, other2, receiver] =
    waffle.provider.getWallets();

  before(async () => {});

  beforeEach(async () => {
    basicCertificate = (await waffle.deployContract(
      admin,
      BasicCertificateArtifact,
      ['BasicCertificate', 'BC'],
    )) as BasicCertificate;
  });

  it('mint', async () => {
    await basicCertificate.mint('Brown');
    const tokenURI = await basicCertificate.tokenURI(1);
    console.log(tokenURI);
  });
});
