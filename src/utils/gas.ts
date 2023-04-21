import { ethers } from 'hardhat';

export function getGasOption(chainId: number) {
  if (chainId == 1001 || chainId == 8217) {
    return {
      gasLimit: 5000000,
      gasPrice: ethers.utils.parseUnits('750', 'gwei'),
    };
  } else {
    throw new Error('unknown chainId ' + chainId);
  }
}
